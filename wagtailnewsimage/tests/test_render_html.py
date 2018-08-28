
import io

import pytest
from django.core.files.images import ImageFile
from wagtail.core.templatetags.wagtailcore_tags import richtext
from wagtail.images import get_image_model
from wagtail.images.models import Rendition

Image = get_image_model()


@pytest.mark.django_db
def test_richtext_creates_rendition():
    """
    The richtext tag should create a custom-width rendition using the 'width' attribute
    """
    image = create_valid_image('Dots')

    # A rendition with a max width of 123px should be created
    database_html = '<embed embedtype="news-image" id="{id}" width="123" />'.format(id=image.pk)
    richtext(database_html)
    assert Rendition.objects.filter(image=image, filter_spec='width-123').exists()

    # A rendition with a max width of default 800px should be created
    database_html = '<embed embedtype="news-image" id="{id}"/>'.format(id=image.pk)
    richtext(database_html)
    assert Rendition.objects.filter(image=image, filter_spec='width-800').exists()


@pytest.mark.django_db
def test_richtext_missing_id():
    """
    Expect the richtext template tag to handle bad image ids gracefully
    """
    assert not Image.objects.filter(pk=99999).exists()
    database_html = '<embed embedtype="news-image" id="99999"/>'
    assert richtext(database_html) == richtext_div('<img>')


@pytest.mark.django_db
def test_richtext_no_id():
    """
    Expect the richtext template tag to handle bad image ids gracefully
    """
    database_html = '<embed embedtype="news-image" />'
    assert richtext(database_html) == richtext_div('<img>')


@pytest.mark.django_db
def test_richtext_blank_id():
    """
    Expect the richtext template tag to handle bad image ids gracefully
    """
    database_html = '<embed embedtype="news-image" id="" />'
    assert richtext(database_html) == richtext_div('<img>')


@pytest.mark.django_db
def test_richtext_malformed_id():
    """
    Expect the richtext template tag to handle bad image ids gracefully
    """
    database_html = '<embed embedtype="news-image" id="not-a-digit" />'
    assert richtext(database_html) == richtext_div('<img>')


@pytest.mark.django_db
def test_richtext_valid_id():
    """
    Expect the richtext template tag to render news-image embeds
    """
    image = create_valid_image('Dots')
    database_html = '<embed embedtype="news-image" id="{id}" width="999"/>'.format(id=image.pk)
    actual_frontend_html = richtext(database_html)
    rendition = Rendition.objects.filter(image=image).last()
    expected_frontend_html = (
        '<img alt="" class="richtext-image" height="{h}" src="{src}" width="{w}">'
    ).format(
        src=rendition.url,
        w=rendition.width,
        h=rendition.height,
    )
    assert actual_frontend_html == richtext_div(expected_frontend_html)


@pytest.mark.django_db
def test_richtext_extra_data():
    """
    Expect the richtext template tag to render news-image embeds with extra data:
        - image title
        - alt text
        - image hyperlink
    """
    image = create_valid_image('Dots')
    database_html = '<embed embedtype="news-image" id="{}" title="{}" href="{}" alt="{}" width="{}"/>'.format(
        image.pk, 'Title!', 'https://example.com', 'Alt Text!', 456
    )
    actual_frontend_html = richtext(database_html)
    rendition = Rendition.objects.filter(image=image).last()
    expected_frontend_html = (
        '<a href="https://example.com">'
        '<img alt="Alt Text!" class="richtext-image" height="{h}" src="{src}" width="{w}">'
        '</a>'
        '<figcaption>Title!</figcaption>'
    ).format(
        src=rendition.url,
        w=rendition.width,
        h=rendition.height,
    )
    assert actual_frontend_html == richtext_div(expected_frontend_html)


def richtext_div(s):
    return '<div class="rich-text">{}</div>'.format(s)


def create_valid_image(title):
    """Returns a valid PNG Image."""
    file = ImageFile(
        name='dots.png',
        file=io.BytesIO(
            # Bytes from a small valid 2x2 PNG file.
            b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x02\x00\x00\x00\x02\x08\x06'
            b'\x00\x00\x00r\xb6\r$\x00\x00\x00\tpHYs\x00\x00\x0e\xc4\x00\x00\x0e\xc4\x01'
            b'\x95+\x0e\x1b\x00\x00\x00\x14IDAT\x08\x99cd``\xf8\xff\xff\xff\x7f\x18\xc9\xf0'
            b'\x1f\x00L\xd7\x08\xf9\xe2U\x08#\x00\x00\x00\x00IEND\xaeB`\x82'
        ),
    )
    return Image.objects.create(title=title, file=file)
