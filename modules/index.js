var danbooru  = require('./danbooru');
var flickr    = require('./flickr');
var million   = require('./million');
var ping      = require('./ping');
var quote     = require('./quote');
var random    = require('./random');
var troll     = require('./troll');
var steam     = require('./steam');
var urban     = require('./urban');

async function help (message) {
  cmds = Object.keys(module.exports.messageRoutes);
  cmdstr = cmds.join("\n");
  message.channel.send('Check your DMs');
  await message.author.sendMessage("Bot Commands list\n\*" + cmdstr + "\*");
};

module.exports.messageRoutes = {
  // Ping
  ">ping": ping.ping,

  // Million Dollars Bot
  ">million": million.question,
  ">yes": million.yes,
  ">yep": million.yes,
  ">yeah": million.yes,
  ">no": million.no,
  ">nope": million.no,
  ">addcondition": million.addCondition,
  ">addoutcome": million.addOutcome,
  ">wealth": million.scores,

  // Flickr
  ">birb": flickr.birb,
  ">bird": flickr.birb,
  ">birdie": flickr.birb,
  ">dog": flickr.doggo,
  ">doggie": flickr.doggo,
  ">doggo": flickr.doggo,
  ">cat": flickr.kitty,
  ">kitty": flickr.kitty,
  ">betta": flickr.betta,
  ">image": flickr.imageSearch,
  ">hug": flickr.hug,

  // danbooru
  ">safe": danbooru.safe,
  ">ecchi": danbooru.ecchi,
  ">nsfw": danbooru.nsfw,

  // Random
  ">dice": random.dice,
  ">roll": random.dice,
  ">pick": random.pick,

  // Urban Dictionary
  ">urban": urban.urban,

  // Quote
  ">quote": quote.quote,

  // Troll commands
  ">f": troll.F,
  ">rip": troll.rip,
  ">throw": troll.tablethrow,
  ">lenny": troll.lenny,
  ">lennyface": troll.lenny,

  ">items": steam.GetPlayerItems,
  ">games": steam.GetGameIDs,
  ">details": steam.GetPlayerDetails,
  ">level": steam.GetPlayerLevel,
  ">friends": steam.GetSteamFriends,

  // Help
  ">help": help
};