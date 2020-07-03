// Check win
function check_win(){
    // Checking rows
    for(var i = 0; i < 3; i++){
        if (board[i][0] == board[i][1] &&
            board[i][1] == board[i][2] &&
            board[i][1] != " ") winner = board[i][0];            
    }
    // Checking columns
    for(var i = 0; i < 3; i++){
        if (board[0][i] == board[1][i] &&
            board[1][i] == board[2][i] &&
            board[1][i] != " ") winner = board[0][i];
    }
    // Checking diagonals
    diagonal_1 = (board[0][0] == board[1][1] &&
                board[1][1] == board[2][2] &&
                board[1][1] != " ");
    diagonal_2 = (board[0][2] == board[1][1] &&
                board[1][1] == board[2][0] &&
                board[1][1] != " ");
    
    if (diagonal_1 || diagonal_2) winner = board[1][1];

    return winner != null;
}

// Check Tie or Check End
function check_game_over(){

    // Check for win
    let win = check_win();
    if(win) return true;
    
    // Check for tie 
    let tie = true;
    for(var i = 0; i < 3; i++){
    
        for(cell of board[i]){
        
            if(cell == " ") {
                
                tie = false;
                break;
            
            }
        
        }
    
    }
    if(tie) winner = "Tie!";
    else winner = null;
    
    return tie;

}
    
// Human player movement
function human_move(){

    var i = move - 1
    var j = int((move - 1) / 3)
    if(j == 1) i -= 3
    else if(j == 2) i -= 6
    if(board[j][i] != " ") human_move()
    else board[j][i] = current_player

}

// Best score
function best_move(){

    var depth = 0;

    for(var k = 0; k < 3; k++){
        for(var l = 0; l < 3; l++) {
            if(board[k][l] == " ") depth += 1;
        }
    }
    
    bestScore = -Infinity;
    // AI's turn
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            if(board[i][j] == " ") {
                board[i][j] = ai;
                var score = minimax(depth, false, -Infinity, Infinity);
                board[i][j] = " ";
                if (score > bestScore) {
                    bestScore = score
                    bestMove = [i, j]
                }
            }
        }
    }
}

// Minimax
function minimax(depth, isMaximizing, alpha, beta) {

    var result = check_game_over()
    if(result || depth == 0){
        r = scores[winner]
        if(depth >= 2) r *= depth
        winner = null
        result = false
        return r
    }
    if(isMaximizing){
        bestScore = -Infinity
        for(var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if(board[i][j] == " ") {
                    board[i][j] = ai
                    score = minimax(depth - 1, false, alpha, beta)
                    board[i][j] = " "
                    bestScore = max(score, bestScore)
                    alpha = max(score, alpha)
                }
                if(beta <= alpha) break
            }
            if(beta <= alpha) break
        }
        return bestScore
    } else {
        bestScore = Infinity
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++){
                if(board[i][j] == " ") {
                    board[i][j] = human
                    score = minimax(depth - 1, true, alpha, beta)
                    board[i][j] = " "
                    bestScore = min(score, bestScore)
                    beta = min(score, beta)
                }
                if(beta <= alpha) break
            }
            if(beta <= alpha) break
        }
        return bestScore
    }
}
while(true) {
    let board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];
    var bestMove = [];
    let human = "X"
    let ai = "O"
    let scores = {
        "X": -1,
        'O': 1,
        "Tie!": 0
    }
    var current_player = human
    var winner = null

    // Play
    while(check_game_over() == false) {
        if(current_player == human) {
            human_move()
            current_player = ai
        } else {
            best_move()
            board[bestMove[0]][bestMove[1]] = ai
            winner = null
            current_player = human
        }
    }
    if(winner != "Tie!")
        print(winner + " wins!")
    else{
        print(winner)
    }
}