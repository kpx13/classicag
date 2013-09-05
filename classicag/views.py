# -*- coding: utf-8 -*-

from django.core.context_processors import csrf
from django.contrib import messages
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
 

from pages.models import Page
from services.models import Article
from slideshow.models import Slider

from feedback.forms import FeedbackForm


import config
from livesettings import config_value


def get_common_context(request):
    c = {}
    c['request_url'] = request.path
    c['slideshow'] = Slider.objects.all()
    c.update(csrf(request))
    return c

def page(request, page_name):
    c = get_common_context(request)
    try:
        c.update(Page.get_by_slug(page_name))
        return render_to_response('page.html', c, context_instance=RequestContext(request))
    except:
        raise Http404()

def home(request):
    c = get_common_context(request)
    c.update(Page.get_by_slug('home'))
    c['request_url'] = 'home'
    return render_to_response('home.html', c, context_instance=RequestContext(request))

def services(request, page_name=None):
    if page_name:
        c = get_common_context(request)
        c['a'] = Article.get_by_slug(page_name)
        c['articles'] = Article.objects.all()
        c['base_url'] = 'services'
        c['base_title'] = u'Услуги'
        return render_to_response('articles_base.html', c, context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect('/services/%s/' % Article.objects.all()[0].slug)

def feedback(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            form.save()
            form = FeedbackForm()
            messages.success(request, u'Ваша заявка отправлена.')
            return HttpResponseRedirect('/')
    raise Http404() 
    