class MyNumbers:
    def __iter__(self):
        self.a = 1
        return self

    def __next__(self):
        if self.a < 10:
            x = self.a
            self.a += 1
            return x
        else:
            raise StopIteration


if __name__ == '__main__':
    myNumbers = MyNumbers()
    myiter = iter(myNumbers)
    for i in range(100):
        print(next(myiter))
