
/* CellSpriteController.js */

var CELL_HEIGHT = 60;
var CELL_TOP_COLOR = "#FFFFFF";
var CELL_SIDE_COLOR = "#AAAAAA";

var cellCanvas = document.createElement('canvas');
var cellctx = cellCanvas.getContext('2d');
cellctx.width = CELL_EDGE;
cellctx.height = CELL_EDGE+CELL_HEIGHT;
cellctx.fillStyle = CELL_TOP_COLOR;
cellctx.rect(0,0,CELL_EDGE,CELL_EDGE);
cellctx.fill();
cellctx.strokeStyle = "#EEEEEE";
cellctx.stroke();
cellctx.fillStyle = CELL_SIDE_COLOR;
cellctx.fillRect(0, CELL_EDGE, CELL_EDGE, CELL_HEIGHT);

var CELL_TEXTURE = new PIXI.Texture.fromCanvas(cellCanvas);

var CellSpriteController = function(cell)
{
	this.sprite = new PIXI.DisplayObjectContainer();
	this.cellSprite = new PIXI.Sprite(CELL_TEXTURE);
	//this.cellSprite = new PIXI.DisplayObjectContainer();
	this.sprite.addChild(this.cellSprite);
	this.offsetY = 0;
	this.inertia = 0;
	this.sprite.position.x = cell.j*CELL_EDGE;
	this.sprite.position.y = cell.i*CELL_EDGE;
	this.block = undefined;
	this.player = undefined;

	if (cell.isBlock()) {
		var self = this;
		setTimeout(function () {
			self.block = new BlockSpriteController();
			self.cellSprite.addChild(self.block.getSprite());
		}, Math.random()*2*1000);
	}

}

CellSpriteController.prototype.logic = function(dt)
{
	if (this.block) {
		var inertia = this.block.logic(dt);
		if (inertia > 0) this.addInertia(inertia);
	}
	if (this.inertia == 0 && this.offsetY == 0) return;
	this.offsetY += this.inertia*dt;
	this.inertia -= CELL_SPRING_K*this.offsetY*dt;
	this.inertia *= 0.8*dt;
	if (Math.abs(this.inertia) < SPRING_E) this.inertia = this.offsetY = 0;
	this.cellSprite.position.y = this.offsetY;
}

CellSpriteController.prototype.addInertia = function(power)
{
	this.inertia += power;
}

CellSpriteController.prototype.getSprite = function()
{
	return this.sprite;
}

CellSpriteController.prototype.setPlayer = function(player)
{
	this.player = player;
	this.cellSprite.addChild(player.getSprite());
}

CellSpriteController.prototype.constructor = CellSpriteController;