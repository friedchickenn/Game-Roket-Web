class GameObject {
    constructor(x, y, width, height, imageSrc) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.image = new Image();
      this.image.src = imageSrc;
    }

    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }


    get position() {
      return { x: this.x, y: this.y };
    }

    set position({ x, y }) {
      this.x = x;
      this.y = y;
    }
  }
  
  class Player extends GameObject {
    constructor(x, y) {
      super(x, y, 80, 80, 'roket.png'); 
      this.speed = 7;
      this.score = 0;
    }

    move(direction) {
      if (direction === "left") this.x -= this.speed;
      if (direction === "right") this.x += this.speed;
      if (direction === "up") this.y -= this.speed;
      if (direction === "down") this.y += this.speed;
    }
  }

  class Star extends GameObject {
    constructor(x, y) {
      super(x, y, 40, 40, 'bintang.png');
    }
  }


  class Obstacle extends GameObject {
    constructor(x, y) {
      super(x, y, 60, 60, 'asteroid.png');
    }

    move(speed) {
      this.y += speed;
    }
  }

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const player = new Player(470, 500);
  const stars = [
    new Star(100, 100),
    new Star(300, 50),
    new Star(600, 200),
  ];
  const obstacles = [
    new Obstacle(200, 0),
    new Obstacle(400, -100),
    new Obstacle(600, -200),
  ];

  let isGameOver = false;
  let animationFrameId;

  function startGame() {
    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";
    gameLoop();
  }

  function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    player.score = 0;
    player.position = { x: 470, y: 500 };
    stars.splice(0, stars.length, new Star(100, 100), new Star(300, 50), new Star(600, 200));
    obstacles.splice(0, obstacles.length, new Obstacle(200, 0), new Obstacle(400, -100), new Obstacle(600, -200));
    isGameOver = false;
    canvas.style.display = "block";
    gameLoop();
  }


  function addNewStar() {
    const x = Math.random() * (canvas.width - 40);
    const y = Math.random() * (canvas.height - 40);
    stars.push(new Star(x, y));
  }
  setInterval(addNewStar, 5000); 

  let isMouseDown = false;


  canvas.addEventListener("mousedown", (e) => {
    if (e.button === 0) { 
      isMouseDown = true;
      movePlayerToCursor(e);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
      isMouseDown = false;
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      movePlayerToCursor(e);
    }
  });

  function movePlayerToCursor(e) {
    const rect = canvas.getBoundingClientRect();
    player.position = {
      x: e.clientX - rect.left - player.width / 2,
      y: e.clientY - rect.top - player.height / 2
    };
  }

 
  function gameLoop() {
    if (isGameOver) {
      cancelAnimationFrame(animationFrameId);
      document.getElementById("finalScore").textContent = `Your Score: ${player.score}`;
      document.getElementById("gameOverScreen").style.display = "block";
      canvas.style.display = "none";
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw(ctx);

    
    stars.forEach((star, index) => {
      star.draw(ctx);
      if (
        player.x < star.x + star.width &&
        player.x + player.width > star.x &&
        player.y < star.y + star.height &&
        player.y + player.height > star.y
      ) {
        stars.splice(index, 1);
        player.score += 10;
        addNewStar(); 
      }
    });
   
    obstacles.forEach((obstacle) => {
      obstacle.draw(ctx);
      obstacle.move(5);
     
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
      ) {
        isGameOver = true;
      }

      if (obstacle.y > canvas.height) {
        obstacle.position = { x: Math.random() * (canvas.width - obstacle.width), y: -50 };
      }
    });

    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${player.score}`, 10, 20);

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.move("left");
    if (e.key === "ArrowRight") player.move("right");
    if (e.key === "ArrowUp") player.move("up");
    if (e.key === "ArrowDown") player.move("down");
  });