const BOARD_SIZE = 20;
const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;

let gameBoard = document.getElementById('gameBoard');
let scoreDisplay = document.getElementById('score');
let gameOverMessage = document.getElementById('gameOverMessage');
let restartBtn = document.getElementById('restartBtn');

let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let score = 0;
let gameOver = false;
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let gameLoop;

// Initialize the game board
function initializeBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < CELL_COUNT; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;
        gameBoard.appendChild(cell);
    }
}

// Get cell ID from coordinates
function getCellId(x, y) {
    return `cell-${y * BOARD_SIZE + x}`;
}

// Render the game state
function render() {
    // Clear all cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.className = 'cell';
    });

    // Draw snake
    snake.forEach(segment => {
        const cellId = getCellId(segment.x, segment.y);
        const cell = document.getElementById(cellId);
        if (cell) cell.classList.add('snake');
    });

    // Draw apple
    const appleCellId = getCellId(apple.x, apple.y);
    const appleCell = document.getElementById(appleCellId);
    if (appleCell) appleCell.classList.add('apple');
}

// Move the snake
function moveSnake() {
    if (gameOver) return;

    direction = nextDirection;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        detectGameOver();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        detectGameOver();
        return;
    }

    snake.unshift(head);

    // Check if apple is eaten
    if (head.x === apple.x && head.y === apple.y) {
        increaseScore();
        createFood();
    } else {
        snake.pop();
    }

    render();
}

// Create food (apple)
function createFood() {
    let newApple;
    let validPosition = false;

    while (!validPosition) {
        newApple = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE)
        };

        // Check if apple spawns on snake
        validPosition = !snake.some(segment => segment.x === newApple.x && segment.y === newApple.y);
    }

    apple = newApple;
}

// Increase score
function increaseScore() {
    score += 10;
    scoreDisplay.textContent = score;
}

// Detect game over
function detectGameOver() {
    gameOver = true;
    gameOverMessage.textContent = `Game Over! Final Score: ${score}`;
    restartBtn.style.display = 'block';
    clearInterval(gameLoop);
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0)
                nextDirection = { x: 0, y: -1 };
            e.preventDefault();
            break;

        case 'ArrowDown':
            if (direction.y === 0)
                nextDirection = { x: 0, y: 1 };
            e.preventDefault();
            break;

        case 'ArrowLeft':
            if (direction.x === 0)
                nextDirection = { x: -1, y: 0 };
            e.preventDefault();
            break;

        case 'ArrowRight':
            if (direction.x === 0)
                nextDirection = { x: 1, y: 0 };
            e.preventDefault();
            break;
    }
});

// Add the touch controls here
let startX = 0;
let startY = 0;

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    if (gameOver) return;

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {

        // Swipe Right
        if (dx > 30 && direction.x === 0) {
            nextDirection = { x: 1, y: 0 };
        }

        // Swipe Left
        else if (dx < -30 && direction.x === 0) {
            nextDirection = { x: -1, y: 0 };
        }

    } else {

        // Swipe Down
        if (dy > 30 && direction.y === 0) {
            nextDirection = { x: 0, y: 1 };
        }

        // Swipe Up
        else if (dy < -30 && direction.y === 0) {
            nextDirection = { x: 0, y: -1 };
        }
    }
});

document.addEventListener("touchmove", function (e) {
    e.preventDefault();
}, { passive: false });


// Reset and restart the game
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    apple = { x: 15, y: 15 };
    score = 0;
    gameOver = false;
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    scoreDisplay.textContent = score;
    gameOverMessage.textContent = '';
    restartBtn.style.display = 'none';
    render();
    startGame();
}

// Restart game listeners for both desktop and mobile
restartBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    resetGame();
});

// Start the game loop
function startGame() {
    gameLoop = setInterval(moveSnake, 100);
}

// Initialize and start
initializeBoard();
render();
startGame();

