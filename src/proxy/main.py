from selenium import webdriver

try:
    browser = webdriver.Chrome()
    browser.get('http://httpbin.org/ip')
    print('1: ', browser.session_id)
    print('2: ', browser.page_source)
    print('3: ', browser.get_cookies())

    # 利用DesiredCapabilities(代理设置)参数值，重新打开一个sessionId，我看意思就相当于浏览器清空缓存后，加上代理重新访问一次url
    proxy = webdriver.Proxy()
    proxy.http_proxy = '152.136.62.181:9999'
    # 将代理设置添加到webdriver.DesiredCapabilities.PHANTOMJS中
    proxy.add_to_capabilities(webdriver.DesiredCapabilities.CHROME)
    browser.start_session(webdriver.DesiredCapabilities.CHROME)
    browser.get('http://httpbin.org/ip')
    print('1: ', browser.session_id)
    print('2: ', browser.page_source)
    print('3: ', browser.get_cookies())
except Exception as e:
    print(e.args)
    print('异常了')
finally:
    browser.quit()
