import imp


import mysql.connector

mydb = mysql.connector.connect(
    host="120.46.197.240",       # 数据库主机地址
    port="33060",
    user="root",    # 数据库用户名
    passwd="5tgb^YHN"   # 数据库密码
)

print("Connecting to")
print(mydb)
