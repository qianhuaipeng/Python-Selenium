#!/usr/bin/env Python
# coding=utf-8

import os
from time import sleep
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By  # 按照什么方式查找，By.ID,By.CSS_SELECTOR
from selenium.webdriver.common.keys import Keys  # 键盘按键操作
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait  # 等待页面加载某些元素


def browser_init(isWait):
    options = webdriver.ChromeOptions()
    prefs = {'profile.default_content_settings.popups': 0,
             'download.default_directory': '/Users/alan.peng/VsCode/python/Python-Selenium/src'}
    options.add_experimental_option('prefs', prefs)

    browser = webdriver.Chrome(options=options)
    browser.set_window_size(1366, 768)
    if isWait:
        browser.implicitly_wait(50)
    return browser


def openBaidu():
    browser.get("https://www.baidu.com/")
    # res = browser.find_element(By.PARTIAL_LINK_TEXT, "登录")



def click_button_byText(self, text):
    try:
        # WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located(loc))
        # time.sleep(1)
        # return self.driver.find_elements(*loc)
        elements = self.find_elements('tag name', 'button')
        # print(type(submits))
        for i in elements:
            # print(type(i))
            print(i.get_attribute("textContent"))
            if i.get_attribute("textContent").find(text) >= 0:
                i.click()
                break
    except AttributeError:
        print(u"%s 页面中未能找到 %s 元素" % (self, text))


if __name__ == '__main__':
    browser = browser_init(True)
    openDouying()
