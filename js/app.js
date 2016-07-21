var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);

game.state.add('boot', boot);
game.state.add('load', load);
game.state.add('menu', menu);
game.state.add('play', play);
game.state.add('over', over);

game.state.start('boot');
