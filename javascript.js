const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const keys = {};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('keydown', (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.size &&
           rect1.x + rect1.size > rect2.x &&
           rect1.y < rect2.y + rect2.size &&
           rect1.y + rect1.size > rect2.y;
}

class Square {
    constructor(x, y, size) {
        this.x = x; this.y = y; this.size = size;
        this.speedx = 0; this.speedy = 0;
    }
    update() {
        this.speedx = 0; this.speedy = 0;
        if (keys["ArrowRight"]) this.speedx = 4;
        else if (keys["ArrowLeft"]) this.speedx = -4;
        if (keys["ArrowUp"]) this.speedy = -4;
        else if (keys["ArrowDown"]) this.speedy = 4;
        this.x += this.speedx; this.y += this.speedy;
        
        // Wrap around screen edges
        if (this.x > canvas.width) this.x = -this.size;
        else if (this.x < -this.size) this.x = canvas.width;
        if (this.y > canvas.height) this.y = -this.size;
        else if (this.y < -this.size) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Enemy {
    constructor(y, size) {
        this.x = canvas.width;
        this.y = y;
        this.size = size;
    }
    update() { this.x -= 6; }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

const square = new Square(50, 50, 50);
let timer = 0;
let timer2 = 0;
let timer3 = 0;
let score = 0; 
let alive = true;
let enemyspawnrate = 60;
const enemies = [];

function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "black";
    ctx.font = "30px monospace";
    ctx.fillText("Score: " + score, 20, 50);

    if (alive) { 
        square.update();
        square.draw();

        timer++;
        timer2++;
        timer3++;

        if (timer % enemyspawnrate === 0) {
            const enemY = Math.random() * (canvas.height - 50);
            enemies.push(new Enemy(enemY, 50));
        }

        if (timer2 % 60 === 0) {
            score++;
        }

        if (timer3 % 300 === 0) {
            enemyspawnrate--;
            if (enemyspawnrate < 5) enemyspawnrate = 5;
        }
    } else {
        // Game Over Text
        ctx.fillStyle = "red";
        ctx.font = "60px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
        ctx.font = "30px monospace";
        ctx.fillText("Press F5 to Restart", canvas.width/2, canvas.height/2 + 50);
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        enemy.update();
        enemy.draw();

        if (alive && checkCollision(square, enemy)) {
            alive = false;
        }

        if (enemy.x < -enemy.size) {
            enemies.splice(i, 1);
        }
    }

    requestAnimationFrame(gameloop);
}

gameloop();
