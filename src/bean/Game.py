class Game:

    def __init__(self,date='',time='',state='',team1='',team2='',score=''):
        self.date = date
        self.time = time
        self.state = state
        self.team1 = team1
        self.team2 = team2
        self.score = score
        

    # getter
    @property
    def getDate(self):
        return self.date

    # setter
    def setDate(self,date):
        self.date = date

    # getter
    @property
    def time(self):
        return self.time

    # setter
    def time(self,time):
        self.time = time

    # getter
    @property
    def state(self):
        return self.state

    # setter
    def state(self,state):
        self.state = state   

    # getter
    @property
    def team1(self):
        return self.team1

    # setter
    def team1(self,team1):
        self.team1 = team1

    # getter
    @property
    def team2(self):
        return self.team2

    # setter
    def team2(self,team2):
        self.team2 = team2
    
    # getter
    @property
    def score(self):
        return self.score

    # setter
    def score(self,score):
        self.score = score