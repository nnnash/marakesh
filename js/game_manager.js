function Game(properties) {
	var players = [],
		$playerDiv,
        carpetsNum = properties.players.length === 4 ? 12 : 15;
	for (var i = 0; i < properties.players.length; i++) {
		$playerDiv = $('.player').first();
		if (i > 0 ) {
			$playerDiv = $playerDiv.clone();
			$playerDiv.appendTo($('#players'));
		}
		players.push(new Player($playerDiv, i, properties.players[i], carpetsNum));
	}
	this.players = players;
	this.currentPlayer = -1;
	this.field = new Field();
	this.actionManager = new ActionEvents();
	this.actionManager.listenToOsama(this.field.osama);
}
Game.prototype.destroy = function(e) {
    $('.carpet, #osama').remove();
    $('.player:not(:first-child)').remove();
};
Game.prototype.processKeyPressed = function(e) {
	this.actionManager.keyPressed(e);
};
Game.prototype.start = function(){
	//смена игрока
	this.changePlayer();
	// выбор направления
	// бросание кубика
	// перемещение
	// оплата штрафа
	// выкладка ковра
};
Game.prototype.changePlayer = function() {
	if (this.currentPlayer === this.players.length - 1) this.currentPlayer = -1;
	this.currentPlayer++;
	if (!this.players[this.currentPlayer].choose()) {
		var winner = this.players[0],
            isDraw = false;
		for (var i = 1; i < this.players.length; i++) {
            var winnerPoints = winner.getOverallPoints(),
                thisPlayerPoints = this.players[i].getOverallPoints();
			if (thisPlayerPoints > winnerPoints) {
                winner = this.players[i];
                isDraw = false
            } else if (thisPlayerPoints === winnerPoints) {
                isDraw = true;
            }
		}
		this.endGame(winner, isDraw);
		return;
	}
	this.nextStep(this.chooseDirection);
};
Game.prototype.chooseDirection = function() {
	var self = this;
	var posDirs;
	this.actionManager.waitForAction({
		type: 'directionChoose'
	}, function(direction){
		self.field.turnOsama(direction);
		self.field.hideDirections();
		self.nextStep(self.rollTheDice);
	}, function(direction){
		return posDirs[direction];
		// return self.field.getOsamaPosibleDirections()[key.direction];
	}, function(){
		posDirs = self.field.getOsamaPosibleDirections();
		self.field.showPosibleDirections(posDirs);
	});
};
Game.prototype.rollTheDice = function() {
	var rnd = Math.random();
	rnd *= 4;
	rnd = Math.floor(rnd + 1);
	console.log(rnd);
	this.nextStep(this.moveOsama, [rnd]);
};
Game.prototype.moveOsama = function(steps) {
	var self = this;
	oneStep();
	function oneStep(){
		if (steps > 0) {
			self.field.moveOsama(oneStep);
			steps--;
		} else {
			self.nextStep(self.payPenalty);
		}
	}
};
Game.prototype.payPenalty = function() {
	this.field.payPenalty(this.players[this.currentPlayer]);
	this.nextStep(this.layCarpet);
};
Game.prototype.layCarpet = function() {
	this.field.getAvailableCells();
	this.field.hiliteAvailableCells();
	waitForAction.call(this, this.field, false);

	function waitForAction(field, isLast) {
		var self = this;
		this.actionManager.waitForAction({
			type: 'carpetLay'
		}, function(cell){
			if (isLast) {
				self.field.layCarpetHalf(cell, self.players[self.currentPlayer], true);
				self.nextStep(self.changePlayer);
			} else {
				self.field.layCarpetHalf(cell, self.players[self.currentPlayer], false);
				self.nextStep(waitForAction,[self.field, true]);
			}
			self.field.hideDirections();
		}, function(direction){
			return self.field.getNextCell(direction, isLast);
		}, function(){
			self.actionManager.listenToAvailableCells(this.field);
			// self.field.showPosibleCarpets();
		});
	}
};
Game.prototype.nextStep = function(func, args) {
	var self = this;
	setTimeout( function() {
		func.apply(self, args);
	});
};
Game.prototype.endGame = function(winner, isDraw) {
    var $dlg = $('#gameStartDialog'),
        $won = $dlg.find('.gameWinner');
    if (!isDraw) {
        $won.find('span').text(winner.name);
        $won.css('background', winner.color);
    } else {
        $won.find('span').text('Ничья!');
        $won.css('background', '#5E5EC0');
    }
    $dlg.fadeIn(function() {
        $won.slideDown();
    });
};
