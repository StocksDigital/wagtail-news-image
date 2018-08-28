from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'api/images(?:/(?P<pk>[0-9]+))?/$',
        views.ImageEditorAPIEndpoint.as_view(),
        name='news_images_api'),
]
