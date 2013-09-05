# -*- coding: utf-8 -*-

from django.db import models
from ckeditor.fields import RichTextField

class Category(models.Model):
    name = models.CharField(max_length=512, verbose_name=u'название')
    order = models.IntegerField(null=True, blank=True, default=100, verbose_name=u'порядок сортировки')
    
    class Meta:
        verbose_name = 'категория'
        verbose_name_plural = 'категории'
        ordering=['order']
    
    def __unicode__(self):
        return self.name
    
    @staticmethod
    def get(id_):
        try:
            return Category.objects.get(id=id_)
        except:
            return None

class SubCategory(models.Model):
    category = models.ForeignKey(Category, verbose_name=u'категория', related_name='sub')
    name = models.CharField(max_length=512, verbose_name=u'название')
    order = models.IntegerField(null=True, blank=True, default=100, verbose_name=u'порядок сортировки')
    
    class Meta:
        verbose_name = 'подкатегория'
        verbose_name_plural = 'подкатегории'
        ordering=['order']
    
    def __unicode__(self):
        return self.name
    
    @staticmethod
    def get(id_):
        try:
            return SubCategory.objects.get(id=id_)
        except:
            return None

class Item(models.Model):
    subcategory = models.ForeignKey(SubCategory, verbose_name=u'подкатегория', related_name='item')
    name = models.CharField(max_length=512, verbose_name=u'название')
    unit = models.CharField(max_length=16, verbose_name=u'единица измерения')
    price = models.FloatField(verbose_name=u'цена')
    
    @staticmethod
    def get(id_):
        try:
            return Item.objects.get(id=id_)
        except:
            return None
    
    class Meta:
        verbose_name = u'услуга'
        verbose_name_plural = u'услуги'
        ordering=['name']
        
    def __unicode__(self):
        return self.name

        
        
