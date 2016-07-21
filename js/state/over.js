var over = {
	create: function (){
		this.points = game.add.text(
			game.world.centerX,
			game.world.centerY,
			'Points: ' + play.points,{
				font: '2rem Sans-serif',
				fill: '#fff'
			});
		this.points.anchor.set(0.5, 0.5);

		this.again = game.add.text(
			game.world.centerX,
			game.world.centerY + 30,
			'Pulsa enter para volver a jugar',{
				font: '1.2rem Sans-serif',
				fill: '#fff'
			});
		this.again.anchor.set(0.5, 0.5);

		this.keys = game.input.keyboard.addKeys({
			'restart': Phaser.Keyboard.ENTER
		});
	},

	update: function (){
		if (this.keys['restart'].isDown){
			game.state.start('menu');
		}
	}
};
