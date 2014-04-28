
/* Constants.js */

function randColor()
{
	return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
}

var CELL_EDGE = 50;
var CELL_SPRING_K = 0.2;
var BLOCK_HEIGHT = 20;
var SPRING_E = 0.05;

var DIR_UP = 0,
	DIR_RIGHT = 1,
	DIR_DOWN = 2,
	DIR_LEFT = 3;

var TYPE_MOVE = 0,
	TYPE_SHOOT = 1,
	TYPE_SPLASH = 2;

var DIR_INC = [
	{i:-1,j:0},
	{i:0,j:1},
	{i:1,j:0},
	{i:0,j:-1}];