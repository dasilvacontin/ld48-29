
/* Player.js */

var Player = function(props)
{
	this.nextTeammate = undefined;
	this.HP = 5;
	this.moves = [];
	this.team = undefined;
	this.AI = false;
};

//nextTeammate
Player.prototype.getNextTeammate = function()
{
	return this.nextTeammate;
}
Player.prototype.setNextTeammate = function(player)
{
	this.nextTeammate = player;
}

//team
Player.prototype.setTeam = function(team)
{
	this.team = team;
}

//IA
Player.prototype.isAI = function()
{
	return this.AI;
}
Player.prototype.makeAI = function()
{
	this.AI = true;
}

//move
Player.prototype.popNextMove = function()
{
	return this.moves.shift();
}

Player.prototype.constructor = Player;