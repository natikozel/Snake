class Snake {
    constructor() {
        this.gameBoard = document.querySelector("#gameBoard");
        this.ctx = this.gameBoard.getContext("2d");
        this.gameOverMessage = document.querySelector("#gameOverMessage");
        // this.scoreText = document.querySelector("#scoreText");
        this.resetBtn = document.querySelector("#resetBtn")
        this.gameWidth = this.gameBoard.width;
        this.gameHeight = this.gameBoard.height;
        this.boardBackground = "white";
        this.snakeColor = "lightgreen";
        this.snakeBorder = "black";
        this.foodColor = "red";
        this.unitSize = 25;
        this.running = false;
        this.xVelocity = this.unitSize;
        this.yVelocity = this.unitSize;
        this.score = 0
        this.snake = [
            {x: this.unitSize * 4, y: 0},
            {x: this.unitSize * 3, y: 0},
            {x: this.unitSize * 2, y: 0},
            {x: this.unitSize, y: 0},
            {x: 0, y: 0}
        ]

        window.addEventListener("keydown", this.changeDirection.bind(this))
        this.resetBtn.addEventListener("click", this.resetGame.bind(this))
    }

    changeDirection(e) {

        if ((e.key === 'ArrowRight' && this.direction !== 'ArrowLeft') ||
            (e.key === 'ArrowLeft' && this.direction !== 'ArrowRight') ||
            (e.key === 'ArrowUp' && this.direction !== 'ArrowDown') ||
            (e.key === 'ArrowDown' && this.direction !== 'ArrowUp'))
            this.direction = e.key
    }

    resetGame() {
        this.gameOverMessage.hidden = true;
        document.querySelector("#scoreText").textContent = 0;
        this.running = false
        this.score = 0;
        this.direction = ''
        this.snake = [
            {x: this.unitSize * 4, y: 0},
            {x: this.unitSize * 3, y: 0},
            {x: this.unitSize * 2, y: 0},
            {x: this.unitSize, y: 0},
            {x: 0, y: 0}
        ]
        this.init();
    }

    init() {
        this.gameOverMessage.hidden = true;
        this.running = true;
        this.scoreText = this.score;
        this.createFood();
        this.drawFood()
        this.nextTick();
    }

    nextTick() {

        if (this.running) {
            setTimeout(() => {
                this.clearBoard();
                this.drawFood();
                this.moveSnake();
                this.checkGameOver();
                this.drawSnake();
                this.nextTick();
            }, 100);
        } else
            this.displayGameOver()

    }

    clearBoard() {
        this.ctx.fillStyle = this.boardBackground
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight)
    }

    createFood = () => {
        const randomFood = (min, max) => Math.round((Math.random() * (max - min) + min) / this.unitSize) * this.unitSize
        this.foodX = randomFood(0, this.gameWidth)
        this.foodY = randomFood(0, this.gameWidth - this.unitSize)
    };

    drawFood() {
        this.ctx.fillStyle = this.foodColor;
        this.ctx.fillRect(this.foodX, this.foodY, this.unitSize, this.unitSize)
    }

    moveSnake() {
        // this.snake.shift()
        switch (this.direction) {
            case 'ArrowLeft':

                this.snake.unshift({x: this.snake[0].x + -this.xVelocity, y: this.snake[0].y})
                this.snake.pop()

                break;
            case 'ArrowRight':

                this.snake.unshift({x: this.snake[0].x + this.xVelocity, y: this.snake[0].y})
                this.snake.pop()

                break;
            case 'ArrowDown':

                this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y + this.yVelocity})
                this.snake.pop()

                break;
            case 'ArrowUp':
                this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y + -this.yVelocity})
                this.snake.pop()

                break;
        }
        if (this.snake[0].x === this.foodX && this.snake[0].y === this.foodY) {
            this.createFood();
            this.score ++;
            document.querySelector("#scoreText").textContent = this.score;
        }

        // this.snake.push({x: this.snake[4].x + this.xVelocity, y: this.snake[4].y + this.yVelocity})
    }

    drawSnake() {
        this.ctx.fillStyle = this.snakeColor;
        this.ctx.strokeStyle = this.snakeBorder;
        this.snake.forEach(snakePart => {
            this.ctx.fillRect(snakePart.x, snakePart.y, this.unitSize, this.unitSize)
            this.ctx.strokeRect(snakePart.x, snakePart.y, this.unitSize, this.unitSize)
        })
    }

    checkGameOver() {
        if (this.snake[0].x > this.gameWidth - this.unitSize || this.snake[0].y > this.gameHeight - this.unitSize ||
            this.snake[0].x < 0 || this.snake[0].y < 0)
            this.running = false;
    };

    displayGameOver() {
        this.gameOverMessage.hidden = false;
    };
}

const game = new Snake();
game.init();