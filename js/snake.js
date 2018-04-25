// FOR TESTING: CHANGE THIS TO A LOW NUMBER
var winningSnakeSize = 50;
// If needed, change this to make the game go faster/slower,
// the time is in milliseconds per update/frame
var time = 100;
// Change this if you want rainbow snake and food...
var rainbow = true;
// other variables
var canvas = document.getElementById("canvas");
var board = canvas.getContext("2d");
var boardWidth = 40;
var boardHeight = 40;
var tileWidth = 20;
var tileHeight = 20;
var tileCircleRadius = 9;
var DIRECTIONS = ["LEFT", "UP", "RIGHT", "DOWN"];
var snakeDirection = DIRECTIONS[2];
var snakePositionX = [1];
var snakePositionY = [1];
var snakeSize = 1;
var hasMoved = false;
var foodTimer = 0;
var FOOD_RATE = 10;
var foodPositionX = [];
var foodPositionY = [];
var gameOver = false;
var gameOverMessage = "GAME OVER";
var snakeColors = ["#DDDDDD"];
var foodColors = [];
var colors = ["#A93226", "#CB4335",
              "#884EA0", "#7D3C98",  
              "#2471A3", "#2E86C1",  
              "#17A589", "#138D75",  
              "#229954", "#28B463",  
              "#D4AC0D", "#D68910", 
              "#CA6F1E", "#BA4A00",                        
];
var foodAudio = new Audio('../sounds/snake_food.mp3');
var winAudio = new Audio('../sounds/snake_win.mp3');
var loseAudio = new Audio('../sounds/snake_lose.mp3');

var timer = setInterval(timerFunction, time);
drawBoard();
drawSnake();

// clear board with dark grey tiles with black outlines
function drawBoard() {
    for (i = 0; i < boardWidth; i++) {
        for (j = 0; j < boardHeight; j++) {
            board.fillStyle = "#383838";
            board.fillRect(i*tileWidth, j*tileHeight, tileWidth, tileHeight);
            board.fillStyle = "#000000";
            board.strokeRect(i*tileWidth, j*tileHeight, tileWidth, tileHeight);
        }
    }
}

// draw snake
function drawSnake() {
    board.beginPath();
    board.fillStyle = "#DDDDDD";
    for (i = 0; i < snakeSize; i++) {
        board.moveTo(snakePositionX[i] + 0.5, snakePositionY[i] + 0.5);
        board.arc((snakePositionX[i] + 0.5) * tileWidth,
                  (snakePositionY[i] + 0.5) * tileHeight,
                  tileCircleRadius, 0, Math.PI * 2, true
        );
    }
    board.fill();
    /* draw a smiley
    board.beginPath();
    board.fillStyle = "#000000";
    board.arc((snakePositionX[snakePositionX.length - 1] + 0.5) * tileWidth,
                (snakePositionY[snakePositionY.length - 1] + 0.5) * tileHeight,
                tileCircleRadius - 3, 0, Math.PI, false
    );
    board.moveTo((snakePositionX[snakePositionX.length - 1] + 0.3) * tileWidth,
                 (snakePositionY[snakePositionY.length - 1] + 0.4) * tileWidth);
    board.arc((snakePositionX[snakePositionX.length - 1] + 0.3) * tileWidth,
              (snakePositionY[snakePositionY.length - 1] + 0.4) * tileWidth,
              tileCircleRadius / 5, 0, Math.PI * 2, true);
    board.moveTo((snakePositionX[snakePositionX.length - 1] + 0.7) * tileWidth,
                 (snakePositionY[snakePositionY.length - 1] + 0.4) * tileWidth);
    board.arc((snakePositionX[snakePositionX.length - 1] + 0.7) * tileWidth,
              (snakePositionY[snakePositionY.length - 1] + 0.4) * tileWidth,
              tileCircleRadius / 5, 0, Math.PI * 2, true);
    board.stroke();
    */
}

// draw food
function drawFood() {
    board.fillStyle = "#e0d274";
    for (i = 0; i < foodPositionX.length; i++) {
        board.beginPath();
        if (rainbow) {
            board.fillStyle = foodColors[i];
        } else {
            board.fillStyle = "#e0d274";
        }
        board.moveTo(foodPositionX[i] + 0.5, foodPositionY[i] + 0.5);
        board.arc((foodPositionX[i] + 0.5) * tileWidth,
                  (foodPositionY[i] + 0.5) * tileHeight,
                  tileCircleRadius, 0, Math.PI * 2, true
        );
        board.fill();
    }
}

function timerFunction() {
    if (gameOver) {
        clearInterval(timer);
        alert(gameOverMessage);
        return;
    }
    addFood();
    moveSnake();
    drawBoard();
    drawSnake();
    drawFood();
    document.getElementById("score").innerHTML = "Snake Length: " + (snakeSize);
}

