var play = {
	create: function (){
		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		this.player.anchor.set(0.5);
		game.physics.enable(this.player, Phaser.Physics.ARCADE);

		this.lastShoot = 0;

		this.points = 0;

		this.textPoints = game.add.text(
			30,30,
			'Points: ' + this.points, {
				font: '1.5rem Sans-serif',
				fill: '#fff'
			});

		this.balls = game.add.group();
		this.balls.enableBody = true;
		this.balls.physicsBodyType = Phaser.Physics.ARCADE;
		this.balls.createMultiple(20, 'ball');
		this.balls.setAll('checkWorldBounds', true);
		this.balls.setAll('outOfBoundsKill', true);

		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemies.createMultiple(20, 'enemy');
		
		this.timeToCreateEnemy = Phaser.Timer.SECOND * 0.5;

		game.time.events.loop(this.timeToCreateEnemy, this.createEnemy, this);

		this.keys = game.input.keyboard.addKeys({
			'esc': Phaser.KeyCode.ESC
		});

		this.keys['esc'].onDown.add(this.pause, this);

		this.shoot();
	},

	update: function (){
		if (game.input.activePointer.isDown)
			this.shoot();

		this.player.rotation = game.physics.arcade.angleToPointer(this.player);

		game.physics.arcade.collide(this.player, this.enemies, this.over, null, this);
		game.physics.arcade.collide(this.balls, this.enemies, this.destroyEnemy, null, this);
	},

	over: function (){
		this.player.kill();
		this.balls.removeAll();
		this.enemies.removeAll();

		game.state.start('over');
	},

	createEnemy: function (){
		this.timeToCreateEnemy -= 10;

		let enemy = this.enemies.getFirstExists(false);
		enemy.revive();

		let side = game.rnd.integerInRange(1, 4);
		// 1 = up, 2 = right, 3 = down, 4 = left
		
		let randomX;
		let randomY;

		if (side == 1){
			enemy.anchor.set(0.5, 1);

			randomX = game.rnd.integerInRange(0, game.world.width);
			randomY = 0;
		}
		else if (side == 2){
			enemy.anchor.set(0, 0.5);
			
			randomX = game.world.width;
			randomY = game.rnd.integerInRange(0, game.world.height);
		}
		else if (side == 3){
			enemy.anchor.set(0.5, 0);
			
			randomX = game.rnd.integerInRange(0, game.world.width);
			randomY = game.world.height;
		}
		else if (side == 4){
			enemy.anchor.set(1, 0.5);
			
			randomX = 0;
			randomY = game.rnd.integerInRange(0, game.world.width);
		}

		enemy.reset(randomX, randomY);

		enemy.rotation = - game.math.degToRad(90) + game.physics.arcade.angleBetweenCenters(this.player, enemy);
		game.physics.arcade.moveToObject(enemy, this.player, 200);
	},

	shoot: function (){
		if (game.time.now - this.lastShoot > 200){
			this.lastShoot = game.time.now;

			let ball = this.balls.getFirstExists(false);
			ball.revive();
			ball.reset(this.player.x, this.player.y);

			ball.rotation = game.physics.arcade.angleToPointer(ball);

			game.physics.arcade.moveToPointer(ball, 500);
		}
	},

	destroyEnemy: function (ball, enemy){
		this.points++;
		this.textPoints.text = 'Points: ' + this.points;
		// kill enemy
		ball.kill();
		enemy.kill(); 
	},

	pause: function (){
		game.paused = !game.paused;
	}
};
