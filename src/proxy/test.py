#!/usr/bin/env Python
# coding=utf-8

from selenium import webdriver
from selenium.webdriver.common.proxy import Proxy
from selenium.webdriver.common.proxy import ProxyType


browser = webdriver.Chrome()

# 设置页面加载和js加载超时时间，超时立即报错，如下设置超时时间为10秒
browser.set_page_load_timeout(10)
browser.set_script_timeout(10)

# 设置动态代理ip端口，每次更换动态ip时修改httpProxy
proxy = Proxy(
    {
        'proxyType': ProxyType.MANUAL,
        'httpProxy': '152.136.62.181:9999'  # 代理ip和端口
    }
)


desired_capabilities = webdriver.DesiredCapabilities.CHROME.copy()
proxy.add_to_capabilities(desired_capabilities)

browser.start_session(desired_capabilities)
browser.get("http://httpbin.org/ip")

print(browser.page_source)
browser.close()
