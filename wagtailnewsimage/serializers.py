"""
Serializer for the API that consumed by the image block from the client-side.

This API allows us to search and create images using AJAX requests.
"""
from django.core.files.images import ImageFile
from rest_framework import serializers
from wagtail.images import get_image_model
from wagtail.images.models import Filter
from wagtail.images.shortcuts import get_rendition_or_not_found


class ImageEditorSerializer(serializers.Serializer):
    """
    List and create Wagtail images for our custom Draftail image block
    """
    id = serializers.IntegerField(read_only=True)
    width = serializers.IntegerField(read_only=True)
    height = serializers.IntegerField(read_only=True)
    image_file = serializers.ImageField(source='file')
    title = serializers.CharField()
    rendition_url = serializers.SerializerMethodField()

    def get_rendition_url(self, image):
        width = self.context.get('width', 800)
        filter_spec = 'width-{}'.format(width)
        return get_rendition_or_not_found(image, Filter(spec=filter_spec)).url

    def create(self, validated_data):
        """
        Create a new Image from an upload file
        """
        image_model = get_image_model()
        image_bytes = validated_data['file'].file
        image_filename = validated_data['file'].name

        # FIXME: Get this working locally
        # Try to avoid duplicate uploads - this check works in S3, but it won't work locally
        # since the Django dev environment appends a random string to all filenames
        upload_filename = image_model().get_upload_to(image_filename)
        existing_image = image_model.objects.filter(file=upload_filename).last()
        if existing_image:
            return existing_image

        django_image = ImageFile(image_bytes, image_filename)
        return image_model.objects.create(
            title=validated_data['title'],
            file=django_image,
        )
