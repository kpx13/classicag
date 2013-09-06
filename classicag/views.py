# -*- coding: utf-8 -*-

from django.core.context_processors import csrf
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
 

from pages.models import Page
from price.models import Category, SubCategory, Item
from feedback.forms import FeedbackForm
from order.forms import OrderForm
from order.models import Order, OrderContent


import config
from livesettings import config_value


def get_common_context(request):
    c = {}
    c['request_url'] = request.path
    c.update(csrf(request))
    return c

def page(request, page_name):
    c = get_common_context(request)
    p = Page.get_by_slug(page_name)
    if p.is_service or (page_name == 'cleaning_service'):
        c.update({'services': Page.get_services_links()})
    if p:
        c.update({'p': p})
        return render_to_response('page.html', c, context_instance=RequestContext(request))
    else:
        raise Http404()

def home(request):
    c = get_common_context(request)
    c['request_url'] = 'home'
    return render_to_response('home.html', c, context_instance=RequestContext(request))

def contacts(request):
    c = get_common_context(request)
    c.update({'p': Page.get_by_slug('contacts')})
    if request.method == 'GET':
        c.update({'form': FeedbackForm()})
        return render_to_response('contacts.html', c, context_instance=RequestContext(request))
    elif request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            form.save()
            form = FeedbackForm()
        c.update({'form': form})
        return render_to_response('contacts.html', c, context_instance=RequestContext(request))
        
def clients(request):
    c = get_common_context(request)
    return render_to_response('clients.html', c, context_instance=RequestContext(request))

def price(request):
    c = get_common_context(request)
    c['categories'] = Category.objects.all()            
    return render_to_response('price.html', c, context_instance=RequestContext(request))

def price_parse(request):
    BASE_URL = 'http://classicag.ru/price/'

    import urllib2
    from bs4 import BeautifulSoup

    c = urllib2.urlopen(BASE_URL)
    soup = BeautifulSoup(c.read())
    for category in soup.findAll('h2', attrs={'class' : 'button'}):
        print '___________________________________________________________'
        print category.contents[0].string
        cat = Category(name=category.contents[0].string)
        cat.save()
        
        category_container = category.findNextSiblings('div')[0]
        for subcat in category_container.findAll('h3'):
            print '   ' + subcat.string
            subc = SubCategory(category=cat, name=subcat.string)
            subc.save()
            items_table = subcat.parent.findAll('table')[0]
            for tr in items_table.findAll('tr'):
                print '      ' + tr.td.string + ' | ' + str(tr.findAll('td')[1].findAll('input')[1]['value'])
                i = Item(subcategory=subc,
                         name=tr.td.string,
                         unit=tr.findAll('td')[2].string,
                         price=int(tr.findAll('td')[1].findAll('input')[1]['value']))
                i.save()
    return HttpResponseRedirect('/price/')

def order(request):
    c = get_common_context(request)
    if request.method == 'POST':
        if 'step' in request.POST:
            step = int(request.POST['step'])
            res = []
            sum_price = 0
            for k, v in request.POST.iteritems():
                if k.startswith('field_') and int(v) > 0:
                    item=Item.get(int(k[6:]))
                    count = int(v)
                    res.append((item, count))
                    sum_price += item.price * count
            c['sum_price'] = sum_price
            c['order_content'] = res
            if step == 1:
                c['form'] = OrderForm()
                return render_to_response('order.html', c, context_instance=RequestContext(request))
            elif step == 2:
                form = OrderForm(request.POST)
                if form.is_valid():
                    ord = form.save()
                    print ord
                    for item, count in res:
                        OrderContent(order=ord, item=item, count=count).save()
                    ord.send_email()
                    return render_to_response('order_ok.html', c, context_instance=RequestContext(request))
                else:
                    c['form'] = form 
                    return render_to_response('order.html', c, context_instance=RequestContext(request))
        else:
            raise Http404()
    else:
        raise Http404()