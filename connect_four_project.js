/**
 * Connect Four Game
 * Author: Mohamed Amr
 * Description: This is a Connect Four game with functionality to highlight the winning player's pieces in yellow before announcing the winner.
 * License: All rights reserved to Mohamed Amr.
 * Date: [24/12/2024]
 */

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");

  // Clear the board if it already exists (to reset game if necessary)
  htmlBoard.innerHTML = "";

  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);
  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** highlightWinningPieces: highlight the winning pieces in yellow */
function highlightWinningPieces(cells, callback) {
  cells.forEach(([y, x]) => {
    const cell = document.getElementById(`${y}-${x}`);
    if (cell && cell.firstChild) {
      cell.firstChild.style.backgroundColor = "yellow";
    }
  });

  // Wait before announcing the winner
  setTimeout(callback, 500);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  const x = +evt.target.id;

  // Get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // Place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // Check for win
  if (checkForWin()) {
    return;
  }

  // Check for tie
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame("DRAW");
  }

  // Switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz)) {
        highlightWinningPieces(horiz, () => endGame(`Player ${currPlayer} won!!!`));
        return true;
      }
      if (_win(vert)) {
        highlightWinningPieces(vert, () => endGame(`Player ${currPlayer} won!!!`));
        return true;
      }
      if (_win(diagDR)) {
        highlightWinningPieces(diagDR, () => endGame(`Player ${currPlayer} won!!!`));
        return true;
      }
      if (_win(diagDL)) {
        highlightWinningPieces(diagDL, () => endGame(`Player ${currPlayer} won!!!`));
        return true;
      }
    }
  }
  return false;
}

makeBoard();
makeHtmlBoard();
