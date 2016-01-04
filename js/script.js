var game;
var REVERSES = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left'
};

$(function(){
	resize();
});

$( window ).resize(function() {
	resize();
}).keydown(function(e){
	!!game && game.processKeyPressed(e);
});

$('.startGameBtn').click(function () {
    var $inputs = $('input:text').filter(function() { return this.value !== ""; });
    var players = [];
    for (var i = 0, len = $inputs.length; i < len; i++) {
        var input = $inputs[i];
        players.push(input.value);
    }
	if (!$(this).hasClass('disabled')) {
        $('#gameStartDialog').fadeOut();
        initGame(players);
    }
});
$('.inputPlayer input').keyup(function () {
	var $inputs = $('input:text').filter(function() { return this.value !== ""; });
	if ($inputs.length > 1) {
		$('.startGameBtn').removeClass('disabled');
	} else {
		$('.startGameBtn').addClass('disabled');
	}
});
$('.okBtn').click(function () {
    $(this).closest('.gameWinner').fadeOut();
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

function initGame(players){
    !!game && game.destroy();
	game = new Game({
		players: players
	});
	game.start();
}