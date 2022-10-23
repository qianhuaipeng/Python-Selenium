
import pprint
import pickle
from sys import argv, path
import sys

for i in sys.argv:
    print(i)
print('\n python 路径为', sys.path)


print('path', path)

# a = int(input('a = '))
# b = int(input('b = '))
# print('%d + %d = %d' % (a, b, a + b))
# print('%d - %d = %d' % (a, b, a - b))
# print('%d * %d = %d' % (a, b, a * b))
# print('%d / %d = %f' % (a, b, a / b))
# print('%d // %d = %d' % (a, b, a // b))
# print('%d %% %d = %d' % (a, b, a % b))
# print('%d ** %d = %d' % (a, b, a ** b))

# list集合
list = ['abcd', 786, 2.23, 'runoob', 70.2]
tinylist = [123, 'runoob']
print(list)
print(list[0:])
print(list + tinylist)

# 元组
tuple = ('abcd', 786, 2.23, 'runoob', 70.2)
tinytuple = (123, 'runoob')
print(tuple)

# set 集合
sites = {'Google', 'Taobao', 'Runoob', 'Facebook', 'Zhihu', 'Baidu', 'Taobao'}
print(sites)   # 输出集合，重复的元素被自动去掉
# 成员测试
if 'Runoob' in sites:
    print('Runoob 在集合中')
else:
    print('Runoob 不在集合中')

a = set('asdasdhasdhajkdsjdkfgjlfg')
print(a)
b = set('asdasdhasdhajkdsj')
print(a-b)
print(a | b)
print(a & b)
print(a ^ b)

# Dictionary（字典） 类似map集合
dict = {}
dict['name'] = 'alan.peng'
print(dict)

# Fibonacci series: 斐波纳契数列
# 两个元素的总和确定了下一个数
a, b = 0, 1
while b < 1000:
    print(b, end=',')
    a, b = b, a+b

print()
# 条件判断
if a == 0:
    print(a, end=',')
elif b == 1:
    print(a, end=',')
else:
    print(a, end=',')

# while
a, b = 0, 1
while b < 1000:
    print(b, end=',')
    a, b = b, a+b

print()
# for循环
sites = ["Baidu", "Google", "Runoob", "Taobao"]
for site in sites:
    if site == "Runoob":
        print("菜鸟教程!")
        break
    print("循环数据 " + site)
else:
    print("没有循环数据!")
print("完成循环!")

for index, item in enumerate(sites):
    print(index, item)

# 迭代器
list = [1, 2, 3, 4]
it = iter(list)    # 创建迭代器对象
for x in it:
    print(x, end=" ")


#!/usr/bin/python3

# 使用pickle模块将数据对象保存到文件
data1 = {'a': [1, 2.0, 3, 4+6j],
         'b': ('string', u'Unicode string'),
         'c': None}

selfref_list = [1, 2, 3]
selfref_list.append(selfref_list)

output = open('data.pkl', 'wb')

# Pickle dictionary using protocol 0.
pickle.dump(data1, output)

# Pickle the list using the highest protocol available.
pickle.dump(selfref_list, output, -1)

output.close()


#!/usr/bin/python3

# 使用pickle模块从文件中重构python对象
pkl_file = open('data.pkl', 'rb')

data1 = pickle.load(pkl_file)
print('data1:')
pprint.pprint(data1)

data2 = pickle.load(pkl_file)
pprint.pprint(data2)

pkl_file.close()


def reverseWords(input):
    inputWords = input.split(' ')
    inputWords = inputWords[-1::-1]
    output = ' '.join(inputWords)
    return output


if __name__ == '__main__':
    input = 'I Love You'
    output = reverseWords(input)
    print(output)
