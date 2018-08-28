
from setuptools import setup, find_packages
from os import path
from wagtailnewsimage import __version__

here = path.abspath(path.dirname(__file__))
with open(path.join(here, 'README.md')) as f:
    long_description = f.read()


setup(
    name='wagtail-news-image',
    version=__version__,

    packages=find_packages(),
    include_package_data=True,

    description='An extended Draftail image block for news sites.',
    long_description=long_description,

    url='https://github.com/StocksDigital/wagtail-news-image',

    author='Matthew Segal',
    author_email='matthew.segal@stocksdigital.com',

    license='MIT',

    install_requires=[
        'wagtail>=2',
        'djangorestframework>=3',
    ],

    extras_require={
        'test': [
            'pytest>=3.5',
        ],
    },

    # https://pypi.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Framework :: Django',
        'Framework :: Wagtail',
        'Framework :: Wagtail :: 2',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)