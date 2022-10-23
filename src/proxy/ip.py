'''
爬取快代理，建立自己的IP池（国内高匿代理），并存储到MongoDB数据库中
'''
import random
# import pymongo
import pymysql
import pandas as pd
import requests
from lxml import etree
import time

# 连接数据库
conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    passwd="root_123$",
    database="root",
    charset="utf8")
cursor = conn.cursor()


class KuaiDaiLiSpider:

    def __init__(self):
        self.url = 'https://www.kuaidaili.com/free/inha/{}/'
        self.test_url = 'http://www.baidu.com'
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:6.0) Gecko/20100101 Firefox/6.0'}
        # self.conn = pymongo.MongoClient(host='localhost', port=27017)
        # self.db = self.conn['ipdb']
        # self.myset = self.db['ipset']

    def get_proxy(self, url):
        html = requests.get(url=url, headers=self.headers).text
        # print(html)
        tables = pd.read_html(html)
        # print("table数量:", len(tables))
        p = etree.HTML(html)
        # print(p)
        df1 = tables[0]
        results = list(df1.T.to_dict().values())
        # print(results)
        for tr in results:
            # print(tr)
            ip = tr['IP']
            port = tr['PORT']
            # print(ip, port)
            self.test_proxy(ip, port)
        # 先写基准的xpath
        tr_list = p.xpath(
            '//table[@class="table table-bordered table-striped"]/tbody/tr')
        # print(tr_list)
        # for tr in tr_list:
        #     ip = tr.xpath('./td[1]/text()')[0].strip()
        #     port = tr.xpath('./td[2]/text()')[0].strip()
        #     # 测试代理是否可用
        #     self.test_proxy(ip, port)

    def test_proxy(self, ip, port):
        # print(ip, port)
        # 测试一个高匿代理IP是否可用
        proxies = {
            'http': 'http://{}:{}'.format(ip, port),
            'https': 'https://{}:{}'.format(ip, port)
        }
        try:
            res = requests.get(url=self.test_url,
                               proxies=proxies, headers=self.headers, timeout=5)
            if res.status_code == 200:
                ip_item = {}
                print(ip, port, '\033[31m可用\033[0m')
                ip_item['ip'] = ip
                ip_item['port'] = port
                ip_item['valid'] = '可用'
                # self.myset.insert_one(ip_item)
                cursor.execute(
                    # 如果已存在相应记录则忽略该条数据
                    "insert ignore into ip_table(ip, port) values('{0}', '{1}')".format(ip, port))
                conn.commit()
        except Exception as e:
            print(ip, port, "不可用", e)

    def run(self):
        for i in range(1, 1024):
            url = self.url.format(i)
            print(url)
            self.get_proxy(url)
            time.sleep(random.uniform(2, 3))


if __name__ == '__main__':

    spider = KuaiDaiLiSpider()
    spider.run()
    # url = 'https://www.kuaidaili.com/free/inha/1/'


# //table[@class="table table-bordered table-striped"]/tbody/tr/td[1]/text()
