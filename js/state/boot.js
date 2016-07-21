var boot = {
	preload: function (){
		game.load.image('loading.png', 'img/loading.png');
		game.load.image('loading2.png', 'img/loading2.png');
	},
	
	create: function (){
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;

		game.stage.backgroundColor = '#212121';
		game.world.enableBody = true;

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('load');
	}
};
