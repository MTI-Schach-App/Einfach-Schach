from email.policy import default
from operator import truediv
from tkinter import E
import chess.pgn

import click
import time, io, json
#pgn = open("matt1.pgn", encoding="utf-8")

def readTraining(pgn):
    game = chess.pgn.read_game(pgn)
    board = game.board()
    start = board.fen()
    moves = [] 
    for move in game.mainline_moves():
        moves.append(str(move))
        board.push(move)
    
    return start,board.fen(),moves


@click.command()
@click.option('--verbose', default=False, help='Gib debug output.')
def cleanKapitel(verbose):
    cleaning = True
    kapitel = 1
    collection = {}
    while cleaning:
        try:
            with open(f"input/sammlung_kapitel{kapitel}.pgn", encoding="utf-8") as e:
                saml = e.read()

            pgns = saml.split('[Event "')

            sammlung_json = []

            for index, pgn in enumerate(pgns):
                if index:

                    if verbose: print(index,pgn)

                    start,end,moves = readTraining(io.StringIO('[Event "'+pgn))
                    sammlung_json.append(
                    {
                        "id":f"{kapitel}_{index}",
                        "start":start,
                        "end":end,
                        "moves":moves,
                        "subtext": "kein Plan wie wir das fuer alle machen"
                    }       
                    )
            
            collection[f"Kapitel {kapitel}"] = sammlung_json


            with open(f"output/sammlung_kapitel{kapitel}.json","w+") as f:
                json.dump(sammlung_json,f,indent=4)

        except Exception as e:
            if verbose: print(e)
            cleaning = False
        
        kapitel += 1


        with open(f"output/training.json","w+") as h:
            json.dump(collection,h,indent=4)
        
    


if __name__ == '__main__':
    cleanKapitel()