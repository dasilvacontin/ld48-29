
/* Player.js */

var Player = function()
{
	this.nextTeammate = undefined;
	this.HP = 5;
	this.moves = [];
	this.team = undefined;
	this.AI = false;
	this.cell = undefined;
	this.orientation = 0;
	this.id = pid++;
};

//orientation
Player.prototype.setRandomOrientation = function()
{
	this.orientation = Math.floor(Math.random()*4);
	return this;
}

Player.prototype.getOrientation = function()
{
	return this.orientation;
}

//nextTeammate
Player.prototype.getNextTeammate = function()
{
	return this.nextTeammate;
}
Player.prototype.setNextTeammate = function(player)
{
	this.nextTeammate = player;
	return this;
}

//team
Player.prototype.setTeam = function(team)
{
	this.team = team;
	return this;
}
Player.prototype.getTeam = function()
{
	return this.team;
}

//IA
Player.prototype.isAI = function()
{
	return this.AI;
}
Player.prototype.makeAI = function()
{
	this.AI = true;
	return this;
}

//move
Player.prototype.popNextMove = function()
{
	return this.moves.shift();
}

//cell
Player.prototype.getCell = function()
{
	return this.cell;
}
Player.prototype.setCell = function(cell)
{
	this.cell = cell;
	return this;
}

Player.prototype.hurt = function(dmg)
{
	this.HP -= dmg;
	if (this.HP < 0) this.HP = 0;
	return this;
}

Player.prototype.isAlive = function()
{
	return this.HP > 0;
}

Player.prototype.getHP = function()
{
	return this.HP;
}

Player.prototype.constructor = Player;