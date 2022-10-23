import re


def double(matched):
    value = int(matched.group('value'))
    return str(value * 2)


input = '1231-9887-323 # 这是一个电话号码111'
str1 = re.sub(r'\D', '', input)
print(str1)

str1 = re.sub(r'#.*', '', input)
print(str1)

# 将匹配的数字乘以 2


s = 'A23G4HFD567'
print(re.sub('(?P<value>\d+)', double, s))

pattern = re.compile(r'\d+')
m = pattern.match('1e1asdasd1232311')
print(m.group())
m = pattern.search('1e1asdasd1232311')
print(m.group)


pattern = re.compile(r'([a-z]+) ([a-z]+)', re.I)   # re.I 表示忽略大小写
s = pattern.match('Hello World Wide Web')
print(s.group())
print(s.span(1))
print(s.group(1))
print(s.groups())
for i in s.groups():
    print(i, type(i))

# 查找字符串中的所有数字：
result1 = re.findall(r'\d+', 'runoob 123 google 456')
print(result1)
pattern = re.compile(r'\d+')   # 查找数字
result2 = pattern.findall('runoob 123 google 456', 0, 10)
print(result2)

# 多个匹配模式，返回元组列表：
result = re.findall(r'(\w+)=(\d+)', 'set width=20 and height=10')
print(result)
