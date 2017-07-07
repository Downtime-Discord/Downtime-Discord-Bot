module.exports.quote = async function(message){
  var mention = message.mentions.users.first();
  if(!mention) return;

  var toQuote = message.channel.messages.filter(function(msg){
    return msg.author.id === mention.id.toString() && msg.id !== message.id;
  }).last();

  var result = await message.channel.send({embed: {
    color: 1811429,
    author: {
      name: toQuote.author.username,
      icon_url: toQuote.author.avatarURL
    },
    description: toQuote.content,
    timestamp: new Date(toQuote.createdTimestamp)
  }});
  result.pin();  
};