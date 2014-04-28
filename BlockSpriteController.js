
/* BlockSpriteController.js */
var BLOCK_SIDE_COLOR = "#AAAAAA";
var BLOCK_TOP_COLOR = "#CCCCCC";

var blockCanvas = document.createElement('canvas');
blockCanvas.width = CELL_EDGE;
blockCanvas.height = CELL_EDGE+BLOCK_HEIGHT;
var bctx = blockCanvas.getContext('2d');

bctx.fillStyle = BLOCK_TOP_COLOR;
bctx.fillRect(0,0,CELL_EDGE, CELL_EDGE);
bctx.fillStyle = BLOCK_SIDE_COLOR;
bctx.fillRect(0, CELL_EDGE, CELL_EDGE, BLOCK_HEIGHT);

var BLOCK_TEXTURE = new PIXI.Texture.fromCanvas(blockCanvas);

var BlockSpriteController = function()
{
	this.sprite = new PIXI.DisplayObjectContainer();

	this.shadow = new PIXI.Graphics();
	this.shadow.beginFill(0x222222);
	this.shadow.drawRect(0,0,CELL_EDGE,CELL_EDGE);
	this.shadow.alpha = 0;
	//this.sprite.addChild(this.shadow);

	this.block = new PIXI.Sprite(BLOCK_TEXTURE);
	this.block.anchor.y = BLOCK_HEIGHT/(CELL_EDGE+BLOCK_HEIGHT);
	this.sprite.addChild(this.block);

	this.offsetY = -400;
	this.block.position.y = this.offsetY;
	this.speedY = 0;

}

BlockSpriteController.prototype.logic = function(dt)
{
	if (this.offsetY == 0) return 0;
	this.speedY += 10*dt;
	this.offsetY += this.speedY*dt;
	this.block.position.y = this.offsetY;
	this.shadow.alpha = 1-(this.offsetY/-400);
	if (this.offsetY >= 0) {
		this.offsetY = 0;
		this.block.position.y = this.offsetY;
		this.shadow.alpha = 0;
		return this.speedY/7;
	}
	return 0;
}

BlockSpriteController.prototype.getSprite = function()
{
	return this.sprite;
}

BlockSpriteController.prototype.constructor = BlockSpriteController;