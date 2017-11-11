var keys    = require('../util/keys');
var request = require('request');;

var createRequestUrl = function(keyword){
  return `https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&extras=url_o&api_key=${keys.FLICKR.KEY}&tag_mode=all&tags=${keyword}`;
};

var getImage = function(keyword, channel){
  request(createRequestUrl(keyword), function(err, res, body){
    try {
      var photos = JSON.parse(body).photos.photo.filter(function(photo){
        return photo.url_o;
      });

      var photo = photos[Math.floor(Math.random() * photos.length)];

      if (!photo || !photo.url_o) throw "photo missing"
      channel.send(photo.url_o);
    } catch (e) {
      channel.send("Failed to get image from Flickr");
    }
  });
};

module.exports.birb = function(message){
  getImage("bird", message.channel);
};

module.exports.doggo = function(message){
  getImage("dog", message.channel);
};

module.exports.kitty = function(message){
  getImage("cat", message.channel);
};

module.exports.betta = function(message){
  getImage("betta fish", message.channel);
};

module.exports.hug = function(message){
  getImage("hug", message.channel);
};

module.exports.imageSearch = function(message){
  getImage(message.content.slice(6), message.channel);
};
