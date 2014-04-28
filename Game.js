 
 /* Game.js */

var Game = function()
{
 	this.map = new Map(10,10);
 	this.teams = [];
 	this.maxMoves = 6;

	//events
	this.onPlayerMoveToCell = dummyf;
	this.onPlayerUsedSplash = dummyf;
	this.onPlayerShot = dummyf;
	this.onUpdatePlayer = dummyf;
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
	var worked = false;
	for (var t = 0; t < this.teams.length; ++t) {
		var player = this.teams[t];
		while (player !== undefined) {
			var move = player.popNextMove();
			if (move !== undefined) {
				this.playerPerformMove(player, move);
				worked = true;
			}
			player = player.getNextTeammate();
		}
	}
	if (worked) setTimeout(this.step.bind(this), 1*1000);
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
		case TYPE_ROTATE:
			player.rotate(move.dir);
			this.onUpdatePlayer(player);
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

	this.onPlayerMoveToCell(player, cell);

	if (player.getCell()) player.getCell().setPlayer(undefined);
	cell.setPlayer(player);
	player.setCell(cell);
};

Game.prototype.playerShoots = function(player)
{
	var cell = this.map.cellPlusDir(player.getCell(), player.getOrientation());
	while (cell !== undefined) {
		var victim = cell.getPlayer();
		if (victim !== undefined) {
			victim.hurt(1);
			if (!victim.isAlive()) cell.setPlayer(undefined);
			break;
		}
		cell = this.map.cellPlusDir(cell, player.getOrientation());
	}
	this.onPlayerShot(player);
}

Game.prototype.playerUsedSplash = function(player)
{

	var center = player.getCell();
	this.onPlayerUsedSplash(player);

	for (var i = 0; i < 4; ++i) {
		var targetCell = this.map.cellPlusDir(center, i);
		if (targetCell === undefined) continue;
		var victim = targetCell.getPlayer();
		if (victim) {
			victim.hurt(2);
			if (!victim.isAlive()) targetCell.setPlayer(undefined);
			this.onUpdatePlayer(victim);
		}
	}
}

Game.prototype.constructor = Game;