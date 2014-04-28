 
/* HPRingSpriteController.js */

var HPRingCanvasForPercentage = function(p, color, oldBuffer)
{

	var ringcanvas = oldBuffer || document.createElement('canvas');
	ringcanvas.width = ringcanvas.height = CELL_EDGE;
	var ringctx = ringcanvas.getContext('2d');

	ringctx.beginPath();
	ringctx.arc(CELL_EDGE/2, CELL_EDGE/2, PLAYER_RADIUS+7, 0 + (1-p)*Math.PI/2, Math.PI/2, false);
	ringctx.lineTo(CELL_EDGE/2, CELL_EDGE/2);
	ringctx.lineTo(PLAYER_RADIUS+10, CELL_EDGE/2);
	ringctx.fillStyle = color;
	ringctx.fill();
	ringctx.closePath();

	ringctx.beginPath();
	ringctx.arc(CELL_EDGE/2, CELL_EDGE/2, PLAYER_RADIUS+3, 0, Math.PI/2, false);
	ringctx.lineTo(CELL_EDGE/2, CELL_EDGE/2);
	ringctx.lineTo(PLAYER_RADIUS+3, CELL_EDGE/2);
	ringctx.fillStyle = '#ffffff';
	ringctx.globalCompositeOperation = "destination-out";
	ringctx.fill();
	ringctx.closePath();

	return ringcanvas;
}

var localRingCanvas = function (color)
{
	var localcanvas = document.createElement('canvas');
	localcanvas.width = localcanvas.height = CELL_EDGE;
	var localctx = localcanvas.getContext('2d');

	localctx.beginPath();
	localctx.arc(CELL_EDGE/2, CELL_EDGE/2, CELL_EDGE/2-2, 0, Math.PI/2, false);
	localctx.lineTo(CELL_EDGE/2, CELL_EDGE/2);
	localctx.lineTo(PLAYER_RADIUS+10, CELL_EDGE/2);
	localctx.fillStyle = color;
	localctx.fill();
	localctx.closePath();

	localctx.beginPath();
	localctx.arc(CELL_EDGE/2, CELL_EDGE/2, PLAYER_RADIUS-5, 0, Math.PI/2, false);
	localctx.lineTo(CELL_EDGE/2, CELL_EDGE/2);
	localctx.lineTo(PLAYER_RADIUS-5, CELL_EDGE/2);
	localctx.fillStyle = 'white';
	localctx.globalCompositeOperation = "destination-out";
	localctx.fill();
	localctx.closePath();

	return localcanvas;

}

var HPRingSpriteController = function(color)
{
	this.color = color;
	this.p = 1;
	this.buffer = HPRingCanvasForPercentage(this.p, color);
	this.sprite = new PIXI.DisplayObjectContainer();

	this.bar = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.buffer));
	this.bar.anchor.x = 0.5;
	this.bar.anchor.y = 0.5;
	this.bar.position.x = CELL_EDGE/2;
	this.bar.position.y = CELL_EDGE/2;
	this.bar.rotation = -Math.PI/4;
	this.bar.alpha = 0.5;
	this.sprite.addChild(this.bar);

	this.isLocal = false;

}

HPRingSpriteController.prototype.setLocal = function()
{
	this.local1 = new PIXI.Sprite( new PIXI.Texture.fromCanvas( localRingCanvas(this.color) ) );
	this.local1.alpha = 0.5;
	this.local1.anchor.x = 0.5;
	this.local1.anchor.y = 0.5;
	this.local1.position.x = CELL_EDGE/2;
	this.local1.position.y = CELL_EDGE/2;

	this.local2 = new PIXI.Sprite( this.local1.texture );
	this.local2.alpha = 0.5;
	this.local2.anchor.x = 0.5;
	this.local2.anchor.y = 0.5;
	this.local2.position.x = CELL_EDGE/2;
	this.local2.position.y = CELL_EDGE/2;

	this.sprite.addChild(this.local1);
	this.sprite.addChild(this.local2);
	this.sprite.addChild(this.bar);

	this.isLocal = true;
	this.t = 0;
}

HPRingSpriteController.prototype.setColor = function(color)
{
	this.color = color;
	this.buffer = HPRingCanvasForPercentage(this.p, color, this.buffer);
}

HPRingSpriteController.prototype.setPercentage = function(p)
{
	this.p = p;
	this.buffer = HPRingCanvasForPercentage(p, this.color, this.buffer);
}

HPRingSpriteController.prototype.getSprite = function()
{
	return this.sprite;
}

HPRingSpriteController.prototype.logic = function(dt)
{
	if (this.isLocal) {
		this.t += dt;
		var t = this.t/20;
		this.local1.rotation = t;
		this.local2.rotation = Math.PI+t;
	}
}

HPRingSpriteController.prototype.constructor = HPRingSpriteController;