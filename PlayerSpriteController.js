
/* PlayerSpriteController.js */

var PLAYER_HEIGHT = 8;
var PLAYER_RADIUS = 15;
var PLAYER_INNER_RADIUS = 10;
var PLAYER_FLOAT = 10;

var pdircanvas = document.createElement('canvas');
pdircanvas.width = pdircanvas.height = CELL_EDGE;
var pdirctx = pdircanvas.getContext('2d');

pdirctx.fillStyle = 'white';
pdirctx.arc(CELL_EDGE/2, CELL_EDGE/2, PLAYER_RADIUS, Math.PI, Math.PI*1.5, false);
pdirctx.lineTo(CELL_EDGE/2, CELL_EDGE/2);
pdirctx.lineTo(CELL_EDGE/2-PLAYER_RADIUS, CELL_EDGE/2);
pdirctx.fill();
pdirctx.closePath();

pdirctx.globalCompositeOperation = "destination-in";

pdirctx.beginPath();
pdirctx.arc(CELL_EDGE/2, CELL_EDGE/2, PLAYER_INNER_RADIUS, Math.PI, Math.PI*1.5, false);
pdirctx.lineTo(CELL_EDGE/2, CELL_EDGE/2);
pdirctx.lineTo(CELL_EDGE/2-PLAYER_INNER_RADIUS, CELL_EDGE/2);
pdirctx.fill();
pdirctx.closePath();

var PDIR_TEXTURE = new PIXI.Texture.fromCanvas(pdircanvas);

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

var TEAM_COLOR = [randColor(), randColor()];

function hexstringToNum(str)
{
	return parseInt("0x"+str.slice(1));
}

var TEAM_TEXTURE = [
	new PIXI.Texture.fromCanvas( dyeImageWithColor(p0canvas, TEAM_COLOR[0], 0.5) ),
	new PIXI.Texture.fromCanvas( dyeImageWithColor(p0canvas, TEAM_COLOR[1], 0.5) )
];

var PlayerSpriteController = function(player)
{
	var texture = TEAM_TEXTURE[player.getTeam()];
	this.sprite = new PIXI.DisplayObjectContainer();

	this.hpring = new HPRingSpriteController (TEAM_COLOR[player.getTeam()]);
	this.hpringSprite = this.hpring.getSprite();
	this.sprite.addChild(this.hpringSprite);
	if (!player.isAI()) this.hpring.setLocal();

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

	this.dirSprite = new PIXI.Sprite(PDIR_TEXTURE);
	this.discSprite.addChild(this.dirSprite);
	this.dirSprite.anchor.x = 0.5;
	this.dirSprite.anchor.y = 0.5;
	this.dirSprite.position.x = CELL_EDGE/2;
	this.dirSprite.position.y = CELL_EDGE/4;
	this.dirSprite.rotation = player.getOrientation()*Math.PI/2+Math.PI/4;
	this.dirSprite.alpha = 0.75;

	this.t = 0;
	this.tt = Math.random()/10 +1;
}

PlayerSpriteController.prototype.logic = function(dt)
{
	this.t += dt*this.tt;
	var offset = 5*Math.sin(this.t/15);
	this.discSprite.position.y = - PLAYER_FLOAT + offset;
	this.shadow.scale.x = this.shadow.scale.y = 0.8+0.1*((offset+5)/10);

	this.hpring.logic(dt);
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