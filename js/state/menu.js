var menu = {
	preload: function (){},

	create: function (){
		this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
		this.player.anchor.set(0.5);

		let title = game.add.text(
			game.world.centerX,
			game.world.centerY - 100,
			'Hit balls', {
				font: '2rem Sans-serif',
				fill: '#fff',
			});
		title.anchor.set(0.5);

		let how = game.add.text(
			game.world.centerX,
			game.world.centerY + 100,
			'Cliquea para disparar', {
				font: '1.2rem Sans-serif',
				fill: '#fff'
			});
		how.anchor.set(0.5);
	},

	update: function (){
		if (game.input.activePointer.isDown){
			game.state.start('play');
		}
	}
};
