function Osama(div) {
	this.x = 4;
	this.y = 4;
	this.div = $('<div></div>').attr('id', 'osama');
	this.directions = [];
	div.append(this.div);
	for (var prop in REVERSES) {
		if (REVERSES.hasOwnProperty(prop)) {
			var dir = $('<div></div>').addClass('osamaDirections-' + prop).attr('id', 'osamaControls-' + prop);
			this.directions.push(dir);
			this.div.append(dir);
		}
	}
	this.turn('up');
}

Osama.prototype.move = function(callback, getCell) {
	switch(this.direction) {
		case 'up':
			move.call(this, 'y', false);
			break;
		case 'down':
			move.call(this, 'y', true);
			break;
		case 'left':
			move.call(this, 'x', false);
			break;
		case 'right':
			move.call(this, 'x', true);
			break;
	}
	var div = getCell();
	var self = this.div;
	this.div.fadeOut(100, function(){
		div.append(self);
		self.fadeIn(100, callback);
	})
};
Osama.prototype.getPosibleDirections = function() {
	var dirObj = {
		up: true,
		down: true,
		left: true,
		right: true
	};
	dirObj[REVERSES[this.direction]] = false;
	return dirObj;
};
Osama.prototype.turn = function(direction) {
	this.direction && this.div.removeClass('dir-' + this.direction);
	this.direction = direction;
	this.div.addClass('dir-' + this.direction);
};
Osama.prototype.showDirections = function(posDirs) {
	for (var prop in posDirs) {
		if (posDirs.hasOwnProperty(prop) && posDirs[prop]) {
			this.div.children('.osamaDirections-' + prop).show();
		}
	}
};
Osama.prototype.hideDirections = function() {
	this.div.children('*').hide();
};

function move(axis, ascending){
	ascending ? this[axis]++ : this[axis]--;
	var otherAxis = axis === 'x' ? 'y' : 'x';
	switch(this[axis]) {
		case 0:
			this[axis] = 1;
			this.turn(REVERSES[this.direction]);
			this[otherAxis] % 2 === 0 ? this[otherAxis]-- : this[otherAxis]++;
			if(this[otherAxis] === 8) {
				this[otherAxis] = 7;
				axis === 'y' ? this.turn('left') : this.turn('up');
			}
			break;
		case 8:
			this[axis] = 7;
			this.turn(REVERSES[this.direction]);
			this[otherAxis] % 2 === 0 ? this[otherAxis]++ : this[otherAxis]--;
			if(this[otherAxis] === 0) {
				this[otherAxis] = 1;
				axis === 'y' ? this.turn('right') : this.turn('down');
			}
			break;
	}
}