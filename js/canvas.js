/*jslint browser:true*/
/*global $ */

// ------------------------> Variables <-------------------------

var canvas = null;
var ctx = null;

var player = null;
var listBalls = [];
var listEnemies = [];
var escene = 1;
var points = 0;
var timeEnemy = 1000;
var timerEnemy;

var clickState;
var lastShoot = 0;
var timeNow = new Date().getTime();

// Classes
var Sprite;

// Main functions
var init, events, update, render, reset;

// Functions
var clearCanvas, drawTitle, drawPoints, drawGameOver, createEnemy, createBall, collision;

// ------------------------> Classes <------------------------------

Sprite = function (x,y,src) {
	this.x = x || 0;
	this.y = y || 0;
	this.img = new Image();
	this.img.src = src || '';
	this.width = this.img.width;
	this.height = this.img.height;
	this.velocity = {x: 0,y: 0};
	this.rotation = null;
	this.pos = 0;
};

Sprite.prototype.draw = function (ctx) {
	if (this.rotation !== null) {
		ctx.save();
		ctx.translate(this.x,this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.img,-this.width/2,-this.height/2);
		ctx.restore();
	}
	
	else {
		ctx.drawImage(this.img,this.x - this.width/2,this.y - this.width/2);
	}
};

Sprite.prototype.update = function () {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
};

// Main functions

init = function (){
	canvas = document.getElementById('gameDiv');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext('2d');

	player = new Sprite(canvas.width/2,canvas.height/2,'img/player.png');
	player.width = 100;
	player.height = 100;

	events();
	update();
	render();
};

events = function (){
	document.addEventListener('mousedown', function (evt){
		if(escene === 1){
			escene = 2;
			createEnemy();
			createBall();
		}

		else if (escene === 2) {
			clickState = evt;
			console.log(evt.offsetX);
		}

		else if (escene === 3) {
			reset();
		}
	});
	
	document.addEventListener('mouseup', function (){
		clickState = null;
	});

	document.addEventListener('mousemove', function (evt){
		if (escene === 2 && clickState) {
			clickState = evt;
		}
	});
};

update = function (){
	// Escene 2 
	
	if (escene === 2){
		// Events
		timeNow = new Date().getTime();

		if (clickState && timeNow - lastShoot >= 200){
			createBall();
			lastShoot = timeNow;
		}

		listEnemies.forEach(function (enemy) {
			enemy.update();
		});

		listBalls.forEach(function (ball) {
			ball.update();
		});

		listEnemies.forEach(function (enemy, enemyIndex) {
			listBalls.forEach(function (ball, ballIndex) {
				if (collision(enemy,ball)) {
					listBalls.splice(ballIndex, 1);
					listEnemies.splice(enemyIndex, 1);
					points++;
				}
			});

			if (collision(enemy,player)) {
				clearTimeout(timerEnemy);
				listBalls.splice(0,listBalls.length);
				listEnemies.splice(0,listEnemies.length);
				escene = 3;
			}
		});
	}

	if (document.hidden){
		window.requestAnimationFrame(update);
	}else {
		setTimeout(update, 1000/60);
	}
};

render = function (){
	// Escene 1, intro
	if (escene === 1){
		clearCanvas(ctx);
		drawTitle(ctx);
		drawPoints(ctx);
		player.draw(ctx);
	}

	// Escene 2, playing
	else if (escene === 2){
		clearCanvas(ctx);
		player.draw(ctx); // Dibujo al jugador
		drawPoints(ctx);

		listEnemies.forEach(function (enemy) {
			enemy.draw(ctx);
		});

		listBalls.forEach(function (ball) {
			ball.draw(ctx);
		});
	}

	// Escene 3, game over
	else if (escene === 3){
		clearCanvas(ctx);
		drawGameOver(ctx);
	}

	window.requestAnimationFrame(render);	
};

reset = function (){
	listBalls = [];
	listEnemies = [];
	escene = 1;
	points = 0;
};

// ---------------------> Functions <-----------------------

// Converts from degrees to radians.
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians){
	return radians * 180 / Math.PI;
};

