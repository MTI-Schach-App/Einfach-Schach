from email.policy import default
from operator import truediv
from tkinter import E
import chess.pgn

import click
import time, io, json, os
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

def sortByIndex(val):
    return int(val.split('.')[0])

@click.command()
@click.option('--verbose', default=False, help='Gib debug output.')
def cleanKapitel(verbose):
    cleaning = True
    collection = []
    rootDir = 'input'
    chapterToRead = []
    for subdir,dirs, files in os.walk(rootDir):
        if len(dirs) > 0:
            chapterToRead = dirs
            chapterToRead.sort(key=sortByIndex)
    
    for chapter in chapterToRead:
        kapitel= int(chapter.split('.')[0])
        name= chapter.split('.')[1].strip()
        with open(f"input/{chapter}/{name}.pgn", encoding="utf-8") as e:
            saml = e.read()
        with open(f"input/{chapter}/{name}.txt", encoding="utf-8") as e:
            desc = e.readlines()



        pgns = saml.split('[Event "')

        sammlung_json = []

        for index, pgn in enumerate(pgns):
            if index:

                if verbose: print(index,pgn)

                start,end,moves = readTraining(io.StringIO('[Event "'+pgn))
                sammlung_json.append(
                {
                    "id":index,
                    "start":start,
                    "end":end,
                    "moves":moves,
                }       
                )
        
        collection.append(
            {
                "id": kapitel,
                "name": name,
                "subtext": ".".join(desc),
                "courses": sammlung_json
            }
        ) 


        with open(f"output/sammlung_kapitel{kapitel}.json","w+") as f:
            json.dump(sammlung_json,f,indent=4)


    with open(f"output/training.json","w+") as h:
        json.dump(collection,h,indent=4)
        
    print('Training erfolgreich erstellt!')


if __name__ == '__main__':
    cleanKapitel()