
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
	this.cell = cell;
	this.sprite = new PIXI.DisplayObjectContainer();
	this.cellSprite = new PIXI.Sprite(CELL_TEXTURE);
	this.sprite.addChild(this.cellSprite);
	this.offsetY = 0;
	this.inertia = 0;
	this.sprite.position.x = cell.j*CELL_EDGE;
	this.sprite.position.y = cell.i*CELL_EDGE;
	this.block = undefined;
	this.player = undefined;

	if (cell.isBlock()) {
		var self = this;
		//setTimeout(function () {
			setTimeout(function () {
				self.block = new BlockSpriteController();
				self.cellSprite.addChild(self.block.getSprite());
			}, Math.random()*1*1000);
		//}, 5*1000);
	}

}

CellSpriteController.prototype.logic = function(dt)
{

	if (this.inertia != 0 || this.offsetY != 0) {
		this.offsetY += this.inertia*dt;
		this.inertia -= CELL_SPRING_K*this.offsetY*dt;
		this.inertia *= 0.8*dt;
		if (Math.abs(this.inertia) < SPRING_E) this.inertia = this.offsetY = 0;
		this.cellSprite.position.y = this.offsetY;
	}
	if (this.block) {
		return this.block.logic(dt);
	}
	return 0;
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
	if (this.player !== undefined) {
		this.cellSprite.removeChild(this.player.getSprite());
	}

	this.player = player;
	if (player != undefined) {
		this.cellSprite.addChild(player.getSprite());
		this.addInertia(3);
	}
}

//bullet
CellSpriteController.prototype.setBullet = function(bullet)
{
	if (this.bullet) this.sprite.removeChild(this.bullet.getSprite());
	this.bullet = bullet;
	if (bullet) {
		bullet.cropPosition();
		this.sprite.addChild(bullet.getSprite());
		bullet.updateSpritePosition();
	}
}

CellSpriteController.prototype.constructor = CellSpriteController;