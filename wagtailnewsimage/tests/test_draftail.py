import json

from wagtail.admin.rich_text.editors.draftail import DraftailRichTextArea

FEATURES = (
    'embed', 'link',
    'bold', 'italic',
    'h2', 'h3', 'ol', 'ul',
    'news-image',
)


def test_from_database_format():
    """
    Ensure database HTML is converted into Draftail frontend data structure as expected
    """
    converter = DraftailRichTextArea(features=FEATURES).converter  # ContentstateConverter
    database_html = (
        '<embed '
        'embedtype="news-image" id="32" title="title!" '
        'alt="alt text!" width="256" href="http://example.com" '
        '/>'
    )
    data_json = converter.from_database_format(database_html)
    data = json.loads(data_json)
    actual_contentstate_data = data['entityMap']['0']
    expected_contentstate_data = {
        'type': 'NEWS-IMAGE',
        'mutability': 'MUTABLE',
        'data': {'width': '256', 'alt': 'alt text!', 'href': 'http://example.com', 'title': 'title!', 'id': '32'},
    }
    assert actual_contentstate_data == expected_contentstate_data


def test_to_database_format():
    """
    Ensure Draftail frontend data structure is converted into database HTML as expected
    """
    converter = DraftailRichTextArea(features=FEATURES).converter  # ContentstateConverter
    contentstate_json = json.dumps({
        'entityMap': {
            '0': {
                'data': {
                    'width': '256',
                    'alt': 'a',
                    'href': 'http://foo.com',
                    'title': 't',
                    'id': '32'
                },
                'type': 'NEWS-IMAGE',
                'mutability': 'MUTABLE'
            }
        },
        'blocks': [
            {
                'key': 'jmc7v',
                'entityRanges': [{'key': 0, 'offset': 0, 'length': 1}],
                'type': 'atomic',
                'inlineStyleRanges': [],
                'depth': 0,
                'text': ' '
            },
        ]
    })
    actual_database_html = converter.to_database_format(contentstate_json)
    expected_database_html = (
        '<embed alt="a" embedtype="news-image" href="http://foo.com" id="32" title="t" width="256"/>'
    )
    assert actual_database_html == expected_database_html
