function ActionEvents() {
	this.MAP = {
	    38: { key: 0, type: 'arrow', direction: 'up'},
	    39: { key: 1, type: 'arrow', direction: 'right'},
	    40: { key: 2, type: 'arrow', direction: 'down'},
	    37: { key: 3, type: 'arrow', direction: 'left'}
	};
}
ActionEvents.prototype.waitForAction = function(args, callback, condition, init) {
	init && init();
	this.waitedAction = args;
	this.waitedCallback = callback;
	this.condition = condition;
};
ActionEvents.prototype.keyPressed = function(e) {
	if (!this.MAP[e.keyCode]) return;
	this.reactToAction(true, this.MAP[e.keyCode].direction);
};
ActionEvents.prototype.listenToOsama = function(osama) {
	for (var i = 0; i < osama.directions.length; i++) {
		osama.directions[i].click(this.osamaClicked());
	};
};
ActionEvents.prototype.osamaClicked = function() {
	var self = this;
	return function(e) {
		var id = e.target.id;
		self.reactToAction(false, id.substr(id.indexOf('-') + 1));
	}
};
ActionEvents.prototype.listenToAvailableCells = function(field) {
	$('.available.cell').click(this.availableCellClicked());
};
ActionEvents.prototype.availableCellClicked = function() {
	var self = this;
	return function(e) {
		var id = e.target.id;
		self.reactToAction(false, id);
	}
};
ActionEvents.prototype.reactToAction = function(isKeyboard, property) {
	var self = this;
	if (isKeyboard) {
		if(!property) return;
	}
	if(!this.waitedAction) return;
	var waited = this.waitedAction;
	switch(waited.type) {
		case 'directionChoose':
			if (isKeyboard) {
				if (!this.condition(property)) return;
			}
			react.call(this, property);
			break;
		case 'carpetLay':
			if (isKeyboard) {
				var carpetHalf = this.condition(property);
				if (!carpetHalf) return;
			} else {
				var id = property.substr(property.indexOf('-') + 1);
				carpetHalf = {
					x: +id.substr(0, 1),
					y: +id.substr(2, 1)
				};
				console.log(carpetHalf);
			}
			$('.available.cell').off('click');
			react.call(this, carpetHalf);
			break;
	}

	function react(arg){
		self.waitedCallback(arg);
		delete this.waitedAction;
		delete this.waitedCallback;
	}
};