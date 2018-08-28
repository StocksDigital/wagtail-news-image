"""
View for the API that consumed by the image block from the client-side.

This API allows us to search and create images using AJAX requests.
"""
import logging

from django.contrib.auth.mixins import UserPassesTestMixin
from django.db.models import Q
from django.http import HttpResponseForbidden
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.pagination import PageNumberPagination
from wagtail.images import get_image_model
from wagtail.images.permissions import permission_policy

from .serializers import ImageEditorSerializer

logger = logging.getLogger(__name__)


class WagtailLoginRequiredMixin(UserPassesTestMixin):
    """
    Denies users access if they do not have permission to log into the Wagtail admin.
    Redirects failing users to the Wagtail admin login screen.
    """
    login_url = 'wagtailadmin_login'
    raise_exception = False

    def test_func(self):
        if not self.request.user:
            return False

        user_permissions = self.request.user.get_all_permissions()
        return 'wagtailadmin.access_admin' in user_permissions


class WagtailLoginRequiredAPIMixin(WagtailLoginRequiredMixin):
    """
    Denies users access if they do not have permission to log into the Wagtail admin.
    Throws an exception if users fail the test.
    """
    login_url = None
    raise_exception = True


class ImageListPaginator(PageNumberPagination):
    """
    Pagination settings for ImageEditorAPIEndpoint.
    Use a page size of 16 so the frontend can display a 4x4 grid.
    """
    page_size = 16
    max_page_size = 16


class ImageEditorAPIEndpoint(WagtailLoginRequiredAPIMixin, GenericAPIView, CreateModelMixin,
                             RetrieveModelMixin, ListModelMixin):
    """
    Used by our custom Draftail image block (news-image)
    to display and create images from the browser.
    """
    pagination_class = ImageListPaginator
    serializer_class = ImageEditorSerializer
    queryset = get_image_model().objects.all()

    def get(self, request, *args, **kwargs):
        """
        Get a single Image if pk is passed in, otherwise list all Images
        """
        pk = kwargs.get('pk')
        if pk:
            return self.retrieve(request, *args, **kwargs)
        else:
            return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Create a new Image
        """
        # Ensure that the user is allowed to add images
        if not permission_policy.user_has_permission(request.user, 'add'):
            return HttpResponseForbidden()

        return self.create(request, *args, **kwargs)

    def get_serializer_context(self):
        try:
            width = int(self.request.GET['width'])
            return {'width': width}
        except (TypeError, ValueError, KeyError):
            return {}

    def get_queryset(self):
        queryset = get_image_model().objects.order_by('-created_at')
        search_term = self.request.GET.get('search')
        if search_term:
            query = (
                Q(file__icontains=search_term) |
                Q(title__icontains=search_term) |
                Q(collection__name__icontains=search_term)
            )
            queryset = queryset.filter(query).distinct()

        return queryset.all()
