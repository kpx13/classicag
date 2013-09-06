# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.db import models
import datetime
from django.conf import settings
from django.core.mail import send_mail
from django.template import Context, Template

from price.models import Item


def sendmail(subject, body):
    mail_subject = ''.join(subject)
    send_mail(mail_subject, body, settings.DEFAULT_FROM_EMAIL,
        [settings.EMAIL_SEND_TO])


class Order(models.Model):
    name  = models.CharField(u'контактное лицо *', max_length=255)
    phone  = models.CharField(u'телефон', blank=True, max_length=255)
    email  = models.CharField(u'e-mail', blank=True, max_length=255)
    date = models.DateTimeField(default=datetime.datetime.now, verbose_name=u'дата заказа')
    comment = models.TextField(blank=True, verbose_name=u'комментарий')
    
    class Meta:
        verbose_name = u'заказ'
        verbose_name_plural = u'заказы'
        ordering = ['-date']
    
    def __unicode__(self):
        return str(self.date)
    
    def get_count(self):
        return sum([x.count for x in OrderContent.get_content(self)])
    
    def get_sum(self):
        return sum([x.count * x.item.price for x in OrderContent.get_content(self)])
    
    def send_email(self):
        subject=u'Поступил новый заказ.',
        body_templ=u"""
Контактное лицо: {{ o.name }}
Телефон: {{ o.phone }}
E-mail: {{ o.email }}
Сообщение: {{ o.comment }}

Содержимое:
    {% for c in o.content.all %}
        Название: {{ c.item.name }} 
        Кол-во: {{ c.count }} {{ c.item.unit }} 
        Цена: {{ c.item.price }} руб.
        
    {% endfor %}

Общая стоимость:  {{ o.get_sum }} руб. 
"""
        body = Template(body_templ).render(Context({'o': self}))
        sendmail(subject, body)    
        
class OrderContent(models.Model):
    order = models.ForeignKey(Order, verbose_name=u'заказ', related_name='content')
    item = models.ForeignKey(Item, verbose_name=u'товар')
    count = models.IntegerField(default=1, verbose_name=u'количество')
        
    def __unicode__(self):
        return self.item.name
    
    @staticmethod
    def add(order, item, count):
        OrderContent(order=order, item=item, count=count).save()
    
    @staticmethod
    def get_content(order):
        return list(OrderContent.objects.filter(order=order))
