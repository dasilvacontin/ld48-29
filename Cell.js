
/* Cell.js */

var Cell = function(i, j)
{	
	this.i = i;
	this.j = j;
	this.block = false;
	return this;
};

Cell.prototype.makeObstacle = function()
{
	this.block = true;
};

Cell.prototype.constructor = Cell;