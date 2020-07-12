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
for(var i = 0; i < cellElements.length; i++) cellVal[i] = cellElements[i].classList[1]

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
       
    for(var i = 0; i < 3; i++) {
        // Checking rows
        if(cellVal[i * 3] === cellVal[i * 3 + 1] && cellVal[i * 3] === cellVal[i * 3 + 2] && cellVal[i * 3])
            winner = cellVal[i * 3]
        // Checking columns
        if(cellVal[i] === cellVal[i + 3] && cellVal[i + 3] === cellVal[i + 6] && cellVal[i])
            winner = cellVal[i]
        if(winner != null) break
    }
    
    // Checking diagonals       
    diagonal_1 = (cellVal[0] === cellVal[4] && cellVal[4] === cellVal[8] && cellVal[4])
    diagonal_2 = (cellVal[2] === cellVal[4] && cellVal[4] === cellVal[6] && cellVal[4])
    if(diagonal_1 || diagonal_2) winner = cellVal[4]

    return(winner != null)
    
}

// Check Tie or Check End
function check_game_over() {
    
    // Gets board state
    for(var i = 0; i < cellElements.length; i++) cellVal[i] = cellElements[i].classList[1]

    // Check for win
    let win = check_win()
    if(win) return true
    
    // Check for tie 
    let tie = true
    for(var val of cellVal) {
        if(!val) {
            tie = false
            break
        }
    }
    if(tie) winner = 'tie'
    else winner = null
    return tie

}

// Handle click event
function handleClick(e) {
    
    const cell = e.target
    let valid = placeMark(cell)
    if(!valid) return
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
    if(!cell.classList.contains('x') && !cell.classList.contains('o')) {
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
    var gameOverMessage = document.querySelector('[data-ending-message-text]')
    var text = winner == "tie" ? "Draw!" : winner.toUpperCase() + " wins!"
    gameOverScreen.classList.add("show")
    gameOverMessage.innerHTML = text
}

// Best score
function best_move() {
    
    if(check_game_over()) return

    var depth = 0
    check_game_over()
    for(var value of cellVal) if(!value) depth += 1

    // AI's turn
    var bestScore = -10
    for(var i = 0; i < 9; i++) {
        if(cellElements[i].classList.length === 1) {
            cellElements[i].classList.add(CIRCLE_CLASS)
            var score = minimax(depth, false, -10, 10)
            cellElements[i].classList.remove(CIRCLE_CLASS)
            if(score > bestScore) {
                bestScore = score
                bestMove = i
            }
        }
    }
    
}

// Minimax
function minimax(depth, isMaximizing, alpha, beta) {
    
    var score
    var bestScore
    var result = check_game_over()
    if(result || depth == 0) {
        var r = scores[winner]
        if(depth >= 2) r *= depth
        winner = null
        result = false
        return r
    }
    if(isMaximizing) {
        bestScore = -10
        for(var i = 0; i < 9; i++) {
            if(cellElements[i].classList.length === 1) {
                cellElements[i].classList.add(CIRCLE_CLASS)
                score = minimax(depth - 1, false, alpha, beta)
                cellElements[i].classList.remove(CIRCLE_CLASS)
                bestScore = Math.max(score, bestScore)
                alpha = Math.max(score, alpha)
            }
            if(beta <= alpha) break
        }
    } else {
        bestScore = 10
        for(var i = 0; i < 9; i++) {
            if(cellElements[i].classList.length === 1) {
                cellElements[i].classList.add(X_CLASS)
                score = minimax(depth - 1, true, alpha, beta)
                cellElements[i].classList.remove(X_CLASS)
                bestScore = Math.min(score, bestScore)
                beta = Math.min(score, beta)
            }
            if(beta <= alpha) break
        }
    }
    return bestScore
}

startGame()