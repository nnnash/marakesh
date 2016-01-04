function Game(properties) {
	var players = [];
	for (var i = 0; i < properties.playerNumber; i++) {
		players.push(new Player($('.player:nth-child(' + (i + 1) + ')'), i));
		$('.player:nth-child(' + (i + 1) + ')');
	}
	this.players = players;
	this.currentPlayer = -1;
	this.field = new Field();
	// this.osama = new Osama($('.line:nth-child(4)>.cell:nth-child(4)'));
	this.actionManager = new ActionEvents();
	this.actionManager.listenToOsama(this.field.osama);
}
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
}
Game.prototype.changePlayer = function() {
	if (this.currentPlayer === this.players.length - 1) this.currentPlayer = -1;
	this.currentPlayer++;
	if (!this.players[this.currentPlayer].choose()) {
		var winner = this.players[0];
		for (var i = 1; i < this.players.length; i++) {
			if (this.players[i].getOverallPoints() > winner.getOverallPoints()) winner = this.players[i];
		};
		alert ('победил ' + winner.name);
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
}
