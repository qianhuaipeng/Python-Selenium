from MyNumbers import MyNumbers


class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age


if __name__ == '__main__':
    person = Person('alan', 10)
    print(person.name)
    m = MyNumbers()
