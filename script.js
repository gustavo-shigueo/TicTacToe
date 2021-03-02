const gameOverScreen = document.getElementById("endingMessage")
const restartButton = document.getElementById("restartButton")
const board = document.getElementById('board')
const cellElements = document.querySelectorAll('[data-cell]')
const CIRCLE_CLASS = 'o'
const X_CLASS = 'x'
let winner = null
let bestMove
let scores = {
  x: -1,
  o: 1,
  tie: 0
}

let cellVal = []
for (var i = 0; i < cellElements.length; i++) cellVal[i] = cellElements[i].classList[1]

restartButton.addEventListener('click', startGame)

function startGame() {
  winner = null
  bestMove = null
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
    gameOverScreen.classList.remove('show')
  })
  setBoardHoveredClass()
}

// Check win
function check_win() {
  for (let i = 0; i < 3; i++) {
    // Checking rows
    if (cellVal[i * 3] === cellVal[i * 3 + 1] && cellVal[i * 3] === cellVal[i * 3 + 2] && cellVal[i * 3])
      winner = cellVal[i * 3]
    // Checking columns
    if (cellVal[i] === cellVal[i + 3] && cellVal[i + 3] === cellVal[i + 6] && cellVal[i]) winner = cellVal[i]
    if (winner !== null) break
  }

  // Checking diagonals       
  diagonal_1 = (cellVal[0] === cellVal[4] && cellVal[4] === cellVal[8] && cellVal[4])
  diagonal_2 = (cellVal[2] === cellVal[4] && cellVal[4] === cellVal[6] && cellVal[4])
  if (diagonal_1 || diagonal_2) winner = cellVal[4]

  return winner !== null
}

// Check Tie or Check End
function check_game_over() {
  // Gets board state
  for (let i = 0; i < cellElements.length; i++) cellVal[i] = cellElements[i].classList[1]

  // Check for win
  const win = check_win()
  if (win) return true

  // Check for tie 
  let tie = true
  for (const val of cellVal) {
    if (val) continue
    tie = false
    break
  }
  winner = tie ? 'tie' : null
  return tie
}

// Handle click event
function handleClick(e) {
  const cell = e.target
  let valid = placeMark(cell)
  if (!valid) return

  if(check_game_over()) game_over()
  best_move()
  winner = null
  const cellNumber = bestMove
  cellElements[cellNumber].classList.add(CIRCLE_CLASS)

  if(check_game_over()) game_over()
  setBoardHoveredClass()
}

// Place X mark
function placeMark(cell) {
  if (cell.classList.length === 1) {
		cell.classList.add('x')
		return true
	} else return false
}

// Hover effect
function setBoardHoveredClass() {
  board.classList.remove(X_CLASS)
  board.classList.add(X_CLASS)
}

// Display ending message
function game_over() {
  let gameOverMessage = document.querySelector('[data-ending-message-text]')
  let text = winner == "tie" ? "Draw!" : winner.toUpperCase() + " wins!"
  gameOverScreen.classList.add("show")
  gameOverMessage.innerHTML = text
}

// Best score
function best_move() {
  if (check_game_over()) return

  let depth = 0
  check_game_over()
  for (const value of cellVal) depth += !value

  // AI's turn
  let bestScore = -10
  for(let i = 0; i < 9; i++) {
    if (cellElements[i].classList.length !== 1) continue
    cellElements[i].classList.add(CIRCLE_CLASS)
    const score = minimax(depth, false, -10, 10)
    cellElements[i].classList.remove(CIRCLE_CLASS)
    bestScore = Math.max(score, bestScore)
    if (score >= bestScore) bestMove = i
  }
}

// Minimax
function minimax(depth, isMaximizing, alpha, beta) {
  let bestScore
  if (check_game_over() || !depth) {
		const r = scores[winner] * (depth >= 2 ? depth : 1)
		winner = null
		return r
	}
  if (isMaximizing) {
    bestScore = -10
    for (let i = 0; i < 9; i++) {
      if (cellElements[i].classList.length !== 1) continue
      cellElements[i].classList.add(CIRCLE_CLASS)
      const score = minimax(depth - 1, false, alpha, beta)
      cellElements[i].classList.remove(CIRCLE_CLASS)
      bestScore = Math.max(score, bestScore)
      alpha = Math.max(score, alpha)
      if (beta <= alpha) break
    }
  } else {
    bestScore = 10
    for(var i = 0; i < 9; i++) {
      if (cellElements[i].classList.length !== 1) continue
      cellElements[i].classList.add(X_CLASS)
      const score = minimax(depth - 1, true, alpha, beta)
      cellElements[i].classList.remove(X_CLASS)
      bestScore = Math.min(score, bestScore)
      beta = Math.min(score, beta)
      if (beta <= alpha) break
    }
  }
  return bestScore
}

startGame()