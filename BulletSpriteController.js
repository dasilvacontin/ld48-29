
/* BulletSpriteController.js */

var BULLET_RADIUS = 2;

var bulletcanvas = document.createElement('canvas');
bulletcanvas.width = bulletcanvas.height = 2*BULLET_RADIUS;
var bulletctx = bulletcanvas.getContext('2d');

bulletctx.beginPath();
bulletctx.arc(BULLET_RADIUS, BULLET_RADIUS, BULLET_RADIUS, 0, Math.PI*2, false);
bulletctx.fillStyle = 'white';
bulletctx.fill();

var BULLET_TEXTURE = new PIXI.Texture.fromCanvas(bulletcanvas);


var BulletSpriteController = function (player)
{

	this.ix = 0;
	this.iy = 0;

	this.sprite = new PIXI.DisplayObjectContainer();
	this.bullet = new PIXI.Sprite(BULLET_TEXTURE);
	this.bullet.texture = new PIXI.Texture.fromCanvas( dyeImageWithColor(bulletcanvas, TEAM_COLOR[player.getTeam()], 1) );
	this.bullet.anchor.x = 0.5;
	this.bullet.anchor.y = 0.5;
	this.bullet.position.y = - PLAYER_RADIUS;
	this.sprite.addChild(this.bullet);

	this.dir = player.getOrientation();

	switch(this.dir) {
		case DIR_UP:
			this.ix = CELL_EDGE/2;
			this.iy = CELL_EDGE;
			break;
		case DIR_RIGHT:
			this.ix = 0;
			this.iy = CELL_EDGE/2;
			break;
		case DIR_DOWN:
			this.ix = CELL_EDGE/2;
			this.iy = 0;
			break;
		case DIR_LEFT:
			this.ix = CELL_EDGE;
			this.iy = CELL_EDGE/2;
			break;
	}

	this.x = this.ix;
	this.y = this.iy;

	this.updateSpritePosition();

}

BulletSpriteController.prototype.updateSpritePosition = function()
{
	this.sprite.position.x = this.x;
	this.sprite.position.y = this.y;
}

var BULLET_SPEED = 10;

BulletSpriteController.prototype.logic = function(dt)
{
	var dir_inc = DIR_INC[this.dir];
	this.x += dir_inc.j*BULLET_SPEED;
	this.y += dir_inc.i*BULLET_SPEED;
	this.updateSpritePosition();
}

BulletSpriteController.prototype.isOutOfBounds = function()
{
	return (this.x < 0 || this.x > CELL_EDGE || this.y < 0 || this.y > CELL_EDGE);
}

BulletSpriteController.prototype.cropPosition = function()
{
	if (this.x < 0) this.x += CELL_EDGE;
	else if (this.x > CELL_EDGE) this.x -= CELL_EDGE;

	if (this.y < 0) this.y += CELL_EDGE;
	else if (this.y > CELL_EDGE) this.y -= CELL_EDGE;
}

BulletSpriteController.prototype.resetPosition = function()
{
	this.x = this.ix;
	this.y = this.iy;
}

BulletSpriteController.prototype.getSprite = function()
{
	return this.sprite;
}

BulletSpriteController.prototype.constructor = BulletSpriteController;