function addFood() {
    // only add food every 10 intervals
    if (foodTimer > 0) {
        foodTimer -= 1;
        return;
    } else {
        foodTimer = FOOD_RATE;
    }
    // random position of new food
    var foodX = Math.floor(Math.random() * boardWidth);
    var foodY = Math.floor(Math.random() * boardHeight);
    var foodColor = colors[Math.floor(Math.random() * colors.length)];
    // if food is placed on snake or on top of another food, try again
    // otherwise place it
    var foodPlacementGood = true;
    for (i = 0; i < snakePositionX.length; i++) {
        if (snakePositionX[i] == foodX &&
            snakePositionY[i] == foodY) {
                foodPlacementGood = false;
            }
    }
    for (i = 0; i < foodPositionX.length; i++) {
        if (foodPositionX[i] == foodX &&
            foodPositionY[i] == foodY) {
                foodPlacementGood = false;
            }
    }
    if (!foodPlacementGood) {
        addFood();
    } else {
        foodPositionX.push(foodX);
        foodPositionY.push(foodY);
        foodColors.push(foodColor);
    }
}

function moveSnake() {
    // add a new head
    switch(snakeDirection) {
        case DIRECTIONS[0]: // left
            snakePositionX.push(snakePositionX[snakePositionX.length-1] - 1);
            snakePositionY.push(snakePositionY[snakePositionY.length-1]);
            break;
        case DIRECTIONS[1]: // up
            snakePositionX.push(snakePositionX[snakePositionX.length-1]);
            snakePositionY.push(snakePositionY[snakePositionY.length-1] - 1);
            break;
        case DIRECTIONS[2]: // right
            snakePositionX.push(snakePositionX[snakePositionX.length-1] + 1);
            snakePositionY.push(snakePositionY[snakePositionY.length-1]);
            break;
        case DIRECTIONS[3]: // down
            snakePositionX.push(snakePositionX[snakePositionX.length-1]);
            snakePositionY.push(snakePositionY[snakePositionY.length-1] + 1);
            break;
    }

    // remove the tail
    if (snakePositionX.length > snakeSize || snakePositionY > snakeSize) {
        snakePositionX.shift();
        snakePositionY.shift();
    }
    // check boundaries for loss conditions
    var snakeHeadX = snakePositionX[snakePositionX.length - 1];
    var snakeHeadY = snakePositionY[snakePositionY.length - 1];
    if (snakeHeadX >= boardWidth || snakeHeadX < 0 ||
        snakeHeadY >= boardHeight || snakeHeadY < 0) {
        gameOver = true;
        gameOverMessage = "GAME OVER\nYou went out of bounds!";
        loseAudio.play();
    }
    
    // check new head position against the rest of body to see if the snake ate himself
    for (i = 0; i < snakePositionX.length - 1; i++) {
        if (snakeHeadX == snakePositionX[i] &&
            snakeHeadY == snakePositionY[i]) {
                gameOver = true;
                gameOverMessage = "GAME OVER\nYou ate yourself!";
                loseAudio.play();
            }
    }

    // check new head position against foods to see if they are eaten
    for (i = 0; i < foodPositionX.length; i++) {
        if (foodPositionX[i] == snakeHeadX &&
            foodPositionY[i] == snakeHeadY) {
                // increase snake length
                snakeSize += 1;
                // play sound
                foodAudio.play();
                // add food color to snake
                snakeColors.push(foodColors[i]);
                // remove food from array
                foodPositionX.splice(i, 1);
                foodPositionY.splice(i, 1);
                foodColors.splice(i, 1);
                // break out of for loop
                i = foodPositionX.length;
            }
    }

    // check for winning condition (size)
    if (snakeSize >= winningSnakeSize) {
        gameOver = true;
        gameOverMessage = "You Won!";
        winAudio.play();
    }

    // set hasMoved to false
    // this is in place to prevent moving backwards into yourself
    // so that you will only be able to turn 90 degrees once
    // per movement forward (or per frame?)
    hasMoved = false;
}

document.addEventListener('keydown', function(event) {
    if (hasMoved) { return; }
    var key = event.which || event.keyCode;
    switch(key) {
        case 65: // A key
        case 37: // left key
            if (snakeDirection != DIRECTIONS[2] && snakeDirection != DIRECTIONS[0]) {
                snakeDirection = DIRECTIONS[0];
                hasMoved = true;
            }
            break;
        case 87: // W key
        case 38: // up key
            if (snakeDirection != DIRECTIONS[3] && snakeDirection != DIRECTIONS[1]) {
                snakeDirection = DIRECTIONS[1];
                hasMoved = true;
            }
            break;
        case 68: // D key
        case 39: // right key
            if (snakeDirection != DIRECTIONS[0] && snakeDirection != DIRECTIONS[2]) {
                snakeDirection = DIRECTIONS[2];
                hasMoved = true;
            }
            break;
        case 83: // S key
        case 40: // down key
            if (snakeDirection != DIRECTIONS[1] && snakeDirection != DIRECTIONS[3]) {
                snakeDirection = DIRECTIONS[3];
                hasMoved = true;
            }
            break;
    }
});
