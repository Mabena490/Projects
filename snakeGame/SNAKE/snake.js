//board
var blockSize = 25;
var rows = 25;
var cols = 25;
var snakeSpeedX = 0;
var snakeSpeedY = 0;
var headX = blockSize * 5;
var headY = blockSize * 5;
var obstacleCount = 3;
var board, context, obstacleX, obstacleY, foodX, foodY; 
var snakeBody = [];
var blockObstacles = [];
var powerUpX;
var powerUpY;
var powerUpActive = false;
var gameOver = false;


window.onload = function() {
    
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // drawing on the board
                                                                                      
    placeFood();
    document.addEventListener("keyup", changeDirection);
    // update();
    setInterval(update, 1000/10); //100 milliseconds
   
    //Add obstacle
    for (let i = 0; i < 3; i++) {
        placeObstacle();
    }
   
    setTimeout(placePowerUp, 10);
}

function update() {
    if (gameOver) {
        return;
    }
    context.fillStyle="teal";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle="white";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (headX == foodX && headY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [headX, headY];
    }

    context.fillStyle="black";
    headX += snakeSpeedX * blockSize;
    headY += snakeSpeedY * blockSize;
    context.fillRect(headX, headY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //obstacle
    context.fillStyle = "lime";
    for (let i = 0; i < blockObstacles.length; i++) {
        context.fillRect(blockObstacles[i][0], blockObstacles[i][1], blockSize, blockSize);
    }
   
    //check collision with power-up
    if (headX === powerUpX && headY === powerUpY) {
        powerUpActive = false;
        snakeBody.pop(); // Shorten the snake
    }

    context.fillStyle = "red";
    if (powerUpActive) {
        context.fillRect(powerUpX, powerUpY, blockSize, blockSize);
    }
    
    //game over conditions for edge wrapping 
    if (headX < 0 || headX > cols*blockSize || headY < 0 || headY > rows*blockSize) {
        gameOver = true;
        alert("Game Over");
    }

   // gome over when the head eats its own body/tail
    for (let i = 0; i < snakeBody.length; i++) {
        if (headX == snakeBody[i][0] && headY == snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }

    //checks if the head collides with the obstacle block
    for (let i = 0; i < blockObstacles.length; i++) {
        if (headX === blockObstacles[i][0] && headY === blockObstacles[i][1]) {
            gameOver = true;
            alert("Game Over");
        }
    }
    
} 


function placeFood() {
    //random food placement 
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}


function placeObstacle() {
   
    do {
        obstacleX = Math.floor(Math.random() * cols) * blockSize;
        obstacleY = Math.floor(Math.random() * rows) * blockSize;
    }  // Ensure the obstacle doesn't overlap with food
    while (obstacleX === foodX && obstacleY === foodY); 
    
    for (let i = 0; i < snakeBody.length; i++) {
        if (obstacleX === snakeBody[i][0] && obstacleY === snakeBody[i][1]) {
            // If the obstacle overlaps with the snake, regenerate its position
            return placeObstacle();
        }
    }

    // Add the obstacle to the obstacles array
    blockObstacles.push([obstacleX, obstacleY]);
}


function placePowerUp() {
    powerUpX = Math.floor(Math.random() * cols) * blockSize;
    powerUpY = Math.floor(Math.random() * rows) * blockSize;

    for (let i = 0; i < snakeBody.length; i++) {
        if (powerUpX === snakeBody[i][0] && powerUpY === snakeBody[i][1]) {
            // If the power-up overlaps with the snake, regenerate its position
            return placePowerUp();
        }
    }


    if (
        (powerUpX === foodX && powerUpY === foodY) ||
        (powerUpX === obstacleX && powerUpY === obstacleY) ||
        (powerUpX === headX && powerUpY === headY) ||
        (powerUpX < 0 || powerUpX >= cols * blockSize || powerUpY < 0 || powerUpY >= rows * blockSize)
    ) {
        return placePowerUp();
    }

    powerUpActive = true;

}

function changeDirection(d) {
     if (d.code == "ArrowLeft" && snakeSpeedX != 1) {
        snakeSpeedX = -1;
        snakeSpeedY = 0;
    }
    else if (d.code == "ArrowRight" && snakeSpeedX != -1) {
        snakeSpeedX = 1;
        snakeSpeedY = 0;
    }
  else if (d.code == "ArrowUp" && snakeSpeedY != 1) {
        snakeSpeedX = 0;
        snakeSpeedY = -1;
    }
    else if (d.code == "ArrowDown" && snakeSpeedY != -1) {
        snakeSpeedX = 0;
        snakeSpeedY = 1;
    }
}


