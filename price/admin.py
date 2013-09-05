# -*- coding: utf-8 -*-
from django.contrib import admin

from models import Category, SubCategory, Item

class ItemInline(admin.TabularInline): 
    model = Item
    extra = 3
    
class SubCategoryAdmin(admin.ModelAdmin):
    inlines = [ ItemInline, ]
    list_display = ('category', 'name', 'order')

class SubInline(admin.TabularInline): 
    model = SubCategory
    extra = 3    
    
class CategoryAdmin(admin.ModelAdmin):
    inlines = [ SubInline, ]
    list_display = ('name', 'order')

admin.site.register(Category, CategoryAdmin)
admin.site.register(SubCategory, SubCategoryAdmin)