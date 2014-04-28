
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
	this.players = {};

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
				var player = cell.getPlayer();
				var psc = new PlayerSpriteController(player);
				csc.setPlayer(psc);
				this.players[player.id] = psc;
			}

		}

		this.cells.push(row);

	}
};

MapSpriteController.prototype.getCellAt = function(i, j)
{
	if (this.cells[i] === undefined) return undefined;
	return this.cells[i][j];
}

MapSpriteController.prototype.cellPlusDir = function (cell, dir)
{
	var inc = DIR_INC[dir];
	return this.getCellAt(cell.i+inc.i,cell.j+inc.j);
}

MapSpriteController.prototype.logic = function(dt)
{
	for (var i = 0; i < this.cells.length; ++i) {
		for (var j = 0; j < this.cells[0].length; ++j) {
			var csc = this.cells[i][j];
			var inertia = csc.logic(dt);
			if (inertia > 0) {
				//console.log("splash with inertia: "+inertia);
				this.splashOnCellWithInertia(csc.cell, inertia);
			}
			if (csc.bullet) {
				var bullet = csc.bullet;
				bullet.logic();
				if (bullet.isOutOfBounds()) {
					var nextCsc = this.cellPlusDir(csc.cell, bullet.dir);
					csc.setBullet(undefined);
					if (nextCsc && !nextCsc.cell.isBlock() && !nextCsc.player) {
						nextCsc.setBullet(bullet);
						nextCsc.addInertia(5);
					} else {
						if (nextCsc.player) this.onUpdatePlayerCallback(nextCsc.player.player);
						nextCsc.addInertia(10);
					}
				}
			}
		}
	}
	for (var pid in this.players) this.players[pid].logic(dt);
}

MapSpriteController.prototype.centerInRect = function(w, h)
{
	this.sprite.position.x = Math.floor((w-this.w)/2);
	this.sprite.position.y = Math.floor((h-this.h-CELL_HEIGHT)/2);
};

MapSpriteController.prototype.splashOnCellWithInertia = function(cell, inertia)
{
	if (inertia <= 0) return;

	var csc = this.getCellAt(cell.i, cell.j);
	if (csc === undefined) return;
	csc.addInertia(inertia);

	for (var i = 0; i < 4; ++i) {
		var targetCell = this.map.cellPlusDir(cell, i);
		if (targetCell !== undefined) this.splashOnCellWithInertia(targetCell, inertia-5);
	}

};

MapSpriteController.prototype.getSprite = function()
{
	return this.sprite;
}

MapSpriteController.prototype.onPlayerMoveToCellCallback = function(player, cell)
{
	var psc = this.players[player.id];

	var oldCell = player.getCell();
	var csc = this.getCellAt(oldCell.i, oldCell.j);
	csc.setPlayer(undefined);

	var csc = this.getCellAt(cell.i, cell.j);
	csc.setPlayer(psc);
}

MapSpriteController.prototype.onPlayerUsedSplashCallback = function(player)
{
	this.splashOnCellWithInertia(player.cell, 10);
	this.getCellAt(player.cell.i, player.cell.j).inertia = 0;
}

MapSpriteController.prototype.onPlayerShotCallback = function(player)
{
	var bsc = new BulletSpriteController(player);
	var csc = this.cellPlusDir(player.cell, player.getOrientation());
	
	if (csc && !csc.cell.isBlock() && !csc.cell.hasPlayer()) {
		csc.setBullet(bsc);
		csc.addInertia(5);
	} else {
		if (csc.cell.hasPlayer()) this.onUpdatePlayerCallback(csc.cell.getPlayer());
		csc.addInertia(10);
	}

}

MapSpriteController.prototype.onUpdatePlayerCallback = function(player)
{
	
	if (!player.isAlive()) {
		var csc = this.getCellAt(player.cell.i, player.cell.j);
		csc.setPlayer(undefined);
	} else {
		var psc = this.players[player.id];
		psc.syncWithData();
	}
}

MapSpriteController.prototype.constructor = MapSpriteController;