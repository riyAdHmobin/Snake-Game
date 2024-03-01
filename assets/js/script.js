let blockSize = 8;
        let total_row = 100; //total row number
        let total_col = 100; //total column number
        let board;
        let context;
        let gameInterval;
        let paused = false;

        let snakeX = blockSize * 5;
        let snakeY = blockSize * 5;

        // Set the total number of rows and columns
        let speedX = 0; //speed of snake in x coordinate.
        let speedY = 0; //speed of snake in Y coordinate.

        let snakeBody = [];

        let foodX;
        let foodY;

        let gameOver = false;

        let score = 0; // initialize score

        window.onload = function () {
            // Set board height and width
            board = document.getElementById("board");
            board.height = total_row * blockSize;
            board.width = total_col * blockSize;
            context = board.getContext("2d");

            placeFood();
            document.addEventListener("keydown", startGame); // listen for any key press to start the game
        }

        function startGame() {
            document.getElementById("playScreen").style.display = "none"; // hide the play screen
            document.removeEventListener("keydown", startGame); // remove the event listener

            document.addEventListener("keyup", changeDirection); // add event listener for movements
            // Set snake speed
            gameInterval = setInterval(update, 1000 / 10);
        }

        function update() {
            if (gameOver || paused) {
                return;
            }

            // Clear the canvas
            context.clearRect(0, 0, board.width, board.height);

            // Set food color and position
            context.fillStyle = "yellow";
            context.beginPath();
            context.arc(foodX + blockSize / 2, foodY + blockSize / 2, blockSize / 2, 0, Math.PI * 2);
            context.fill();

            if (snakeX == foodX && snakeY == foodY) {
                snakeBody.push([foodX, foodY]);
                placeFood();
                score++; // increase score when snake eats food
                document.getElementById("score").innerText = "Score: " + score; // update score on screen
            }

            // body of snake will grow
            for (let i = snakeBody.length - 1; i > 0; i--) {
                // it will store previous part of snake to the current part
                snakeBody[i] = snakeBody[i - 1];
            }
            if (snakeBody.length) {
                snakeBody[0] = [snakeX, snakeY];
            }

            context.fillStyle = "red";
            snakeX += speedX * blockSize; //updating Snake position in X coordinate.
            snakeY += speedY * blockSize; //updating Snake position in Y coordinate.
            context.fillRect(snakeX, snakeY, blockSize, blockSize);
            for (let i = 0; i < snakeBody.length; i++) {
                context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
            }

            if (snakeX < 0 ||
                snakeX > total_col * blockSize ||
                snakeY < 0 ||
                snakeY > total_row * blockSize) {

                // Out of bound condition
                gameOver = true;
                clearInterval(gameInterval); // Stop the game loop
                showGameOverScreen();
            }

            for (let i = 0; i < snakeBody.length; i++) {
                if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {

                    // Snake eats own body
                    gameOver = true;
                    clearInterval(gameInterval); // Stop the game loop
                    showGameOverScreen();
                }
            }
        }

        function showGameOverScreen() {
            document.getElementById("gameOverScreen").style.display = "flex";
            document.getElementById("finalScore").innerText = score;
        }

        // Movement of the Snake - We are using addEventListener
        function changeDirection(e) {
            if (e.code == "ArrowUp" && speedY != 1) {
                // If up arrow key pressed with this condition...
                // snake will not move in the opposite direction
                speedX = 0;
                speedY = -1;
            } else if (e.code == "ArrowDown" && speedY != -1) {
                //If down arrow key pressed
                speedX = 0;
                speedY = 1;
            } else if (e.code == "ArrowLeft" && speedX != 1) {
                //If left arrow key pressed
                speedX = -1;
                speedY = 0;
            } else if (e.code == "ArrowRight" && speedX != -1) {
                //If Right arrow key pressed
                speedX = 1;
                speedY = 0;
            }
        }

        // Randomly place food
        function placeFood() {

            // in x coordinates.
            foodX = Math.floor(Math.random() * total_col) * blockSize;

            //in y coordinates.
            foodY = Math.floor(Math.random() * total_row) * blockSize;
        }

        // Function to toggle pause and resume
        function togglePauseResume() {
            if (paused) {
                paused = false;
                document.getElementById("pauseResumeButton").innerText = "Pause";
            } else {
                paused = true;
                document.getElementById("pauseResumeButton").innerText = "Resume";
            }
        }

        // Function to restart the game
        function restartGame() {
            document.getElementById("gameOverScreen").style.display = "none";
            clearInterval(gameInterval); // Stop the current game loop
            // Reset all game variables
            snakeX = blockSize * 5;
            snakeY = blockSize * 5;
            speedX = 0;
            speedY = 0;
            snakeBody = [];
            score = 0;
            gameOver = false;
            paused = false;
            document.getElementById("score").innerText = "Score: " + score; // Update score on screen
            placeFood(); // Place food for the new game
            gameInterval = setInterval(update, 1000 / 10); // Start a new game loop
        }