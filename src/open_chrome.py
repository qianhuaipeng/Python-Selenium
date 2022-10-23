#!/usr/bin/env Python
# coding=utf-8
from copy import Error
from selenium import webdriver
import time
import requests
import json


def browser_init(isWait):
    options = webdriver.ChromeOptions()
    browser = webdriver.Chrome(chrome_options=options)
    if isWait:
        browser.implicitly_wait(isWait)
    return browser

def openWindow():
    browser.get('http://live.win007.com/')
    clickA()

def clickA():
    browser.find_element_by_id('tools').find_element_by_class_name('hmunber').find_element_by_tag_name('a').click()

def refresh():
    browser.refresh()
    clickA()

def readData():
    table_live = browser.find_element_by_id('table_live')
    tr_0 = table_live.find_element_by_id('tr_0')
    # browser.find_element_by_xpath('//')
    # tbody_tr = browser.find_element_by_id('table_live').find_element_by_tag_name('tbody').find_elements_by_tag_name('tr')
    tbody_tr = browser.find_element_by_id('table_live').find_elements_by_xpath('//tbody/tr')
    th_map = {}
    game_list = []
    for i,tr in enumerate(tbody_tr):
        # print(tr)
        index = tr.get_attribute('index')
       
        if(i == 0):
            th_texts = tr.find_elements_by_xpath('//th')
            for th_texts_index,th_text in enumerate(th_texts):
                # print (th_text.text)
                
                if(th_texts_index == 1):
                    th_map['date'] = th_text.text
                elif(th_texts_index == 2):
                    th_map['time'] = th_text.text
                elif(th_texts_index == 3):
                    th_map['state'] = th_text.text
                elif(th_texts_index == 4):
                    th_map['team1'] = th_text.text
                elif(th_texts_index == 5):
                    th_map['score'] = th_text.text
                elif(th_texts_index == 6):
                    th_map['team2'] = th_text.text

        elif(index != None):
            try:
                index = int(index)
                # print(th_map)
                tds = tr.find_elements_by_tag_name('td')
                state = ''
                game = {}
                for td_index,td in enumerate(tds):
                    if(td_index == 1):
                        game['date'] = td.text
                    elif(td_index == 2):
                        game['time'] = td.text
                    elif(td_index == 3):
                        game['state'] = td.text
                    elif(td_index == 4):
                        game['team1'] = td.text
                    elif(td_index == 5):
                        game['score'] = td.text
                    elif(td_index == 6):
                        game['team2'] = td.text
                if(game['team1'] != ''):
                    game_list.append(game)
                
            except Error as e:
                print(e)
                pass
        
    print (game_list)
    # print (tr_0)
    url = 'http://api.******'
    req = requests.post(url,json=game_list)
    print(json.loads(req.text))
    

if __name__ == '__main__':
    browser = browser_init(True)
    openWindow()
    
    while(True):
        readData()
        print('等待30s')
        time.sleep(30)
        refresh()
        print('等待30s时间结束')

    
