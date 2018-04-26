// Change these to true and 2 for testing, defaults are false and 4
var easyTesting = true;
var numColors = 4;
// Change this if needed
var winningScore = 350;

var colors = ["#FFB3BA", "#BAE1FF", "#BAFFC9", "#FFFFBA"];
var black = "#6B6B6B";
var canvas = document.getElementById("canvas");
var board = canvas.getContext("2d");
var tileWidth = 40;
var tileHeight = 40;
var boardWidth = 15;
var boardHeight = 15;
var score = 0;
var tilesClicked = 0;
var tilesCleared = 0;
var hasWon = false;
if (easyTesting) {
    boardWidth = 10;
    boardHeight = 10;
    tileWidth = 60;
    tileHeight = 60;
}
var tiles = [];
var visited = [];
for (i = 0; i < boardWidth; i++) {
    var column = [];
    var visitedCol = [];
    for (j = 0; j < boardHeight; j++) {
        column.push(colors[Math.floor(Math.random() * numColors)]);
        visitedCol.push(false);
    }
    tiles.push(column);
    visited.push(visitedCol);
}
canvas.addEventListener('click', function(event) {
    var x = Math.floor((event.pageX - canvas.offsetLeft) / tileWidth);
    var y = Math.floor((event.pageY - canvas.offsetTop) / tileHeight);
    //console.log("x: " + x + ", y: " + y);
    if (tiles[x][y] != black && validClick(x, y)) {
        resetVisited();
        tilesClicked = 0;
        clickTile(x, y, tiles[x][y]);
        score += tilesClicked * (tilesClicked - 1);
        bubbleUp();
        slideLeft();
        drawBoard();
        updateScore();
        checkWin();
        checkLose();
    }
}, false);

drawBoard();
updateScore();

function checkLose() {
    if (hasWon) return;
    for (i = 0; i < boardWidth; i++) {
        for (j = boardHeight - 1; j >= 0; j--) {
            if (validClick(i, j)) {
                return;
            }
        }
    }
    alert("You lose!\nThere are no more available matches.");
    updateProgress();
}

function validClick(x, y) {
    if (tiles[x][y] == black) return false;
    if (x > 0) {
        if (tiles[x][y] == tiles[x - 1][y]) return true;
    }
    if (y > 0) {
        if (tiles[x][y] == tiles[x][y - 1]) return true;
    }
    if (x < boardWidth - 1) {
        if (tiles[x][y] == tiles[x + 1][y]) return true;
    }
    if (y < boardHeight - 1) {
        if (tiles[x][y] == tiles[x][y + 1]) return true;
    }
    return false;
}

function checkWin() {
    //console.log(tilesCleared);
    if (tilesCleared >= (boardWidth * boardHeight)) {
        alert("You won!\nYour final score was: " + score);
        hasWon = true;
        updateProgress();
        win();
    }
}

function slideLeft() {
    var filledColumns = []
    var emptyColumns = [];
    for (i = 0; i < boardWidth; i++) {
        var numTiles = 0;
        for (j = 0; j < boardHeight; j++) {
            if (tiles[i][j] != black) {
                numTiles++;
            }
        }
        if (numTiles > 0) {
            filledColumns.push(tiles[i]);
        } else {
            emptyColumns.push(tiles[i]);
        }
    }
    tiles = filledColumns.concat(emptyColumns);
}

function bubbleUp() {
    var bubbledBoard = [];
    for (i = 0; i < boardWidth; i++) {
        var bubbledColumn = [];
        var bubbles = [];
        var nonBubbles = [];
        for (j = 0; j < boardHeight; j++) {
            if (tiles[i][j] == black) {
                bubbles.push(black);
            } else {
                nonBubbles.push(tiles[i][j]);
            }
        }
        bubbledColumn = bubbles.concat(nonBubbles);
        bubbledBoard.push(bubbledColumn);
    }
    tiles = bubbledBoard;
}

function clickTile(x, y, color) {
    if (visited[x][y] || tiles[x][y] != color) {
        return;
    }
    visited[x][y] = true;
    tiles[x][y] = black;
    tilesClicked++;
    tilesCleared++;
    if (x > 0) clickTile(x - 1, y, color);
    if (y > 0) clickTile(x, y - 1, color);
    if (x < boardWidth - 1) clickTile(x + 1, y, color);
    if (y < boardHeight - 1) clickTile(x, y + 1, color);
}

function resetVisited() {
    visited = [];
    for (i = 0; i < boardWidth; i++) {
        var visitedCol = [];
        for (j = 0; j < boardHeight; j++) {
            visitedCol.push(false);
        }
        visited.push(visitedCol);
    }
}

function drawBoard() {
    for (i = 0; i < boardWidth; i++) {
        for (j = 0; j < boardHeight; j++) {
            board.fillStyle = tiles[i][j];
            board.fillRect(i*tileWidth, j*tileHeight, tileWidth, tileHeight);
        }
    }
}

function updateScore() {
    document.getElementById("score").innerHTML = "Score: " + score;
}

function updateProgress() {
    var newProgress = (score / winningScore) * 100;
    var oldProgress = 0.0;
    var storage = localStorage.getItem("progress1");
    if (!(storage === null)) {
        oldProgress = parseFloat(storage);
    }
    if (oldProgress > newProgress) {
        newProgress = oldProgress;
    }
    localStorage.setItem("progress1", newProgress);
}

function win() {
    if (score >= winningScore) {
        localStorage.setItem("won1", "true");
    }
}