# -*- coding: utf-8 -*-
from django.contrib import admin
from models import Request


class RequestAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'name', 'request_date',)
    ordering = ('request_date', )

admin.site.register(Request, RequestAdmin)