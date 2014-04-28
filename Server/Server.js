var io = require("socket.io").listen(5465);
var Player = require('./Player');
var Match = require('./Match');

io.set('log level', 1);

function Server () {
	this.players = [];  // Player objects
	this.playersWaiting = [];  // player id
	this.matches = [];  // Match objects
	this.ongoingMatches = [];  // match id
}

Server.prototype.start = function() {
	var self = this;
	io.sockets.on('connection', function (socket) {
		socket.on('join', function (username) {
			console.log('join');
			self.players[socket.id] = new Player(username, socket.id);
			self.playersWaiting.push(socket.id);

			while (self.playersWaiting.length >= 2)
			{
				console.log("new Match");
				var matchPlayers = [];
				for (var i = 0; i < 2; ++i)
				{
					var plId = self.playersWaiting.shift();
					var pl = self.players[plId];
					matchPlayers.push( pl );
				}

				var match = new Match( matchPlayers );
				var matchId = self.matches.length;
				self.matches.push( match );

				for (var i = 0; i < 2; ++i)
				{
					var plId = matchPlayers[i].socketId;
					self.players[plId].matchId = matchId;
					if ( self.players[plId].alive )
						io.sockets.sockets[plId].emit( "startGame", match );
				}
			}
		});

		socket.on('animationReady', function () {
			console.log('animationReady');
			var plId = socket.id;
			var player = self.players[plId];
			player.ready = true;
			var match = self.matches[player.matchId];
			if ( match.playersReady() )
			{
				for (var i = 0; i < match.players.length; i++) {
					if ( match.players[i] != undefined && match.players[i].alive )
						io.sockets.sockets[match.players[i].socketId].emit( "startNewRound" );
				};
				match.lastRoundTimeStart = +new Date();
				console.log(match.lastRoundTimeStart);
				self.ongoingMatches.push(player.matchId);
			}
		});

		socket.on("action", function (action) {
			console.log("action");
			var plId = socket.id;
			var player = self.players[plId];
			player.nextActions = action;
		});

		socket.on('disconnect', function (data) {
			console.log('disconnect');
			var plId = socket.id;
			var player = self.players[plId];
			for (var i = 0; i < self.playersWaiting.length; i++) {
				if ( self.playersWaiting[i] == player ) {
					self.playersWaiting.splice(i,1);
					console.log("hai");
					break;
				}
			};
			self.players[plId] = undefined;
		});
	});
	setInterval(this.loop.bind(this), 1000);
};


Server.prototype.loop = function() {
	console.log("Loop");
	console.log(JSON.stringify(this));
	while( this.ongoingMatches.length > 0 && +new Date() - this.matches[this.ongoingMatches[0]].lastRoundTimeStart >= 5*1000 )
	{
		console.log(+new Date() - this.matches[this.ongoingMatches[0]].lastRoundTimeStart);
		var matchId = this.ongoingMatches.shift();
		var match = this.matches[matchId];
		if (!match.empty())
		{
			console.log("match is not empty");
			var actions = [];
			for (var i = 0; i < match.players.length; i++) {
				if ( match.players[i] != undefined && match.players[i].alive && match.players[i].nextActions != undefined )
				{
					actions.push({id: match.players[i].socketId, actions: match.players[i].nextActions});
					match.players[i].nextActions = undefined;
				}
			};
			for (var i = 0; i < match.players.length; i++) {
				match.players[i].ready = false;
				if ( match.players[i] != undefined && match.players[i].alive )
					io.sockets.sockets[match.players[i].socketId].emit( "endRound", actions );
			};
		}
		else
		{
			console.log("match is empty");
			this.matches[matchId] = undefined;
		}
	}
};

var server = new Server();
server.start();