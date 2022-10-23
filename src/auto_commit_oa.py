#!/usr/bin/env Python
# coding=utf-8
import os
from time import sleep
from selenium import webdriver


def browser_init(isWait):
    options = webdriver.ChromeOptions()
    prefs = {'profile.default_content_settings.popups': 0,
             'download.default_directory': '/Users/alan.peng/VsCode/python/Python-Selenium/src'}
    options.add_experimental_option('prefs', prefs)

    browser = webdriver.Chrome(
        executable_path='chromedriver', chrome_options=options)
    browser.set_window_size(1366, 768)
    if isWait:
        browser.implicitly_wait(50)
    return browser


def openOa(username, password):
    browser.get("https://www.baidu.com/")
    browser.find_element_by_id('login_username').send_keys(username)
    browser.find_element_by_id('login_password').send_keys(password)
    browser.find_element_by_id('login_button').click()


def switchToFrame(browser):
    # print 'start switch'
    # iframeHtml = browser.find_element_by_class_name("anychartbg")
    browser.switch_to.frame('second_menu_iframe')

    # print 'end switch'


def openNewWindow():
    # browser.switch_to.frame(browser.find_elements_by_name("IframeSectionTemplete")[2])
    browser.switch_to.frame('main')

    # print browser.find_element_by_id("right_div_portal_sub")
    # print browser.find_elements_by_tag_name("iframe")[0]
    browser.switch_to.frame(browser.find_elements_by_tag_name("iframe")[2])
    # browser.switch_to.frame(browser.find_element_by_xpath("//iframe[contains(@sectionid,'4117972794609743017')]"))
    # print browser.find_element_by_id("leftListDiv").text
    num = browser.window_handles  # 获取当前页句柄
    print(num)

    browser.find_element_by_xpath("//a[contains(text(),'工作日志')]").click()
    num = browser.window_handles  # 获取当前页句柄
    print(num)
    browser.switch_to.window(num[1])
    # print browser.find_element_by_id("_dealSubmit").text
    browser.find_element_by_xpath("//a[contains(text(),'提交')]").click()
    # print browser.find_element_by_id("_dealSubmit").text
    num = browser.window_handles  # 获取当前页句柄
    print(num)
    browser.switch_to.window(num[0])
    openNewWindow(browser)


def dealCommit(mainBrowser):
    browser.switch_to.frame(browser.find_elements_by_tag_name("iframe")[2])
    num = browser.window_handles  # 获取当前页句柄
    print(num)
    browser.switch_to.window(num[1])
    # print browser.find_element_by_id("_dealSubmit").text
    browser.find_element_by_xpath("//a[contains(text(),'提交')]").click()
    num = browser.window_handles  # 获取当前页句柄
    print(num)
    browser.switch_to.window(num[0])
    browser.find_element_by_xpath("//a[contains(text(),'工作日志')]").click()


def usage():
    print
    "example : python downloadCNKI.py -k keyword  -p 1"


if __name__ == "__main__":
    browser = browser_init(True)
    username = ""
    password = "."
    openOa(username, password)
    openNewWindow()
