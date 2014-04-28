 
 /* Game.js */

var Game = function()
{
 	this.map = new Map(15,15);
 	this.teams = [];
 	this.maxMoves = 6;
}

Game.prototype.getMap = function()
{
	return this.map;
}

Game.prototype.addPlayerToTeam = function (player, team)
{
	player.setTeam(team);

	var cell = this.map.getRandomCell();
	while (cell === undefined || cell.isBlock() || cell.hasPlayer()) cell = this.map.getRandomCell();
	this.movePlayerToCell(player, cell);

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
	var cell = player.getCell();

	switch(move.type) {
		case TYPE_MOVE:
			this.movePlayerWithDir(player, (move.dir+player.getOrientation())%4);
			break;
		case TYPE_SHOOT:
			this.playerShoots(player);
			break;
		case TYPE_SPLASH:
			this.playerUsedSplash(player);
			break;
		casse TYPE_ROTATE:
			break;
	}
}

//returns true when successfully moved player
Game.prototype.movePlayerWithDir = function(player, dir)
{
	var targetCell = this.map.cellPlusDir(player.cell, dir);
	if (targetCell.isBlock()) return false;
	if (targetCell.hasPlayer()) {

		//try to push player
		if (this.movePlayerWithDir(targetCell.getPlayer(), dir)) {
			//pushed, so we can move now
			this.movePlayerToCell(player, targetCell);
			return true;
		} else {
			//couldn't push
			return false;
		}

	}

	//cell is empty
	this.movePlayerToCell(player, targetCell);
	return true;
};

Game.prototype.movePlayerToCell = function(player, cell)
{
	if (cell.isBlock()) return;
	if (player.getCell()) player.getCell().setPlayer(undefined);
	cell.setPlayer(player);
	player.setCell(cell);

};

Game.prototype.playerShoots = function(player)
{
	var cell = this.map.cellPlusDir(player.getCell(), player.getOrientation());
	while (cell !== undefined) {
		var victim = cell.getPlayer();
		if (victim !== undefined) return victim.hurt(1);
		cell = this.map.cellPlusDir(cell, player.getOrientation());
	}
}

Game.prototype.playerUsedSplash = function(player)
{
	var center = player.getCell();

	for (var i = 0; i < 4; ++i) {
		var targetCell = this.maps.cellPlusDir(center, i);
		if (targetCell === undefined) continue;
		var victim = targetCell.getPlayer();
		if (victim) victim.hurt(2);
	}
}

Game.prototype.constructor = Game;