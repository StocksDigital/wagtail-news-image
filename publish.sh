#!/bin/bash
# Publishes the package to PyPI.
# Requires twine
rm -rf build/ dist/ wagtail_news_image.egg-info/
python3 setup.py bdist_wheel sdist
twine upload dist/*
