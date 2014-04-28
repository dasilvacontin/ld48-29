
/* PlayerSpriteController.js */

var PLAYER_HEIGHT = 8;
var PLAYER_RADIUS = 15;
var PLAYER_FLOAT = 10;

var p0canvas = document.createElement('canvas');
p0canvas.width = CELL_EDGE;
p0canvas.height = CELL_EDGE+PLAYER_HEIGHT;
var p0ctx = p0canvas.getContext('2d');

p0ctx.fillStyle = "#AAAAAA";
p0ctx.beginPath();
p0ctx.arc(CELL_EDGE/2, CELL_EDGE/2+PLAYER_HEIGHT, PLAYER_RADIUS, 0, Math.PI, false);

p0ctx.rect(CELL_EDGE/2 - PLAYER_RADIUS, CELL_EDGE/2, PLAYER_RADIUS*2, PLAYER_HEIGHT);
p0ctx.fill();
p0ctx.closePath();

p0ctx.fillStyle = "#FFFFFF";
p0ctx.beginPath();
p0ctx.arc(CELL_EDGE/2, CELL_EDGE/2, PLAYER_RADIUS, 0, Math.PI*2, false);
p0ctx.fill();
p0ctx.closePath();

var pshadowcanvas = document.createElement('canvas');
pshadowcanvas.width = pshadowcanvas.height = CELL_EDGE;
var shadowctx = pshadowcanvas.getContext('2d');
shadowctx.fillStyle = "black";
shadowctx.beginPath();
shadowctx.arc(CELL_EDGE/2, CELL_EDGE/2, PLAYER_RADIUS, 0, Math.PI*2, false);
shadowctx.fill();
shadowctx.closePath();

var PSHADOW_TEXTURE = new PIXI.Texture.fromCanvas(pshadowcanvas);

var TEAM_TEXTURE = [
	new PIXI.Texture.fromCanvas( dyeImageWithColor(p0canvas, randColor(), 0.5) ),
	new PIXI.Texture.fromCanvas( dyeImageWithColor(p0canvas, randColor(), 0.5) )
];

var PlayerSpriteController = function(player)
{
	var texture = TEAM_TEXTURE[player.getTeam()];
	this.sprite = new PIXI.DisplayObjectContainer();

	this.shadow = new PIXI.Sprite(PSHADOW_TEXTURE);
	this.sprite.addChild(this.shadow);
	this.shadow.alpha = 0.3;
	this.shadow.anchor.x = 0.5;
	this.shadow.anchor.y = 0.5;
	this.shadow.position.x = CELL_EDGE/2;
	this.shadow.position.y = CELL_EDGE/2;

	this.discSprite = new PIXI.Sprite(texture);
	this.discSprite.anchor.y = PLAYER_HEIGHT/(PLAYER_HEIGHT+2*PLAYER_RADIUS);
	this.discSprite.position.y = - PLAYER_FLOAT;
	this.sprite.addChild(this.discSprite);

	this.t = 0;
	this.tt = Math.random()/10 +1;
}

PlayerSpriteController.prototype.logic = function(dt)
{
	this.t += dt*this.tt;
	this.discSprite.position.y = - PLAYER_FLOAT + 5*Math.sin(this.t/10);
}

PlayerSpriteController.prototype.getSprite = function()
{
	return this.sprite;
}

PlayerSpriteController.prototype.syncWithData = function()
{
	//TO-DO
}

PlayerSpriteController.prototype.constructor = PlayerSpriteController;