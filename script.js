window.onload = function() {
  document.getElementById('start-button').onclick = function() {
  document.querySelector('.game-intro').style.display = 'none';
  document.querySelector('.game-board').style.display = 'block';
  document.querySelector('.score').style.display = 'block';
  startGame();
  };
};

//Modifier Opponent pour en faire un tableau
//Différent type d'opponent avec des propriétés et tailles différentes

var ctx;
var player;
var listOfOpponent = [];
var opponent;
var score = 0;
var scoreEl = document.querySelector('.beatOpponent');
var healthPoint = document.querySelector('.saveMyLife');

function startGame () {
  ctx = document.getElementById('canvas').getContext('2d');
  player = new Tank(30,30,40,'#475534');
  opponent = new Bomb(450,100,20, 0, Math.PI*2, true, 'red', 'black');
  setInterval(updateEverything,1);


  document.onkeydown = function(e) {
    e.preventDefault();
    switch (e.keyCode) {
      case 37:
        player.moveLeft();
        drawEverything();
        break;
      case 39:
        player.moveRight();
        drawEverything();
        break;
      case 38:
        player.moveTop();
        drawEverything();
        break;
      case 40:
        player.moveDown();
        drawEverything();
        break;
      case 32:
        player.shoot();
        drawEverything();
    }
  };
}

function updateEverything () {
  player.update();
  opponent.update();
  checkExplosion();
  drawEverything();
}

function drawEverything () {
  ctx.clearRect(0, 0, 850, 550);
  player.draw();
  opponent.draw();
}

//Bullets touch Bomb
function checkExplosion () {
  for (var i = player.bullets.length-1; i >=0; i--) {
    var xBullet = player.bullets[i].x;
    var yBullet = player.bullets[i].y;
    var distFromBullet = Math.sqrt(Math.pow(xBullet-opponent.x,2) + Math.pow(yBullet-opponent.y,2));
    if (distFromBullet < opponent.radius) {
      var destroy = opponent.hit();
      player.bullets.splice(i,1);
      if (destroy) {
        score++;
        beatOpponent();
      }
    }
  }
}

//Opponent shut down
//Modifier le code pour faire disparaître totalement Bomb
function beatOpponent () {
  opponent = new Bomb(0,0,0, 0, Math.PI*2, true, 'red', 'black');
}

//Opponent touch me
//Fonctions à développer
function opponentTouchMe () {

}

function Tank (x,y,width,color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.color = color;
  this.bullets = [];
}

Tank.prototype.moveLeft = function () {
  if (this.x > 0) {this.x -= 10;}
};

Tank.prototype.moveRight = function () {
  if (this.x < 740) {this.x += 10;}
};

Tank.prototype.moveTop = function () {
  if (this.y > 0) {this.y -= 10;}
};

Tank.prototype.moveDown = function () {
  if (this.y < 510) {this.y += 10;}
};

Tank.prototype.getGun = function () {
  return  {
    xG1: this.x + this.width/2,
    yG1: this.y + this.width/2,
    xG2: this.x + 3*this.width/2,
    yG2: this.y + this.width/2
  };
};

Tank.prototype.getCenter = function () {
  return  {
    x: this.x + this.width/2,
    y: this.y + this.width/2,
  };
};

Tank.prototype.draw = function () {
  this.gun = this.getGun();

  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.width);

  ctx.strokeStyle = '#252d19';
  ctx.lineWidth = this.width / 10;
  ctx.beginPath();
  ctx.moveTo(this.gun.xG1, this.gun.yG1);
  ctx.lineTo(this.gun.xG2, this.gun.yG2);
  ctx.stroke();

  for (var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].draw();
  }
};

Tank.prototype.shoot = function () {
  var bullet = new Bullet(this.getGun().xG2,this.getGun().yG2-5/2, 1, 0,  5,"#e57e09");
  this.bullets.push(bullet);
};

Tank.prototype.update = function () {
    for (var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].update();
  }
};

function Bullet (x,y,vx,vy,width,color) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.width = width;
  this.color = color;
}

Bullet.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.width);
  ctx.moveTo(this.x, this.y);
};

Bullet.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;
};

function Bomb (x, y, radius, startAngle, endAngle, anticlockwise, color, stroke) {
  ctx.beginPath();
  this.x = x;
  this.y =  y;
  this.radius = radius;
  this.startAngle = 0;
  this.endAngle = Math.PI*2;
  this.anticlockwise = true;
  this.color = color;
  this.stroke = stroke;
  this.counter = 0;
}

Bomb.prototype.draw = function () {
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.stroke;
  ctx.moveTo(this.x, this.y);
  ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise, this.color);
  ctx.stroke();
  ctx.fill();
};

Bomb.prototype.update = function () {
  var distToTravel = 0.2;
  var vectorX = player.getCenter().x - this.x;
  var vectorY = player.getCenter().y - this.y;
  var vectorLength = Math.sqrt(Math.pow(vectorX,2) + Math.pow(vectorY,2));
  this.x += distToTravel*vectorX/vectorLength;
  this.y += distToTravel*vectorY/vectorLength;
};

Bomb.prototype.hit = function () {
  this.counter++;
  var destroy;
  if (this.counter >= 3) {
    destroy = true;
    return destroy;
  } else {
    destroy = false;
    return destroy;
  }
};
