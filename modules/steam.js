var keys    = require('../util/keys');
var SteamApi = require('steam-api');
var request = require('request');;

var app = new SteamApi.App(keys.STEAM.KEY);
var player = new SteamApi.Player(keys.STEAM.KEY);
var user = new SteamApi.User(keys.STEAM.KEY);

//TODO: ERROR HANDLING
// CHANGE STEAM ID TO @ MENTION (LIKE IF IT'S LINKED TO STEAM)

//Returns a list of all the AppIDs of all the games in the steam library
module.exports.GetGameIDs = function(message){
  app.GetAppList().done(function(result){
    //message.channel.send(result);
    console.log(result);
  });

};

//Displays nickname and profile link of the Steam ID (64-bit) presented
module.exports.GetPlayerDetails = function(message){
  steamId = message.content.slice(9);
  url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + keys.STEAM.KEY + '&steamids=' + steamId
  
  request(url,function(err, res, body){
    json = JSON.parse(body);
    profile = json['response']['players'][0];
    message.channel.send('Nickname: ' + profile['personaname']+'\n' + profile['profileurl']+'\n');
  });
};

//Displays the level of the user associated to the Steam ID (64-bit)
module.exports.GetPlayerLevel = function(message){
  steamId = message.content.slice(7);
  player.GetSteamLevel(steamId).done(function(result){
    message.channel.send("Steam Level is " + result);
  });
};

//Sends in Direct Message all Steam friends from the associated Steam ID (64-bit)
//in the format nickname, profile link for each friend
module.exports.GetSteamFriends = function(message){
  steamId = message.content.slice(9);
  user.GetFriendList(optionalRelationship = 'all', steamId).done(function(result){
    friends = []
    result.forEach(function(player){
      friends.push('Nickname: '+ player['personaName'] + '\n' + player['profileUrl'] + '\n');
    });
    message.channel.send('Check your DMs');
    message.author.sendMessage('Steam friends list: \n' + friends.join('\n'));
  });
};