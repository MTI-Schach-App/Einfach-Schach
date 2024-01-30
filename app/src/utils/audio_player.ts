//generell sounds
const norm_move_sound      = require('../sounds/normMove.mp3');

const promotion_sound      = require('../sounds/promotion.mp3');
const capture_sound        = require('../sounds/capture.mp3');

const check_sound          = require('../sounds/check.mp3');

const checkmate_won_sound  = require('../sounds/success.mp3');
const checkmate_lose_sound = require('../sounds/fail.mp3');

const undo_sound           = require('../sounds/undo.mp3');

export function playMoveSound(sound:string){
    switch(sound){
        case 'normal':
            new Audio(norm_move_sound).play();
        break;
        case 'promotion':
            new Audio(promotion_sound).play();
        break;
        case 'capture':
            new Audio(capture_sound).play();
        break;
        case 'check':
            new Audio(check_sound).play();
        break;
        case 'won':
            new Audio(checkmate_won_sound).play();
        break;
        case 'lost':
            new Audio(checkmate_lose_sound).play();
        break;
        case 'undo':
            new Audio(undo_sound).play();
        break;
        case 'rochade':
            new Audio(norm_move_sound).play();
            new Audio(norm_move_sound).play();
        break;
    }
}

//sound for figures when selected
const bishop_sound         = require('../sounds/Bishop.mp3');
const pawn_sound           = require('../sounds/Pawn.mp3');
const knight_sound         = require('../sounds/Knight.mp3');
const queen_sound          = require('../sounds/Queen.mp3');
const rook_sound           = require('../sounds/Rook.mp3');
const king_sound           = require('../sounds/King.mp3');

export function playTypeSound(sound:string){
    switch(sound){
        case 'bishop':
            new Audio(bishop_sound).play();
        break;
        case 'pawn':
            new Audio(pawn_sound).play();
        break;
        case 'knight':
            new Audio(knight_sound).play();
        break;
        case 'queen':
            new Audio(queen_sound).play();
        break;
        case 'rook':
            new Audio(rook_sound).play();
        break;
        case 'king':
            new Audio(king_sound).play();
        break;
    }
}

//sound for board when clicked on
//signal sound
