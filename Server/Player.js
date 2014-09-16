function Player( username, socketId ) {
	this.socketId = socketId;
	this.username = username;
	this.matchId;
	this.ready = false;
	this.alive = true;
}

module.exports = Player;
