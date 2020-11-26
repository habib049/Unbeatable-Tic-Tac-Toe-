let human = true;
let computer = false;
let endGame = false

const computerSign = 'X';
const humanSign = 'O';

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];


let places = document.querySelectorAll("canvas");
places.forEach((place) => {
    place.addEventListener('click', humanTurn);
})

function humanTurn(e) {
    draw(this.id);
}

function draw(id) {
    if (!endGame) {
        if (isEmpty(id)) {
            let canvas = document.getElementById(id);
            if (human) {
                human = false;
                computer = true;
                drawO(canvas);
                addValueToBoard('O', id);
                let winner = checkWinner();
                if (winner != null) {
                    endGame = true;
                    showResults(winner);
                }else{
                    computerTurn();
                }

            }
        }
    }
}

function drawO(canvas) {
    let context = canvas.getContext("2d");
    let X = canvas.width / 2;
    let Y = canvas.height / 2;
    let R = 28;
    context.beginPath();
    context.arc(X, Y, R, 0, 2 * Math.PI, false);
    context.lineWidth = 5;
    context.strokeStyle = '#ff7b00';
    context.stroke();
}


function drawX(canvas) {
    let context = canvas.getContext("2d");
    context.lineWidth = 5;
    context.beginPath();
    context.strokeStyle = '#ffb300';
    context.moveTo(15, 15);
    context.lineTo(canvas.width - 15, canvas.height - 15);
    context.stroke();
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(canvas.width - 15, 15);
    context.lineTo(15, canvas.height - 15);
    context.stroke();
}

function addValueToBoard(value, position) {
    board[position[0]][position[1]] = value;
}

//check position is empty or not
function isEmpty(position) {
    return board[position[0]][position[1]] === "";
}

//check is three numbers are equal and not none
function isEqual(x, y, z) {
    return x === y && y === z && x !== '';
}

//check if any empty in board
function anyEmpty() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return true
            }
        }
    }
    return false
}


//checking the winner if any

function checkWinner() {
    let winner = null;
    // checking in rows
    for (let i = 0; i < 3; i++) {
        if (isEqual(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }
    }
    // checking in columns
    for (let i = 0; i < 3; i++) {
        if (isEqual(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }
    //checking diagonally
    if (isEqual(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }
    if (isEqual(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
    }
    if (winner == null && !anyEmpty())
        return 'tie'
    else
        return winner;

}

function showResults(winner) {
    if(winner === "tie"){
        document.getElementById('result').innerHTML ="Match Tie";
    }
    else{
        document.getElementById('result').innerHTML =winner + "! wins";
    }
    document.getElementsByClassName('options')[0].style.visibility="visible";
}

function clearBoard() {
    //clearing leternal board
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = "";
        }
    }
    //clearing original table board
    document.querySelectorAll("canvas").forEach((place) => {
        const canvas = document.getElementById(place.id);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    })

    //setting turns
    human = true;
    computer = false;
    endGame = false
    document.getElementsByClassName('options')[0].style.visibility="hidden";
}

document.getElementById('clear').addEventListener('click', () => {
    clearBoard();
})


//playing with computer


let scores = {
    X: 10,
    O: -10,
    tie: 0
};


function computerTurn() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Is the spot available?
            if (board[i][j] === '') {
                board[i][j] = computerSign;
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = [i, j];

                }
            }
        }
    }

    let canvas_id=move[0].toString()+move[1].toString();
    let canvas = document.getElementById(canvas_id);
    computer = false;
    human = true;
    drawX(canvas);
    addValueToBoard('X', canvas_id);
    let winner = checkWinner();
    if (winner != null) {
        endGame = true;
        showResults(winner);
    }

}


function minimax(board, depth, isMax) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    // If this maximizer's move
    if (isMax) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i][j] === '') {
                    board[i][j] = computerSign;
                    let score = minimax(board, depth + 1, !isMax);
                    board[i][j] = '';
                    bestScore = getMax(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i][j] === '') {
                    board[i][j] = humanSign;
                    let score = minimax(board, depth + 1, !isMax);
                    board[i][j] = '';
                    bestScore = getMin(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function getMax(a, b) {
    if (a > b)
        return a;
    else
        return b;
}

function getMin(a, b) {
    if (a < b)
        return a;
    else
        return b;
}
