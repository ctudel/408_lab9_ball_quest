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
    // TODO: Define new property to track if evil ball hasn't eaten it
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
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
      // TODO: Only consider for collision detect if ball exists
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

// TODO: Create an EvilCircle class inheriting Shape
export default class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    // TODO: set color to white and size to 10
    this.color = "rgb(255, 255, 255)";
    this.size = 10;

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


  // TODO: Create draw method
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    console.log("x:" + this.x);
    console.log("y:" + this.y);
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // TODO: Create checkBounds method
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.velX;
      console.log("passed");
    }

    if (this.x - this.size <= 0) {
      this.x += this.velX;
      console.log("passed");
    }

    if (this.y + this.size >= height) {
      this.y -= this.velY;
      console.log("passed");
    }

    if (this.y - this.size <= 0) {
      this.y += this.velY;
      console.log("passed");
    }
  }

  // TODO: Create collisionDetect method
  collisionDetect() {
    for (const ball of balls) {
      // TODO: check ball exists
      if (ball.exists) {
        console.log("ball exists");
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // TODO: update ball exists property upon collision
        if (distance < this.size + ball.size) {
          ball.exists = false;
          console.log(ball.exists);
        }
      }
    }
  }
}


const balls = [];
const evilCircle = new EvilCircle(innerWidth / 2, innerHeight / 2);

while (balls.length < 25) {
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
}

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


  requestAnimationFrame(loop);
}

loop();
