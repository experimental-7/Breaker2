const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const BALL_RADIUS = 10;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_X = 30;
const BRICK_OFFSET_Y = 30;
const BRICK_ROWS = 3;
const BRICK_COLS = 5;

// Initialize game objects
const ball = { x: canvas.width / 2, y: canvas.height - 30, dx: 5, dy: -5 };
const paddle = { x: canvas.width / 2 - PADDLE_WIDTH / 2, y: canvas.height - 20 };
const bricks = [];

for (let i = 0; i < BRICK_ROWS; i++) {
    bricks[i] = [];
    for (let j = 0; j < BRICK_COLS; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let gameActive = true;

// Draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let i = 0; i < BRICK_ROWS; i++) {
        for (let j = 0; j < BRICK_COLS; j++) {
            if (bricks[i][j].status === 1) {
                const brickX = j * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_X;
                const brickY = i * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_Y;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Collision detection
function collisionDetection() {
    for (let i = 0; i < BRICK_ROWS; i++) {
        for (let j = 0; j < BRICK_COLS; j++) {
            const b = bricks[i][j];
            if (b.status === 1 && ball.x > b.x && ball.x < b.x + BRICK_WIDTH && ball.y > b.y && ball.y < b.y + BRICK_HEIGHT) {
                ball.dy = -ball.dy;
                b.status = 0;
                updateScore();
            }
        }
    }
}

// Move ball
function moveBall() {
    if (!gameActive) return;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.dx > canvas.width - BALL_RADIUS || ball.x + ball.dx < BALL_RADIUS) ball.dx = -ball.dx;
    if (ball.y + ball.dy < BALL_RADIUS) ball.dy = -ball.dy;

    if (ball.y + ball.dy > canvas.height - BALL_RADIUS) {
        if (ball.x > paddle.x && ball.x < paddle.x + PADDLE_WIDTH) ball.dy = -ball.dy;
        else gameOver();
    }
}

// Game over
function gameOver() {
    gameActive = false;
    alert('Game Over!');
    document.location.reload();
}

// Update score
function updateScore() {
    score++;
    if (score === BRICK_ROWS * BRICK_COLS) {
        gameActive = false;
        alert('You Win!');
        document.location.reload();
    }
}

// Input handling
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    paddle.x = touchX - PADDLE_WIDTH / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + PADDLE_WIDTH > canvas.width) paddle.x = canvas.width - PADDLE_WIDTH;
});

// Render game
function draw() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    moveBall();
    collisionDetection();
    requestAnimationFrame(draw);
}

// Resize event handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ball.x = canvas.width / 2;
    paddle.x = canvas.width / 2 - PADDLE_WIDTH / 2;
    draw();
});

draw(); // Start the game loop