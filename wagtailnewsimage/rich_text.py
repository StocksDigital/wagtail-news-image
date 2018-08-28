"""
Defines custom embeds for the Wagtail admin WYSIWYG editor
These embeds are registered with Wagtail in wagtail_hooks.py
"""
import logging

from draftjs_exporter.dom import DOM
from wagtail.admin.rich_text.converters.contentstate_models import Entity
from wagtail.admin.rich_text.converters.html_to_contentstate import AtomicBlockEntityElementHandler
from wagtail.images import formats, get_image_model
from wagtail.images.formats import Format

from .monkey_patch import get_rendition_or_not_found_patch

logger = logging.getLogger(__name__)


def news_image_entity_decorator(props):
    """
    Convert our custom image embed from the Draft.js ContentState data into database HTML.
    """
    return DOM.create_element('embed', {
        'embedtype': 'news-image',
        'id': props.get('id'),
        'alt': props.get('alt'),
        'title': props.get('title'),
        'href': props.get('href'),
        'width': props.get('width'),
    })


class NewsImageEntityElementHandler(AtomicBlockEntityElementHandler):
    def create_entity(self, name, attrs, state, contentstate):
        """
        Format a custom image entity out of database HTML into the Draft.js ContentState format.
        """
        return Entity('NEWS-IMAGE', 'MUTABLE', {
            'id': attrs.get('id'),
            'title': attrs.get('title'),
            'alt': attrs.get('alt'),
            'href': attrs.get('href'),
            'width': attrs.get('width'),
        })


def news_image_embedtype_handler(attrs, images=[]):
    """
    Converts image embed from its database form into HTML for display in the front end.
    You can insert `images` using a custom richtext template tag
    """
    attrs['alt'] = attrs.get('alt', '')

    if attrs.get('title'):
        title_html = '<figcaption>{}</figcaption>'.format(attrs['title'])
    else:
        title_html = ''

    image_html = image_embedtype_handler(attrs, images=images)

    if attrs.get('href'):
        image_html = '<a href="{}">{}</a>'.format(attrs['href'], image_html)

    return image_html + title_html


# Monkey patch Wagtail's wagtail.images.shortcuts.get_rendition_or_not_found
# so we can take advantage of prefetch_related('renditions') in image_embedtype_handler below
formats.get_rendition_or_not_found = get_rendition_or_not_found_patch


def image_embedtype_handler(attrs, images=[]):
    """
    Reimplementation of wagtail.images.rich_text.image_embedtype_handler (v2)
    Turns an <embed>'s attributes (attrs) into a valid <img> tag.

    Uses an in-memory list of Images (images) to try and find the image locally
    before querying the database.
    """
    Image = get_image_model()  # noqa: N806

    image_id = attrs.get('id', '')
    alt_text = attrs.get('alt', '')
    width = attrs.get('width', '')

    # Handle the case where the embed has a blank or missing 'id' attribute
    # eg. <embed embedtype="news-image" id=""/><embed>
    if not str.isdigit(image_id):
        logger.error('Image embed does not have a valid id: {}'.format(attrs))
        return '<img>'

    # Try to efficiently fetch image from local memory
    image = None
    for img in images:
        if str(img.pk) == image_id:
            image = img

    # Default to fetching the image from the database if it is not found in images
    if not image:
        try:
            image = Image.objects.prefetch_related('renditions').get(id=image_id)
        except Image.DoesNotExist:
            return '<img>'

    # Figure out how we will format the image rendition
    if str.isdigit(width):
        # Use a custom width rendition if the embed has a width specified
        filter_spec = 'width-{}'.format(width)
        image_format = Format(
            filter_spec=filter_spec,
            classnames='richtext-image',
            # Unused required fields
            name='_',
            label='_',
        )
    else:
        # Use the default 'fullwidth' rendition if no width is specified
        format_name = attrs.get('format', 'fullwidth')
        image_format = formats.get_image_format(format_name)

    return image_format.image_to_html(image, alt_text)