clearCanvas = function (ctx) {
	ctx.clearRect(0,0,canvas.width, canvas.height);
};

drawTitle = function (ctx) {
	ctx.beginPath();
	ctx.fillStyle = '#fff';
	ctx.textAlign = 'center';
	ctx.font = '2.4rem sans-serif';
	ctx.fillText('Hit Balls', canvas.width/2,canvas.height/2 - 100);
	
	ctx.font = '1.2rem sans-serif';
	ctx.fillText('Cliquea para disparar', canvas.width/2,canvas.height/2 - 70);

	ctx.closePath();
};

drawPoints = function (ctx) {
	ctx.beginPath();
	ctx.fillStyle = '#fff';
	ctx.font = '1.7rem sans-serif';
	ctx.fillText('Puntaje: ' + points, 100,50);
	ctx.closePath();
};

drawGameOver = function (ctx){
	ctx.beginPath();
	ctx.fillStyle = '#fff';
	ctx.textAlign = 'center';
	ctx.font = '2.5rem sans-serif';
	ctx.fillText('Game Over', canvas.width/2, canvas.height/2-20);
	ctx.fillStyle = '#fff';
	ctx.textAlign = 'center';
	ctx.font = '1.5rem sans-serif';
	ctx.fillText('Puntaje: ' + points, canvas.width/2, canvas.height/2+20);
	ctx.closePath();
};

collision = function (a,b) {
	if (a.x-a.width/2 < b.x-b.width/2 + b.width && a.x-a.width/2 + a.width > b.x-b.width/2 &&
		a.y-a.height/2 < b.y-b.height/2 + b.height && a.y-a.width/2 + a.height > b.y-b.height/2){
		return true;
	}
};

createBall = function () {
	// Añadir una bola nueva a una lista que contiene todas las bolas,
	// luego cada elemento de la lista se actualiza
	// cada elemento con sus propios ejes (X,Y)
	var newBall = new Sprite(canvas.width/2,canvas.height/2,'img/ball.png');
	newBall.velocity.x = 5;
	newBall.velocity.y = 5;

	var ad = clickState.offsetX - canvas.width/2; // ancho desde el centro hasta el mouseX
	var op = clickState.offsetY - canvas.height/2; // altura desde el centro hasta el mouseY
	var hy = Math.hypot(ad,op);
   var co = ad/hy;
   var si = op/hy;

	newBall.velocity.x = co * newBall.velocity.x;
	newBall.velocity.y = si * newBall.velocity.y;

	listBalls.push(newBall);
};

createEnemy = function () {
	var newEnemy = new Sprite(0,0,'img/enemy.png');
	newEnemy.velocity.x = 3;
	newEnemy.velocity.y = 3;
	var randomSide = Math.floor(Math.random()*4);

	if (randomSide === 0) {
		newEnemy.x = Math.random()*canvas.width;
		newEnemy.y = -newEnemy.height;
	} 

	else if (randomSide === 1) {
		newEnemy.x = canvas.width + newEnemy.width;
		newEnemy.y = Math.random()*canvas.height;
	}

	else if (randomSide === 2) {
		newEnemy.x = Math.random()*canvas.width;
		newEnemy.y = canvas.height + newEnemy.height; 
	}

	else if (randomSide === 3) {
		newEnemy.x = -newEnemy.width;
		newEnemy.y = Math.random()*canvas.height;
	}
	
	var tox = canvas.width/2;
	var toy = canvas.height/2;

	var ad = newEnemy.x - tox; // ancho
   var op = newEnemy.y - toy; // altura
   var hy = Math.hypot(ad,op);
   var co = ad/hy;
   var si = op/hy;
   var angTan = Math.degrees(Math.atan2(op,ad));

   newEnemy.rotation = Math.radians(angTan - 90);

   newEnemy.velocity.x = -(co * newEnemy.velocity.x);
	newEnemy.velocity.y = -(si * newEnemy.velocity.y);

	if (document.hidden){
		window.requestAnimationFrame(createEnemy);
	}else {
		timerEnemy = setTimeout(createEnemy, timeEnemy);
	}

	listEnemies.push(newEnemy);
};

$(document).ready(init);
