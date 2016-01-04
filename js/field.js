function Field() {
	this.osama = new Osama($('.line:nth-child(4)>.cell:nth-child(4)'));
	this.availableCells;
	this.carpets = [];
	this.coveredCells = {};
	this.lastCarpetId = 0;
	for (var i = 1; i <= 7; i++) {
		for (var j = 0; j <= 7; j++) {
			this.getCell(i, j).attr('id', 'cell-' + i + '_' + j);
		};
	};
}

Field.prototype.getCell = function(x, y) {
	return $('.line:nth-child(' + y + ')>.cell:nth-child(' + x +')');
}

Field.prototype.getAvailableCells = function() {
	var x = this.osama.x;
	var y = this.osama.y;
	var cells = [];
	for (var i = x-2; i <= x+2; i++) {
		if (i < 1 || i > 7) continue;
		switch(i) {
			case x-2:
			case x+2:
				cells.push({x: i, y: y});
				break;
			case x-1:
			case x+1:
				for (var j = y-1; j <= y+1; j++) {
					if (j < 1 || j > 7 ) continue;
					cells.push({x: i, y: j});
				}
				break;
			case x:
				for (var j = y-2; j <= y+2; j++) {
					if (j < 1 || j > 7 || j === y) continue;
					cells.push({x: i, y: j});
				}
				break;
		}
	}
	var self = this;
	cells = cells.filter(function(item, i, cells){
		var thisCoveredCell = self.getCoveredCell(item.x, item.y)
		if (!thisCoveredCell) return true;
		var adjucentCells = self.getAdjucentCells(item.x, item.y);
		adjucentCells = adjucentCells.filter(function(adjCell){
			if (adjCell.x < 1 || adjCell.x > 7 || adjCell.y < 0 || adjCell.y > 7) return false;
			for (var i = 0; i < cells.length; i++) {
				if (cells[i].x === adjCell.x && cells[i].y === adjCell.y) {
					return true;
				}
			};
			return false;
		});
		if (adjucentCells.length > 1) return true;
		if (adjucentCells.length === 0) return false;
		if (adjucentCells.length === 1) {
			var adjCoveredCell = self.getCoveredCell(adjucentCells[0].x, adjucentCells[0].y);
			if (!adjCoveredCell) return true;
			if (thisCoveredCell.carpet === adjCoveredCell.carpet) return false;
			return true;
		}
	})
	this.availableCells = cells;
};

