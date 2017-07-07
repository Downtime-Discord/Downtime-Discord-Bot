var Discord   = require('discord.js');
var client    = new Discord.Client();
var modules   = require('../modules');

client.on('ready', function() {
  console.log("Logged in as " + client.user.tag);
});

client.on('message', function(message) {
  var content = message.content;
  try {
    if (message.author.bot) return;
    var command = content.indexOf(" ") >= 0 ? content.substr(0, content.indexOf(" ")).toLowerCase() : content.toLowerCase();

    if (modules.messageRoutes[command]) modules.messageRoutes[command](message);
  } catch(e) {
    console.warn(`error occured while attempting to handle message syncronously: ${content}`);
    console.warn(`Error: ${e}`);
  }
});

//create event listener for new members
client.on('guildMemberAdd', member => {
    //Sends greeting to the default channel mentioning the member.
    member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);
})

//create event listener for when members leave server
client.on('guildMemberRemove', member => {
    //Sends leave message to the default channel 
    member.guild.defaultChannel.send(`${member} has left the server.`);
})

module.exports = client;
