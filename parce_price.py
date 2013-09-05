# coding: utf-8
BASE_URL = 'http://classicag.ru/price/'

import urllib2
from bs4 import BeautifulSoup

def parse():
    c = urllib2.urlopen(BASE_URL)
    soup = BeautifulSoup(c.read())
    for category in soup.findAll('h2', attrs={'class' : 'button'}):
        print '____________________________'
        print category.contents[0].string
        
        category_container = category.findNextSiblings('div')[0]
        for subcat in category_container.findAll('h3'):
            print '   ' + subcat.string
            items_table = subcat.parent.findAll('table')[0]
            for tr in items_table.findAll('tr'):
                pass
                #print '      ' + tr.td.string + ' | ' + str(tr.findAll('td')[1].findAll('input')[1]['value']) + ' | '

parse()