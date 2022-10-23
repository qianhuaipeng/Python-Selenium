import json

class Person(object):
    
    def __init__(self):
        self._age = None

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self,age):
        if isinstance(age,str):
            self._age = int(age)
        elif isinstance(age,int):
            self._age = age

    @age.deleter
    def age(self):
        del self._age

p = Person()
p.age = "18"
print (p.age) #18
# del p.age
# print (p.age) #报错,AttributeError: 'Person' object has no attribute '_age'
print(json.dumps(p.__dict__))
