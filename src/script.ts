interface SnakeSquare {
    x: number;
    y: number;
}

class Snake {
    private gameBoard: HTMLCanvasElement = document.querySelector("#gameBoard")!;
    private ctx = this.gameBoard.getContext("2d")!;
    private gameOverMessage: HTMLHeadingElement = document.querySelector("#gameOverMessage")!;
    private scoreText: HTMLDivElement = document.querySelector("#scoreText")!;
    private resetBtn: HTMLButtonElement = document.querySelector("#resetBtn")!;
    private gameWidth: number = this.gameBoard.width;
    private gameHeight: number = this.gameBoard.height;
    private boardBackground: string = "white";
    private snakeColor: string = "lightgreen";
    private snakeBorder: string = "black";
    private foodColor: string = "red";
    private unitSize: number = 25;
    private running: boolean = false;
    private xVelocity: number = this.unitSize;
    private yVelocity: number = this.unitSize;
    private score: number = 0;
    private foodX: number | null = null;
    private foodY: number | null = null;
    private direction: string | null = null;
    private snake: Array<SnakeSquare> = [
        {x: this.unitSize * 4, y: 0},
        {x: this.unitSize * 3, y: 0},
        {x: this.unitSize * 2, y: 0},
        {x: this.unitSize, y: 0},
        {x: 0, y: 0}
    ];


    constructor() {
        window.addEventListener("keydown", this.changeDirection.bind(this));
        this.resetBtn.addEventListener("click", this.resetGame.bind(this));
    }

    changeDirection(e: KeyboardEvent): void {

        if ((e.key === 'ArrowRight' && this.direction !== 'ArrowLeft') ||
            (e.key === 'ArrowLeft' && this.direction !== 'ArrowRight') ||
            (e.key === 'ArrowUp' && this.direction !== 'ArrowDown') ||
            (e.key === 'ArrowDown' && this.direction !== 'ArrowUp'))
            this.direction = e.key;
    }

    resetGame(): void {
        this.gameOverMessage.hidden = true;
        this.scoreText.textContent = '0';
        this.running = false;
        this.score = 0;
        this.direction = '';
        this.snake = [
            {x: this.unitSize * 4, y: 0},
            {x: this.unitSize * 3, y: 0},
            {x: this.unitSize * 2, y: 0},
            {x: this.unitSize, y: 0},
            {x: 0, y: 0}
        ];
        this.init();
    }

    init(): void {
        this.gameOverMessage.hidden = true;
        this.running = true;
        this.scoreText.textContent = ''+this.score;
        this.createFood();
        this.drawFood();
        this.nextTick();
    }

    nextTick(): void {

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
            this.displayGameOver();

    }

    clearBoard(): void {
        this.ctx.fillStyle = this.boardBackground;
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    }

    createFood = (): void => {
        const randomFood = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) / this.unitSize) * this.unitSize;
        while (this.foodX === null || this.foodY === null || this.snake.find((square: SnakeSquare) => square.x === this.foodX && square.y === this.foodY)) {
            this.foodX = randomFood(0, this.gameWidth - this.unitSize);
            this.foodY = randomFood(0, this.gameWidth - this.unitSize);
        }
    };

    drawFood() {
        this.ctx.fillStyle = this.foodColor;
        this.ctx.fillRect(+this.foodX!, +this.foodY!, this.unitSize, this.unitSize);
    }

    moveSnake() {

        const updateScore = (): boolean => {
            if (this.snake[0].x === this.foodX && this.snake[0].y === this.foodY) {
                this.createFood();
                this.score++;
                this.scoreText.textContent = ''+this.score;
                return true;
            }
            return false;
        };

        switch (this.direction) {
            case 'ArrowLeft':

                this.snake.unshift({x: this.snake[0].x + -this.xVelocity, y: this.snake[0].y});
                if (!updateScore())
                    this.snake.pop();
                break;
            case 'ArrowRight':

                this.snake.unshift({x: this.snake[0].x + this.xVelocity, y: this.snake[0].y});
                if (!updateScore())
                    this.snake.pop();
                break;
            case 'ArrowDown':

                this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y + this.yVelocity});
                if (!updateScore())
                    this.snake.pop();
                break;
            case 'ArrowUp':
                this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y + -this.yVelocity});
                if (!updateScore())
                    this.snake.pop();
                break;
        }
    }

    drawSnake(): void {
        this.ctx.fillStyle = this.snakeColor;
        this.ctx.strokeStyle = this.snakeBorder;
        this.snake.forEach((snakePart: SnakeSquare): void => {
            this.ctx.fillRect(snakePart.x, snakePart.y, this.unitSize, this.unitSize);
            this.ctx.strokeRect(snakePart.x, snakePart.y, this.unitSize, this.unitSize);
        });
    }

    checkGameOver(): void {
        if (this.snake[0].x > this.gameWidth - this.unitSize || this.snake[0].y > this.gameHeight - this.unitSize ||
            this.snake[0].x < 0 || this.snake[0].y < 0) {
            this.running = false;
            return;
        }
        this.snake.forEach((snakePart: SnakeSquare, i: number): void => {
            if (i > 0) {
                if (this.snake[0].x === snakePart.x && this.snake[0].y === snakePart.y) {
                    this.running = false;
                }
            }
        });
    };

    displayGameOver(): void {
        this.gameOverMessage.hidden = false;
    };
}

const game: Snake = new Snake();
game.init();