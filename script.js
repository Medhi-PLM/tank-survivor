window.onload = function() {
  document.getElementById('start-button').onclick = function() {
  document.querySelector('.game-intro').style.display = 'none';
  document.querySelector('.game-board').style.display = 'block';
  document.querySelector('.score').style.display = 'block';
  startGame();
  };
};

var ctx;
var listOfPlayer = [];
var listOfOpponents = [];
var score = 0;
var increaseScore = 1;
var decreaseScore = 1;
var scoreEl = document.querySelector('.beatOpponent');
var healthPoint = document.querySelector('.saveMyLife');

function startGame () {
  ctx = document.getElementById('canvas').getContext('2d');
  listOfPlayer.push(player = new Tank(30,30,40,'#475534'));
  listOfOpponents.push(opponent = new Bomb(450,100,20, 0, Math.PI*2, true, 'red', 'black'));
  setInterval(updateEverything,1);

  document.onkeydown = function(e) {
    e.preventDefault();
    switch (e.keyCode) {
      case 37:
        listOfPlayer.forEach(function (element) {element.moveLeft();});
        break;
      case 39:
        listOfPlayer.forEach(function (element) {element.moveRight();});
        break;
      case 38:
        listOfPlayer.forEach(function (element) {element.moveTop();});
        break;
      case 40:
        listOfPlayer.forEach(function (element) {element.moveDown();});
        break;
      case 32: // Space bar
        listOfPlayer.forEach(function (element) {element.shoot();});
        break;
      case 74: // J
        listOfPlayer.forEach(function (element) {element.rotateGun(true);});
        break;
      case 75: // K
        listOfPlayer.forEach(function (element) {element.rotateGun(false);});
        break;
    }
    drawEverything();
  };
}

function updateEverything () {
  listOfPlayer.forEach(function (element) {element.update();});
  listOfOpponents.forEach(function (element) {element.update();});
  checkExplosion();
  opponentTouchMe();
  drawEverything();
}

function drawEverything () {
  ctx.clearRect(0, 0, 850, 550);
  listOfPlayer.forEach(function (element) {element.draw();});
  listOfOpponents.forEach(function (element) {element.draw();});
}

function levelManager () {

  var scoreUpdate = scoreEl.innerText;
  if (scoreUpdate==='1') {
    listOfPlayer[0];
    listOfOpponents.push(opponent1 = new Bomb(350,200,30, 0, Math.PI*2, true, 'orange', 'black'));
    listOfOpponents.push(opponent2 = new Bomb(250,300,40, 0, Math.PI*2, true, 'orange', 'black'));
    listOfOpponents.push(opponent3 = new Bomb(150,400,50, 0, Math.PI*2, true, 'orange', 'black'));
    setInterval(updateEverything,1);
    drawEverything();
  } else if (scoreUpdate<='4' && listOfOpponents.length===0) {
    listOfPlayer[0];
    listOfOpponents.push(opponent1 = new Bomb(350,200,20, 0, Math.PI*2, true, 'green', 'black'));
    listOfOpponents.push(opponent2 = new Bomb(250,300,30, 0, Math.PI*2, true, 'green', 'black'));
    listOfOpponents.push(opponent3 = new Bomb(150,400,30, 0, Math.PI*2, true, 'green', 'black'));
    listOfOpponents.push(opponent4 = new Bomb(250,500,40, 0, Math.PI*2, true, 'green', 'black'));
    listOfOpponents.push(opponent5 = new Bomb(150,600,40, 0, Math.PI*2, true, 'green', 'black'));
    setInterval(updateEverything,1);
    drawEverything();
  } else if ('4'<scoreUpdate && listOfOpponents.length===0) {
    listOfPlayer[0];
    listOfOpponents.push(opponent1 = new Bomb(350,200,30, 0, Math.PI*2, true, 'blue', 'black'));
    listOfOpponents.push(opponent2 = new Bomb(250,300,30, 0, Math.PI*2, true, 'blue', 'black'));
    listOfOpponents.push(opponent3 = new Bomb(150,400,40, 0, Math.PI*2, true, 'blue', 'black'));
    listOfOpponents.push(opponent4 = new Bomb(250,500,40, 0, Math.PI*2, true, 'blue', 'black'));
    listOfOpponents.push(opponent5 = new Bomb(150,600,50, 0, Math.PI*2, true, 'blue', 'black'));
    setInterval(updateEverything,1);
    drawEverything();
  } 
}

function checkExplosion () {
  for (var i = listOfPlayer[0].bullets.length-1; i >=0; i--) {
    var xBullet = listOfPlayer[0].bullets[i].x;
    var yBullet = listOfPlayer[0].bullets[i].y;
    for (var iOpponent = 0; iOpponent < listOfOpponents.length; iOpponent++) {
      var opponent = listOfOpponents[iOpponent];
      var distFromBullet = Math.sqrt(Math.pow(xBullet-opponent.x,2) + Math.pow(yBullet-opponent.y,2));
      if (distFromBullet < opponent.radius) {
        var destroy = opponent.hit();
        listOfPlayer[0].bullets.splice(i,1);
        if (destroy) {
          scoreEl.innerText = (score+= increaseScore);
          listOfOpponents.splice(iOpponent,1);
          levelManager();
        }
      }
    }
  }
}

function opponentTouchMe () {
  var xPlayer = listOfPlayer[0].x;
  var yPlayer = listOfPlayer[0].y;
  listOfOpponents.forEach(function (opponent) {
    var distFromTank = Math.sqrt(Math.pow(opponent.x-xPlayer,2) + Math.pow(opponent.y-yPlayer,2));
    if (distFromTank < listOfPlayer[0].width) {
      var blast = listOfPlayer[0].beat();
      listOfOpponents.splice(opponent,1);
      if (blast) {
        healthPoint.innerText = (parseInt(healthPoint.innerText -= decreaseScore));
        if (parseInt(healthPoint.innerText)===0) {
          listOfPlayer.pop();
        }
      }
    }
  });
}

function Tank (x,y,width,color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.color = color;
  this.bullets = [];
  this.gunAngle = 0;
  this.sum = 0;
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

Tank.prototype.rotateGun = function (isUp) {
  if (isUp) {this.gunAngle += 0.1;}
  else {this.gunAngle -= 0.1;}
};

Tank.prototype.getGun = function () {
  var xG1 = this.x + this.width/2;
  var yG1 = this.y + this.width/2;
  var xG2 = xG1 + this.width * Math.cos(this.gunAngle);
  var yG2 = yG1 + this.width * Math.sin(this.gunAngle);
  return  {
    xG1: xG1,
    yG1: yG1,
    xG2: xG2,
    yG2: yG2
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
  var bullet = new Bullet(this.getGun().xG2,this.getGun().yG2-5/2, Math.cos(this.gunAngle), Math.sin(this.gunAngle),  5,"#e57e09");
  this.bullets.push(bullet);
};

Tank.prototype.update = function () {
    for (var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].update();
  }
};

Tank.prototype.beat = function () {
  this.sum++;
  var impact;
  if (this.sum >= 1) {
    impact = true;
    return impact;
  } else {
    impact = false;
    return impact;
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
  var vectorX = listOfPlayer[0].getCenter().x - this.x;
  var vectorY = listOfPlayer[0].getCenter().y - this.y;
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
