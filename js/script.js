var game;
var REVERSES = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left'
}

$(function(){
	resize();
	initGame();
})

$( window ).resize(function() {
	resize();
}).keydown(function(e){
	game.processKeyPressed(e);
});

function resize(){
	var fieldWrap = $('#fieldWrap');
	var field = $('#field');
	if(fieldWrap.width() > fieldWrap.height()) {
		field.css('height', fieldWrap.outerHeight() * 0.78);
		field.css('width', field.outerHeight());
	} else {
		field.css('width', fieldWrap.outerWidth() * 0.78);
		field.css('height', field.outerWidth());
	}
}

function initGame(){
	game = new Game({
		playerNumber: 4
	});
	game.start();
}