# -*- coding: utf-8 -*-
from django.contrib import admin
from models import Order, OrderContent

class ItemInline(admin.TabularInline): 
    list_display = ('item', 'count')
    model = OrderContent
    extra = 3
    
class OrderAdmin(admin.ModelAdmin):
    inlines = [ ItemInline, ]
    list_display = ('date', )

admin.site.register(Order, OrderAdmin)