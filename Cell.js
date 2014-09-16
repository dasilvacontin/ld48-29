
/* Cell.js */

var Cell = function(i, j)
{	
	this.i = i;
	this.j = j;
	this.block = false;
	this.player = undefined;
};

Cell.prototype.makeObstacle = function()
{
	this.block = true;
};

Cell.prototype.isBlock = function()
{
	return this.block;
};

Cell.prototype.hasPlayer = Cell.prototype.getPlayer = function()
{
	return this.player;
}
Cell.prototype.setPlayer = function(player)
{
	this.player = player;
}

Cell.prototype.constructor = Cell;