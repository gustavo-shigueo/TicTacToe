const gameOverScreen = document.getElementById("endingMessage");
const restartButton = document.getElementById("restartButton");
const board = document.getElementById('board');
const cellElements = document.querySelectorAll('[data-cell]');
const CIRCLE_CLASS = 'o';
const X_CLASS = 'x';
const ai = "o";
const human = "x";
let circleTurn;
let winner = null;
let bestMove;
let scores = {
    x: -1,
    o: 1,
    tie: 0
};

let Vboard = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
]

startGame()

// Check win
function check_win() {
    // Checking rows
    for (var i = 0; i < 3; i++) {
        if (Vboard[i][0] == Vboard[i][1] && Vboard[i][1] == Vboard[i][2] && Vboard[i][1] != " ")
            winner = Vboard[i][0];
    }
    // Checking columns
    for (var i = 0; i < 3; i++) {
        if (Vboard[0][i] == Vboard[1][i] && Vboard[1][i] == Vboard[2][i] && Vboard[1][i] != " ")
            winner = Vboard[0][i];
    }

    // Checking diagonals       
    diagonal_1 = (Vboard[0][0] == Vboard[1][1] && Vboard[1][1] == Vboard[2][2] && Vboard[1][1] != " ");
    diagonal_2 = (Vboard[0][2] == Vboard[1][1] && Vboard[1][1] == Vboard[2][0] && Vboard[1][1] != " ");
    if (diagonal_1 || diagonal_2)
        winner = Vboard[1][1];
        
    return (winner != null);

}
                
// Check Tie or Check End
function check_game_over() {
    
    // Check for win
    let win = check_win();
    if(win)
        return true;
    
    // Check for tie 
    let tie = true;
    for (var i = 0; i < 3; i++) {
        for (cell of Vboard[i]) {
            if (cell == " ") {
                tie = false;
                break;
            }
        }
    }
    if (tie) winner = "tie";
    else winner = null;
    
    return tie;
    
}

restartButton.addEventListener('click', startGame)

function startGame(){
    Vboard = [
              [' ', ' ', ' '],
              [' ', ' ', ' '],
              [' ', ' ', ' ']
            ]
    winner = null
    bestMove = null
    console.log(cellElements)
    circleTurn = false
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
        gameOverScreen.classList.remove('show')
    })
    setBoardHoveredClass()
}

function handleClick(e) {
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    // Check end
    if(!check_game_over()) {
        if(!circleTurn){
            // Place Mark - human
            const cell = e.target;
            let valid = placeMark(cell, currentClass);
            if(!valid)
                handleClick();
            if(!check_game_over()) {
                swapTurns();
                best_move();
                winner = null;
                var row = bestMove[0];
                var col = bestMove[1];
                Vboard[row][col] = CIRCLE_CLASS;
                var cellNumber = 3 * row + col;
                cellElements[cellNumber].classList.add(CIRCLE_CLASS);
                swapTurns();
                if(check_game_over()) {
                    game_over()
                }
            } else{
                game_over()
            }
        }
        setBoardHoveredClass();
    }
}


function placeMark(cell, currentClass) {
    var row = cell['dataset'].cell[0];
    var col = cell['dataset'].cell[1];
    if(Vboard[row][col] == ' '){
        Vboard[row][col] = currentClass;
        cell.classList.add(currentClass);
        return true
    } else{
        return false
    }
}

function swapTurns() {
    circleTurn = !circleTurn
}

function setBoardHoveredClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    setClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    board.classList.add(setClass)
}

// Best score
function best_move() {
    
    var depth = 0;
    
    for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
            if (Vboard[k][l] == " ") {
                depth += 1;
            }
        }
    }
    
    var bestScore = -10;
    // AI's turn
    var i = 0
    var j = 0
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (Vboard[i][j] == " ") {
                Vboard[i][j] = ai;
                var score = minimax(depth, false, -10, 10);
                Vboard[i][j] = " ";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = [i, j];
                }
            }
        }
    }

}

// Minimax
function minimax(depth, isMaximizing, alpha, beta) {

    var score;
    var bestScore;
    var result = check_game_over();
    if(result || depth == 0) {
        var r = scores[winner];
        if(depth >= 2) {
            r *= depth;
        }
        winner = null;
        result = false;
        return r;
    }
    if(isMaximizing) {
        bestScore = -10;
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                if(Vboard[i][j] == " ") {
                    Vboard[i][j] = ai;
                    score = minimax(depth - 1, false, alpha, beta);
                    Vboard[i][j] = " ";
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(score, alpha);
                }
                if(beta <= alpha) {
                    break
                }
            }
            if(beta <= alpha) {
                break
            }
        }
        return bestScore
    } else {
        bestScore = 10
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                if(Vboard[i][j] == " ") {
                    Vboard[i][j] = human;
                    score = minimax(depth - 1, true, alpha, beta);
                    Vboard[i][j] = " ";
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(score, beta);
                }
                if(beta <= alpha) {
                    break
                }
            }
            if(beta <= alpha) {
                break
            }
        }
        return bestScore
    }
}

function game_over() {
    var gameOverMessage = document.querySelectorAll('[data-ending-message-text]')[0];
    var text = winner == "tie" ? "Draw!" : winner.toUpperCase() + " wins!";
    gameOverScreen.classList.add("show");
    gameOverMessage.innerHTML = text; 
}