Field.prototype.hiliteAvailableCells = function() {
	var self = this;
	this.availableCells.forEach(function(item){
		self.getCell(item.x, item.y).addClass('available');
	});
};
Field.prototype.getNextCell = function(direction, isLast, player) {
	var x = isLast? this.firstHalf.x : this.osama.x;
	var y = isLast? this.firstHalf.y : this.osama.y;
	var cells = this.availableCells;
	switch(direction) {
		case 'up':
			y--;
			break;
		case 'down':
			y++;
			break;
		case 'left':
			x--;
			break;
		case 'right':
			x++;
			break;
	}
	var cell;
	for (var i = 0; i < cells.length; i++) {
		if (cells[i].x === x && cells[i].y ===y) {
			cell = cells[i];
			break;
		}
	}
	if (isLast && cell) this.lastKeyMove = direction;
	return cell;
};
Field.prototype.layCarpetHalf = function(cell, player, isLast) {
	$('.cell.available').removeClass('available');
	var coveredCell = this.getCoveredCell(cell.x, cell.y)
	if (coveredCell) {
		coveredCell.player.changeLayedCarpetPoints(false);
	}
	player.changeLayedCarpetPoints(true);
	if (!isLast) {
		this.getAvailableSecondHalf(cell);
		this.hiliteAvailableCells();
	}
	this.fillCell(cell, player, isLast);
	if (!isLast) {
		this.firstHalf = cell;
	} else {
		delete this.firstHalf;
		delete this.lastKeyMove;
		player.reduceCarpets();
	}
};
Field.prototype.fillCell = function(cell, player, isLast) {
	if (!this.coveredCells[cell.x]) this.coveredCells[cell.x] = {};
	this.coveredCells[cell.x][cell.y] = {
		player: player,
		carpet: this.getCarpetId()
	}
	var lastHalf = this.getCell(cell.x, cell.y);
	// lastHalf.append($('<div></div>').addClass('playerCarpet' + player.id).addClass('carpet'));
	lastHalf.append($('<div></div>').css('background-color', player.color).addClass('carpet playerCarpet' + player.id).append($('<div></div>')));
	if (isLast) {
		if (!this.lastKeyMove) {
			if(this.firstHalf.x < cell.x) this.lastKeyMove = 'right';
			if(this.firstHalf.x > cell.x) this.lastKeyMove = 'left';
			if(this.firstHalf.y < cell.y) this.lastKeyMove = 'down';
			if(this.firstHalf.y > cell.y) this.lastKeyMove = 'up';
		}
		lastHalf.children('.carpet:last-child').addClass('carpet-' + this.lastKeyMove);
		var firstCell = this.getCell(this.firstHalf.x, this.firstHalf.y);
		firstCell.children('.carpet:last-child').addClass('carpet-' + REVERSES[this.lastKeyMove]);
	}
};
Field.prototype.getCoveredCell = function(x, y) {
	if (!this.coveredCells[x]) return null;
	return this.coveredCells[x][y];
};
Field.prototype.getCarpetId = function() {
	if (this.firstHalf) {
		return this.lastCarpetId++;
	} else {
		return this.lastCarpetId;
	}
};
Field.prototype.getAvailableSecondHalf = function(cell) {
	var x = cell.x;
	var y = cell.y;
	// var adjucentCells = this.getAdjucentCells(cell.x, cell.y);
	// var cells = this.availableCells;
	// adjucentCells = adjucentCells.filter(function(adjCell){
	// 	if (adjCell.x < 1 || adjCell.x > 7 || adjCell.y < 0 || adjCell.y > 7) return false;
	// 	for (var i = 0; i < cells.length; i++) {
	// 		if (cells[i].x === adjCell.x && cells[i].y === adjCell.y) {
	// 			return true;
	// 		}
	// 	};
	// 	return false;
	// });
	var adjucentCells = this.getAvailableAdjucent(this.availableCells, cell.x, cell.y);
	var thisCoveredCell = this.getCoveredCell(cell.x,cell.y);
	var self = this;
	if (thisCoveredCell) {
		adjucentCells = adjucentCells.filter(function(adjCell){
			var adjCoveredCell = self.getCoveredCell(adjCell.x,adjCell.y);
			if (!adjCoveredCell) return true;
			if (adjCoveredCell.carpet === thisCoveredCell.carpet) return false;
			return true;
		})
	}
	this.availableCells = adjucentCells;
};
Field.prototype.payPenalty = function(curPlayer) {
	var x = this.osama.x;
	var y = this.osama.y;
	var coveredCell = this.getCoveredCell(x, y);
	if (!coveredCell || coveredCell.player.id === curPlayer.id) return;
	var carpetOwner = coveredCell.player;
	
	var cells = {};
	var cellsCounter = 1;
	twoDimArraySet( x, y);
	var adjCells = this.getAdjucentCells(x, y);
	var self = this;
	getAdjucentSamePlayerCarpets(adjCells);
	curPlayer.payPenalty(carpetOwner, cellsCounter);

	function getAdjucentSamePlayerCarpets(adjCells) {
		for (var i = 0; i < adjCells.length; i++) {
			var cell = adjCells[i];
			if (cell.x < 0 || cell.x > 7 || cell.y < 0 || cell.y > 7) continue;
			if(twoDimArrayGet( cell.x, cell.y)) continue;
			var thisCoveredCell = self.getCoveredCell(cell.x, cell.y);
			if (!thisCoveredCell || thisCoveredCell.player.id !== coveredCell.player.id) continue;
			twoDimArraySet(cell.x, cell.y);
			cellsCounter++;
			getAdjucentSamePlayerCarpets(self.getAdjucentCells(cell.x, cell.y));
		};
	}
	function twoDimArraySet( x, y) {
		if (!cells[x]) cells[x] = {};
		cells[x][y] = true;
	}
	function twoDimArrayGet( x, y) {
		if (!cells[x]) return false;
		return cells[x][y];
	}
};
Field.prototype.getAdjucentCells = function(x, y) {
	return [
		{x: x - 1, y: y},
		{x: x + 1, y: y},
		{x: x, y: y - 1},
		{x: x, y: y + 1}
	];
};
Field.prototype.moveOsama = function(callback) {
	var self = this;
	this.osama.move(callback, function(){
		return self.getCell(self.osama.x, self.osama.y);
	});
};
Field.prototype.turnOsama = function(direction) {
	this.osama.turn(direction);
};
Field.prototype.getOsamaPosibleDirections = function() {
	return this.osama.getPosibleDirections();
};
Field.prototype.showPosibleDirections = function(posDirs) {
	this.osama.showDirections(posDirs);
};
Field.prototype.hideDirections = function() {
	this.osama.hideDirections();
};
Field.prototype.showPosibleCarpets = function() {
	if (!this.firstHalf) {
		var adjCells = this.getAvailableAdjucent(this.availableCells, this.osama.x, this.osama.y);
	} else {
		adjCells = this.availableCells;
	}
	for (var i = 0; i < adjCells.length; i++) {
		this.getCell(adjCells[i].x, adjCells[i].y).css('background-color', 'black');
	};
};
Field.prototype.getAvailableAdjucent = function(avCells, x, y) {
	var adjucentCells = this.getAdjucentCells(x, y);
	adjucentCells = adjucentCells.filter(function(adjCell){
		if (adjCell.x < 1 || adjCell.x > 7 || adjCell.y < 0 || adjCell.y > 7) return false;
		for (var i = 0; i < avCells.length; i++) {
			if (avCells[i].x === adjCell.x && avCells[i].y === adjCell.y) {
				return true;
			}
		};
		return false;
	});
	return adjucentCells;
};