"""
This module provides an alternative implementation of a function that Wagtail uses to fetch image renditions.
"""
from wagtail.images.models import Filter
from wagtail.images.shortcuts import get_rendition_or_not_found


def get_rendition_or_not_found_patch(image, filter):
    """
    This function is a monkey patch of wagtail.images.shortcuts.get_rendition_or_not_found (v2.1).
    Here, we try to find the requested rendition in Python before calling the original function.

    Wagtail's (v2.1) 'get_rendition_or_not_found' uses the ORM's 'get' method to lookup every image rendition,
    which causes a database request for every image we render. This implementation is really slow.

    Even worse, this method does not respect prefetch_related('renditions') so we cannot optimize this tag using
    ORM wizardry alone.

    This fix will allow you to use prefetch_related on renditions and grab all your renditions in one query.
    If you do not use prefetch related, then this function performs roughly as bad as it did before.
    """
    if type(filter) is str:
        filter = Filter(spec=filter)

    filter_spec = filter.spec
    focal_point_key = filter.get_cache_key(image)

    # This loop assumes that you've prefetched your image's renditions
    rendition = None
    for rend in image.renditions.all():
        if rend.filter_spec == filter_spec and rend.focal_point_key == focal_point_key:
            rendition = rend

    if not rendition:
        rendition = get_rendition_or_not_found(image, filter)

    return rendition
