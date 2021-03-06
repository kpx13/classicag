# -*- coding: utf-8 -*-

from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
admin.autodiscover()

import settings
import views

urlpatterns = patterns('',
    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    url(r'^favicon\.ico$', 'django.views.generic.simple.redirect_to', {'url': '/static/favicon.ico'}),
    url(r'^sitemap\.xml$', 'django.views.generic.simple.redirect_to', {'url': '/static/sitemap.xml'}),
	url(r'^1baf95f34665\.html$', 'django.views.generic.simple.redirect_to', {'url': '/static/1baf95f34665.html'}),
    
    url(r'^admin_tools/', include('admin_tools.urls')),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin/jsi18n/', 'django.views.i18n.javascript_catalog'),
    url(r'^settings/', include('livesettings.urls')),
    url(r'^ckeditor/', include('ckeditor.urls')),

    url(r'^$', views.home),
    url(r'^home/$', views.home),
    url(r'^contacts/$', views.contacts),
#    url(r'^clients/$', views.clients),
    url(r'^price/(?P<category>[\w-]+)/$', views.price),
    url(r'^price/$', views.price, {'category': 0}),
    url(r'^order/$', views.order),
    #url(r'^price_parse/$', views.price_parse),
    
    url(r'^(?P<page_name>[\w-]+)/$' , views.page),
)
