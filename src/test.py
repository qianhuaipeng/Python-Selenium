from bean.Game import Game
import json

if __name__ == '__main__':
    game = Game();
    game.setDate('cba')
    # game.date = 'cba'
    print (json.dumps(game.__dict__))

