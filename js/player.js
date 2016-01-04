function Player(div, id) {
	var PLAYERS = [
		{
			name: 'You',
			color: '#F7E498'
		},
		{
			name: 'Akhmed',
			color: '#8C1D30'
		},
		{
			name: 'Rashid',
			color: '#D47243'
		},
		{
			name: 'Mukhamed',
			color: '#0369B3'
		}
	];
	this.id = id;
	this.name = PLAYERS[id].name;
	this.coins = 30;
	this.carpets = 12;
	this.layedCarpetPoints = 0;
	this.div = div;
	this.color = PLAYERS[id].color;
	this.div.children('.name').text(this.name);
	this.refreshPoints();
	this.div.css('background-color', this.color);
}

Player.prototype.toString = function() {
	var str = 'name: ' + this.name;
	str += ', coins: ' + this.coins;
	str += ', carpets: ' + this.carpets;
	str += ', layedCarpetPoints: ' + this.layedCarpetPoints;
	str += ', overallPoints: ' + this.getOverallPoints();
	return str;
};
Player.prototype.choose = function() {
	if (this.carpets === 0) return false;
	$('.player.chosen').removeClass('chosen');
	this.div.addClass('chosen');
	return true;
};
Player.prototype.changeLayedCarpetPoints = function(adding) {
	adding ? this.layedCarpetPoints++ : this.layedCarpetPoints--;
	this.refreshPoints();
};
Player.prototype.payPenalty = function(recieverPlayer, price) {
	this.coins -= price;
	this.refreshPoints();
	recieverPlayer.coins += price;
	recieverPlayer.refreshPoints();
};
Player.prototype.reduceCarpets = function() {
	this.carpets--;
	this.refreshPoints();
};
Player.prototype.getOverallPoints = function() {
	return this.layedCarpetPoints + this.coins;
};
Player.prototype.refreshPoints = function() {
	this.div.children('.coins').text(this.coins);
	this.div.children('.carpetsLeft').text(this.carpets);
	this.div.children('.overallPoints').text(this.getOverallPoints());
};