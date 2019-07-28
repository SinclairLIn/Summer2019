// 设定画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const para = document.querySelector('p');
const BALL_SPEED_MAX = 7;

// 设定画布长宽
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// 生成随机颜色的函数
function randomColor() {
    return 'rgb(' +
        random(0, 255) + ', ' +
        random(0, 255) + ', ' +
        random(0, 255) + ')';
}
//shape构造器
function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;
//生成小球构造器
function Ball(x, y, velX, velY, color, size, exists) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

function EvilCircle(x, y, velX, velY, exists) {
    Shape.call(this, x, y, 30, 30, exists);
    this.color = "white";
    this.size = 20;
}
EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
        this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y += this.size;
    }
}

EvilCircle.prototype.setControls = function() {
    window.onkeydown = e => {
        switch (e.key) {
            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.x -= this.velX;
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.x += this.velX;
                break;
            case 'w':
            case 'W':
            case 'ArrowUp':
                this.y -= this.velY;
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                this.y += this.velY;
                break;
        }
    };
}

EvilCircle.prototype.collisionDetect = function() {

    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                count--;
                para.textContent = '还剩 ' + count + ' 个球';
            }
        }
    }

}

//画出小球
Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

//碰撞检测
Ball.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = randomColor();
            }
        }
    }
}

//小球更新
Ball.prototype.update = function() {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;

    }
    //创建了一个小球数组
var balls = [];
const evilBall = new EvilCircle(
    random(0, width),
    random(0, height),
    true
);
let count = 0;
loop(); //调用这个方法 

//循环创建小球
function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    while (balls.length < 25) {
        var ball = new Ball(
            random(0, width),
            random(0, height),
            random(-7, 7),
            random(-7, 7),
            randomColor(),
            random(10, 20),
            true,
        );
        balls.push(ball);
        count++;
        para.textContent = '还剩 ' + count + ' 个球';
    }

    for (var i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    evilBall.draw();
    evilBall.checkBounds();
    evilBall.collisionDetect();
    evilBall.setControls();
    requestAnimationFrame(loop); //这个函数 用来每一帧调用loop函数 
}