var load = {
	preload: function (){
		game.load.image('player', 'img/player.png');
		game.load.image('ball', 'img/ball.png');
		game.load.image('enemy', 'img/enemy.png');
	},

	create: function (){
		game.state.start('menu');
	}
};
