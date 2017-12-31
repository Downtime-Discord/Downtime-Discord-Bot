var keys    = require('../util/keys');
var SteamApi = require('steam-api');
var request = require('request');;

var app = new SteamApi.App(keys.STEAM.KEY);
var player = new SteamApi.Player(keys.STEAM.KEY);
var user = new SteamApi.User(keys.STEAM.KEY);

//TODO: ERROR HANDLING
// CHANGE STEAM ID TO @ MENTION (LIKE IF IT'S LINKED TO STEAM)

//Returns a list of all the AppIDs and names of all the games in the steam library
//Use this command at your own risk
module.exports.GetGameIDs = function(message){
  app.GetAppList().done(function(result){
    gameList = [];
    result.forEach(function(game){
      gameList.push(game['name']); //gameList.push((game['appid'], game['name']));
    });
    gamesArr = splitStrByTextLimit(gameList.join('\n'));
    message.channel.send("Check your DMs");
    message.author.sendMessage("Entire Steam Library has to offer:\n");
    gamesArr.forEach(function(block){
      message.author.sendMessage(block);
    });
  });

};

//Displays nickname and profile link of the Steam ID (64-bit) presented
module.exports.GetPlayerDetails = function(message){
  steamId = message.content.slice(9);
    if (steamId){
    url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + keys.STEAM.KEY + '&steamids=' + steamId
    
    request(url,function(err, res, body){
      json = JSON.parse(body);
      profile = json['response']['players'][0];
      message.channel.send('Nickname: ' + profile['personaname']+'\n' + profile['profileurl']+'\n');
    });
  }
};

//Displays the level of the user associated to the Steam ID (64-bit)
module.exports.GetPlayerLevel = function(message){
  steamId = message.content.slice(7);
  if (steamId){
    player.GetSteamLevel(steamId).done(function(result){
      message.channel.send("Steam Level is " + result);
    });
  }
};

//Sends in Direct Message all Steam friends from the associated Steam ID (64-bit)
//in the format nickname, profile link for each friend
module.exports.GetSteamFriends = function(message){
  steamId = message.content.slice(9);
  if (steamId){
    user.GetFriendList(optionalRelationship = 'all', steamId).done(function(result){
      friends = []
      result.forEach(function(player){
        friends.push('Nickname: '+ player['personaName'] + '\n' + player['profileUrl'] + '\n');
      });
      friendArr = splitStrByTextLimit(friends.join('\n'));
      message.channel.send('Check your DMs');
      message.author.sendMessage('Steam friends list: \n');
      friendArr.forEach(function(block){
        console.log(block.length);
        message.author.sendMessage(block);
      });
    });
  }
};

//Feel the shame of how many games are unplayed by the associated Steam ID (64-bit)
module.exports.GetNumUnPlayedGames = function(message){
  steamId = message.content.slice(11);
  if (steamId){
    player.GetOwnedGames(steamId)
    .catch(function(err){
      console.log(err);
    })
    .done(function(result){
      numUnplayed = 0;
      total = 0;
      listUnplayed = [];
      result.forEach(function(game){
        total += 1;
        if (game['playtimeForever'] == '0'){
          numUnplayed += 1;
          //listUnplayed.push((game['appId'],game['name']));
          listUnplayed.push(game['name']);
        }
      });
      gameArr = splitStrByTextLimit(listUnplayed.join('\n'));
      message.channel.send('shame shame ' + numUnplayed.toString() + ' unplayed games out of ' + total.toString() + '\n'
                            + 'List of shame sent via DMs');
      message.author.sendMessage('YOUR LIST OF SHAME:\n');
      gameArr.forEach(function(block){
        message.author.sendMessage(block);
      });
    });
  }
};

//Splits the string into the maximum allowed characters returned in an array
function splitStrByTextLimit(lineOfText){
  maxLength = 2000; //Discord's max character limit
  parsedList = [];
  while (lineOfText.length > maxLength){
    pos = lineOfText.substring(0,maxLength).lastIndexOf('\n');
    pos = pos <= 0 ? maxLength : pos;
    parsedList.push(lineOfText.substring(0,pos));
    i = lineOfText.indexOf('\n',pos)+1;
    if (i < pos || i > pos+1){
      i = pos;
    }
    lineOfText = lineOfText.substring(i);
  }
  parsedList.push(lineOfText);
  return parsedList;
}