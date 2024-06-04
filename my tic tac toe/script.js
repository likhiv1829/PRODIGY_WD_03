const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const playerModeButton = document.getElementById('playerMode');
const computerModeButton = document.getElementById('computerMode');
const toggleThemeButton = document.getElementById('toggleTheme');
const playerXScoreElement = document.getElementById('playerXScore');
const playerOScoreElement = document.getElementById('playerOScore');

let oTurn;
let againstComputer = false;
let gameActive = true;
let playerXScore = 0;
let playerOScore = 0;

playerModeButton.addEventListener('click', () => startGame(false));
computerModeButton.addEventListener('click', () => startGame(true));
restartButton.addEventListener('click', resetGame);
toggleThemeButton.addEventListener('click', toggleTheme);

function startGame(computerMode) {
  againstComputer = computerMode;
  oTurn = false;
  gameActive = true;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.textContent = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  messageElement.innerText = '';
}

function handleClick(e) {
  if (!gameActive) return;
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    if (againstComputer && oTurn) {
      setTimeout(computerMove, 500);
    }
    setBoardHoverClass();
  }
}

function computerMove() {
  const availableCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, O_CLASS);
  if (checkWin(O_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  gameActive = false;
  if (draw) {
    messageElement.innerText = 'Draw!';
  } else {
    messageElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
    if (oTurn) {
      playerOScore++;
      playerOScoreElement.innerText = `Player O: ${playerOScore}`;
    } else {
      playerXScore++;
      playerXScoreElement.innerText = `Player X: ${playerXScore}`;
    }
  }
  cellElements.forEach(cell => cell.removeEventListener('click', handleClick));
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.textContent = currentClass.toUpperCase();
}

function swapTurns() {
  oTurn = !oTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function resetGame() {
  playerXScore = 0;
  playerOScore = 0;
  playerXScoreElement.innerText = `Player X: ${playerXScore}`;
  playerOScoreElement.innerText = `Player O: ${playerOScore}`;
  startGame(againstComputer);
}
