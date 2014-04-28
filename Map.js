
/* Map.js */

var Map  = function(w, h)
{
	this.w = w;
	this.h = h;
	this.generate();
	this.cells = [];
	return this;
};

Map.prototype.randomCell = function()
{
	var i = Math.floor(Math.random()*this.h),
		j = Math.floor(Math.random()*this.w);
	return this.cells[i][j];
}

Map.prototype.getCellAt = function(i, j)
{
	return this.cells[i][j];
}

Map.prototype.generate = function()
{

	this.cells = [];

	for (var i = 0; i < this.h; ++i) {

		var row = [];
		for (j = 0; j < this.w; ++j) row.push(new Cell(i, j));
		this.cells.push(row);

	}

	var blocks = this.w*this.h/2;
	for (var k = 0; k < blocks; ++i) this.randomCell().makeObstacle();

	return this;

};

Map.prototype.constructor = Map;