function Match (players) {
	this.players = players;
	this.lastRoundTimeStart;
	this.map;
}

Match.prototype.playersReady = function() {
	for ( var i = 0; i < this.players.length; ++i)
		if (this.players[i].alive && !this.players[i].ready) return false;
	return true;
};

Match.prototype.empty = function() {
	for ( var i = 0; i < this.players.length; ++i)
		if (this.players[i].alive) return false;
	return true;
};

module.exports = Match;
