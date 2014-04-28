
/* MapSpriteController.js */

var MapSpriteController = function(map)
{
	this.map = map;
	this.w = map.getWidth()*CELL_EDGE;
	this.h = map.getHeight()*CELL_EDGE;
	this.sprite = new PIXI.DisplayObjectContainer();

	var bg = new PIXI.Graphics();
	bg.beginFill(0xFFFFFF);
	bg.drawRect(0, 0, map.getWidth()*CELL_EDGE, map.getHeight()*CELL_EDGE);
	//this.sprite.addChild(bg);

	this.cells = [];
	this.players = [];

	bg.beginFill(0x333333);
	bg.lineStyle(2, 0xFFFFFF, 1);

	for (var i = 0; i < map.getHeight(); ++i) {

		var row = [];

		for (var j = 0; j < map.getWidth(); ++j) {
			var cell = map.getCellAt(i,j);

			var csc = new CellSpriteController(cell);
			this.sprite.addChild(csc.getSprite());

			row.push(csc);

			if (cell.hasPlayer()) {
				console.log("player!");
				var psc = new PlayerSpriteController(cell.getPlayer());
				csc.setPlayer(psc);
				this.players.push(psc);
			}

			//if (!cell.isBlock()) continue;

			/*
			var block = new BlockSpriteController(cell);
			block.position.x = j*CELL_EDGE;
			block.position.y = i*CELL_EDGE;
			this.blockSprites.push(block);
			this.sprite.addChild(block);
			*/

			/*
			var blockSprite = new PIXI.Sprite(BLOCK_TEXTURE);
			blockSprite.position.x = j*CELL_EDGE;
			blockSprite.position.y = i*CELL_EDGE;
			blockSprite.anchor.x = 0;
			blockSprite.anchor.y = BLOCK_HEIGHT/(CELL_EDGE+BLOCK_HEIGHT);
			this.sprite.addChild(blockSprite);
			*/
		}

		this.cells.push(row);

	}
};

MapSpriteController.prototype.logic = function(dt)
{
	for (var i = 0; i < this.cells.length; ++i) {
		for (var j = 0; j < this.cells[0].length; ++j) {
			this.cells[i][j].logic(dt);
		}
	}
	for (var k = 0; k < this.players.length; ++k) this.players[k].logic(dt);
}

MapSpriteController.prototype.centerInRect = function(w, h)
{
	this.sprite.position.x = Math.floor((w-this.w)/2);
	this.sprite.position.y = Math.floor((h-this.h-CELL_HEIGHT)/2);
};

MapSpriteController.prototype.getSprite = function()
{
	return this.sprite;
}

MapSpriteController.prototype.constructor = MapSpriteController;