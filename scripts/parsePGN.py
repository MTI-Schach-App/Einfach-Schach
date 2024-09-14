import chess.pgn

import click
import io, json, os, shutil

def readTraining(pgn):
    game = chess.pgn.read_game(pgn)
    board = game.board()
    start = board.fen()
    moves = [] 
    if len(game.variations) > 0:
        for index, variation in enumerate(game.variations):
            moves.append([])
            moves[index].append(str(variation.move))
            crawling = True
            nxt = variation
            while crawling:
                nxt2 = nxt.next()
                if nxt2 != None:
                    #print(nxt2.move)
                    moves[index].append(str(nxt2.move))
                    nxt = nxt2
                else: 
                    crawling = False
        
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
        
        shutil.copy(f"input/{chapter}/{name}.png",f"../app/public/training/{name}.png")

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

    with open(f"output/training.json","w+") as h:
        json.dump(collection,h,indent=4)

    os.remove(f"../app/src/data/training.json")
    shutil.copy(f"output/training.json",f"../app/src/data/training.json")

    print('Training erfolgreich erstellt!')


if __name__ == '__main__':
    cleanKapitel()