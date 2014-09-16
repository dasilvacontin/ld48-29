
/* Map.js */

var Map  = function(w, h)
{
	this.w = w;
	this.h = h;
	this.generate();
};

Map.prototype.getWidth = function()
{
	return this.w;
}

Map.prototype.getHeight = function()
{
	return this.h;
}

Map.prototype.getRandomCell = function()
{
	var i = Math.floor(Math.random()*this.h),
		j = Math.floor(Math.random()*this.w);
	if (this.cells[i] === undefined) return undefined;
	return this.cells[i][j];
}

Map.prototype.getCellAt = function(i, j)
{
	if (this.cells[i] === undefined) return undefined;
	return this.cells[i][j];
}

Map.prototype.cellPlusDir = function (cell, dir)
{
	var inc = DIR_INC[dir];
	return this.getCellAt(cell.i+inc.i,cell.j+inc.j);
}

Map.prototype.generate = function()
{

	this.cells = [];

	for (var i = 0; i < this.h; ++i) {

		var row = [];
		for (j = 0; j < this.w; ++j) row.push(new Cell(i, j));
		this.cells.push(row);

	}

	var blocks = this.w*this.h/10;
	console.log(blocks);
	for (var k = 0; k < blocks; ++k) this.getRandomCell().makeObstacle();

	for (var i = 0; i < this.h; ++i) {
		for (var j = 0; j < this.w; ++j) {
			if (i == 0 || j == 0 || i == this.h-1 || j == this.w-1) this.getCellAt(i,j).makeObstacle();
		}
	}

	return this;

};

Map.prototype.constructor = Map;