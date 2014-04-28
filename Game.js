 
 /* Game.js */

 var Game = function()
 {
 	this.map = new Map(6,6);
 	this.teams = [];
 	this.maxMoves = 6;
 }

Game.prototype.addPlayerToTeam = function (player, team)
{
	//le list
	var teammate = this.teams[team];

	if (teammate === undefined) {
		this.teams[team] = player;
		return this;
	}

	while (teammate.getNextTeammate() !== undefined) {
		teammate = teammate.getNextTeammate();
	}
	
	teammate.setNextTeammate(player);
	player.setTeam(team);
	return this;
}

Game.prototype.step = function()
{
	for (var t = 0; t < this.teams.length; ++t) {
		var player = this.teams[t];
		while (player !== undefined) {
			var move = player.popNextMove();
			if (move !== undefined) this.playerPerformMove(player, move);
			player = player.getNextTeammate();
		}
	}
}

Game.prototype.playerPerformMove = function(player, move)
{
	
}

Game.prototype.constructor = Game;