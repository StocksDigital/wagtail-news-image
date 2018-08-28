"""
Register the image block with Wagtail.
"""
import json

from django.contrib.staticfiles.templatetags.staticfiles import static
from django.urls import reverse
from django.utils.html import format_html_join
from wagtail.admin.rich_text.editors.draftail.features import EntityFeature
from wagtail.core import hooks

from .rich_text import NewsImageEntityElementHandler, news_image_embedtype_handler, news_image_entity_decorator


@hooks.register('insert_editor_js')
def editor_js():
    """
    Add custom JS for Wagtail editor admin
    """
    # Load data into the client
    frontend_data = {
        'API_URL': reverse('news_images_api'),
    }
    load_js_data = '<script>var NEWS_IMAGE = JSON.parse(\'{json}\')</script>'.format(
        json=json.dumps(frontend_data)
    )

    # Load JavaScript code into client
    js_files = (
        # draftail.js must be loaded before custom Draftail elements.
        'wagtailadmin/js/draftail.js',
        'wagtailnewsimage/js/wagtailnewsimage.js',
    )
    js_file_paths = [(static(filename),) for filename in js_files]
    template = '<script type="text/javascript" src="{}"></script>'
    js_code = format_html_join('\n', template, js_file_paths)

    return load_js_data + js_code


@hooks.register('register_rich_text_features')
def register_embed_features(features):
    """Register custom richtext features with the Draftail editor"""
    block_name = 'news-image'
    block_type = 'NEWS-IMAGE'
    feature_data = {
        'type': block_type,
        'description': 'Image',
        'icon': 'image',
    }

    # Register embed
    features.register_embed_type(block_name, news_image_embedtype_handler)

    # Register new editor feature with Draftail frontend
    features.register_editor_plugin('draftail', block_name, EntityFeature(feature_data))

    # Register conversion rules Wagtail backend
    features.register_converter_rule('contentstate', block_name, {
        'from_database_format': {
            'embed[embedtype="news-image"]': NewsImageEntityElementHandler()
        },
        'to_database_format': {
            'entity_decorators': {
                block_type: news_image_entity_decorator
            }
        },
    })
