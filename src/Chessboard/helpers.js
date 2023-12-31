import diff from 'deep-diff';
import {squareStates} from "./Constants";

export const ItemTypes = { PIECE: 'piece' };
export const COLUMNS = 'abcdefgh'.split('');

export const constructPositionAttributes = (currentPosition, position) => {
  const difference = diff(currentPosition, position);
  const squaresAffected = difference.length;
  const sourceSquare =
    difference && difference[1] && difference && difference[1].kind === 'D'
      ? difference[1].path && difference[1].path[0]
      : difference[0].path && difference[0].path[0];
  const targetSquare =
    difference && difference[1] && difference && difference[1].kind === 'D'
      ? difference[0] && difference[0].path[0]
      : difference[1] && difference[1].path[0];
  const sourcePiece =
    difference && difference[1] && difference && difference[1].kind === 'D'
      ? difference[1] && difference[1].lhs
      : difference[1] && difference[1].rhs;
  return { sourceSquare, targetSquare, sourcePiece, squaresAffected };
};

function isString(s) {
  return typeof s === 'string';
}

export function fenToObj(fen) {
  if (!validFen(fen)) return false;
  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, '');

  let rows = fen.split('/');
  let position = {};

  let currentRow = 8;
  for (let i = 0; i < 8; i++) {
    let row = rows[i].split('');
    let colIdx = 0;

    // loop through each character in the FEN section
    for (let j = 0; j < row.length; j++) {
      // number / empty squares
      if (row[j].search(/[1-8]/) !== -1) {
        let numEmptySquares = parseInt(row[j], 10);
        colIdx = colIdx + numEmptySquares;
      } else {
        // piece
        let square = COLUMNS[colIdx] + currentRow;
        position[square] = fenToPieceCode(row[j]);
        colIdx = colIdx + 1;
      }
    }

    currentRow = currentRow - 1;
  }

  return position;
}

function expandFenEmptySquares(fen) {
  return fen
    .replace(/8/g, '11111111')
    .replace(/7/g, '1111111')
    .replace(/6/g, '111111')
    .replace(/5/g, '11111')
    .replace(/4/g, '1111')
    .replace(/3/g, '111')
    .replace(/2/g, '11');
}

export function validFen(fen) {
  if (!isString(fen)) return false;

  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, '');

  // expand the empty square numbers to just 1s
  fen = expandFenEmptySquares(fen);

  // FEN should be 8 sections separated by slashes
  let chunks = fen.split('/');
  if (chunks.length !== 8) return false;

  // check each section
  for (let i = 0; i < 8; i++) {
    if (chunks[i].length !== 8 || chunks[i].search(/[^kqrnbpKQRNBP10?-]/) !== -1) {
      return false;
    }
  }

  return true;
}

// convert FEN piece code to bP, wK, etc
function fenToPieceCode(piece) {
  if (piece === 'p') {
    return 'bP';
  }
  if (piece === 'P') {
    return 'wP';
  }
  if (piece === 'n') {
    return 'bN';
  }
  if (piece === 'N') {
    return 'wN';
  }
  if (piece === 'b') {
    return 'bB';
  }
  if (piece === 'B') {
    return 'wB';
  }
  if (piece === 'r') {
    return 'bR';
  }
  if (piece === 'R') {
    return 'wR';
  }
  if (piece === 'q') {
    return 'bQ';
  }
  if (piece === 'Q') {
    return 'wQ';
  }
  if (piece === 'k') {
    return 'bK';
  }
  if (piece === 'K') {
    return 'wK';
  }
  if (piece === squareStates.UNKNOWN) {
    return squareStates.UNKNOWN;
  }
  if (piece === squareStates.OCCUPIED) {
    return squareStates.OCCUPIED;
  }
}

function validSquare(square) {
  return isString(square) && square.search(/^[a-h][1-8]$/) !== -1;
}

// TODO: change ?, 0, - to constants
function validPieceCode(code) {
  return isString(code) && code.search(/^[bw][KQRNBP]|0|-|\?$/) !== -1;
}

export function validPositionObject(pos) {
  if (pos === null || typeof pos !== 'object') return false;

  for (let i in pos) {
    if (!pos.hasOwnProperty(i)) continue;

    if (!validSquare(i) || !validPieceCode(pos[i])) {
      return false;
    }
  }
  return true;
}

// convert bP, wK, etc code to FEN structure
function pieceCodeToFen(piece) {
  if (piece === squareStates.UNKNOWN) {
    return squareStates.UNKNOWN;
  }

  if (piece === squareStates.EMPTY) {
    return squareStates.EMPTY;
  }

  if (piece === squareStates.OCCUPIED) {
    return squareStates.OCCUPIED;
  }

  let pieceCodeLetters = piece.split('');

  if (pieceCodeLetters[0] === 'w') {
    return pieceCodeLetters[1].toUpperCase();
  }

  if (pieceCodeLetters[0] === 'b') {
    return pieceCodeLetters[1].toLowerCase();
  }
}

export function objToFen(obj) {
  if (!validPositionObject(obj)) return false;

  let fen = '';

  let currentRow = 8;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = COLUMNS[j] + currentRow;

      if (obj.hasOwnProperty(square)) {
        fen = fen + pieceCodeToFen(obj[square]);
      } else {
        fen = fen + squareStates.EMPTY;
      }
    }

    if (i !== 7) {
      fen = fen + '/';
    }

    currentRow = currentRow - 1;
  }

  return fen;
}
