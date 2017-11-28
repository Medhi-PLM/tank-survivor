window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };
};

var ctx;
var player;
var opponent;

function startGame () {
  ctx = document.getElementById('canvas').getContext('2d');
  player = new Tank(30,30,40,'#475534');
  opponent = new Bomb(450,100,20, 0, Math.PI*2, true, 'red', 'black');
  bullet = new Bullet(350,100,4,"#e57e09");
  setInterval(drawEverything,1000);

  document.onkeydown = function(e) {
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
    }
  };

}

function drawEverything () {
  ctx.clearRect(0, 0, 500, 500);
  player.draw();
  opponent.draw();
  bullet.draw();
}


function Tank (x,y,width,color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.color = color;
}

Tank.prototype.moveLeft = function () {
  if (this.x > 0) {this.x -= 10;};
};

Tank.prototype.moveRight = function () {
  if (this.x < 440) {this.x += 10;};
};

Tank.prototype.moveTop = function () {
  if (this.y > 0) {this.y -= 10;};
};

Tank.prototype.moveDown = function () {
  if (this.y < 310) {this.y += 10;};
};

Tank.prototype.draw = function () {
  this.gun = {
    xG1: this.x + this.width/2,
    yG1: this.y + this.width/2,
    xG2: this.x + 3*this.width/2,
    yG2: this.y + this.width/2
  };

  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.width);

  ctx.strokeStyle = '#252d19';
  ctx.lineWidth = this.width / 10;
  ctx.beginPath();
  ctx.moveTo(this.gun.xG1, this.gun.yG1);
  ctx.lineTo(this.gun.xG2, this.gun.yG2);
  ctx.stroke();
};

function Shootbullet () {
  $(window).keypress(function(e) {
    if (e.which === 32) {
	     console.log('Hi');
    }
  });
}

function Bullet (x,y,width,color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.color = color;
}

Bullet.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.width);
  ctx.moveTo(this.x, this.y);
}


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
}

Bomb.prototype.draw = function () {
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.stroke;
  ctx.moveTo(this.x, this.y);
  ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise, this.color);
  ctx.stroke();
  ctx.fill();
};
