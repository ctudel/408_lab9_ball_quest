// ball counter and rounds

const header = document.querySelector("h1");
const rounds = document.querySelector("#rounds");
const counter = document.querySelector("#counter");
let count = 0; // num of current balls

// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// TODO: Create new Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// TODO: Derive from Shape class
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size, exists) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    // Doesn't draw unless it still exists
    if (this.exists) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this.exists && !(this === ball)) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "rgb(255, 255, 255)";
    this.size = 10;

    // Listens for certain keys
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.velX;
    }

    if (this.x - this.size <= 0) {
      this.x += this.velX;
    }

    if (this.y + this.size >= height) {
      this.y -= this.velY;
    }

    if (this.y - this.size <= 0) {
      this.y += this.velY;
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      // TODO: check ball exists
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // TODO: update ball exists property upon collision
        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          counter.innerHTML = `Ball count: ${count}`;
        }
      }
    }
  }
}

const evilCircle = new EvilCircle(innerWidth / 2, innerHeight / 2); // evil player
let numBalls = 2; // num balls on the canvas
let balls = []; // balls on the canvas
let animation; // animation status
let round = 1; // game round
let countdown = 3; // countdown after each round


// Creates given number of balls
function createBalls(numBalls) {
  while (balls.length < numBalls) {
    const size = random(10, 20);
    const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    );

    balls.push(ball);

    // Record and update ball count
    count = numBalls; // live ball count
    counter.innerHTML = `Ball count: ${count}`;
  }

  return true;
}


// Next Round function
function startNextRound() {
  // Start countdown
  if (countdown > 0) {
    header.innerHTML = `Congratulations!! Prepare for the next round: ${countdown}`;
    countdown--;
    setTimeout(startNextRound, 1000);

    // Update content for next round
  } else {
    balls = []; // reset ball list
    numBalls = Math.ceil(numBalls * 1.5); // make round slightly harder
    createBalls(numBalls);

    // Update countdown and rounds
    countdown = 3;
    header.innerHTML = "bouncing balls";
    rounds.innerHTML = `Round: ${++round}` // update round

    // Restart the animation
    startAnimation();
  }
}


// Animation function
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  // When all balls are eaten, go to the next round
  if (count < 1) {
    stopAnimation();
    startNextRound();

  } else {
    animation = requestAnimationFrame(loop);
  }
}


// Starts animation
function startAnimation() {
  animation = requestAnimationFrame(loop);
}


// Stops animation
function stopAnimation() {
  cancelAnimationFrame(animation);
}



// ===================
// Program starts here
// ===================

createBalls(numBalls); // create initial balls
startAnimation();
