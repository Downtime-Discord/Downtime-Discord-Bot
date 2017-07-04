var request = require('request');

/**
 * The maximum number of attempts if the bot does not get an image at the first try.
 * This may happen if the first image is marked as Loli/shota. Danbooru will still list them,
 * but not show them unless you have a gold account. Unfortunately this means we may, once in
 * a while, get a response without an image path, so we cannot display anything. Therefore we
 * try again.
 */
var maxAttempts = 3;

/**
 * Request and post an explicit image from danbooru
 */
module.exports.nsfw = function(message)
{
  requestNsfwImage(message, "explicit");
}

/**
 * Request and post a questionable image from danbooru
 */
module.exports.ecchi = function(message)
{
  requestNsfwImage(message, "questionable");
}

/**
 * Request and post a safe image from danbooru
 */
module.exports.safe = function(message)
{
  requestImage(message, "safe", maxAttempts);
}

/**
 * If the channel is marked nsfw request an image.
 * Otherwise tell the user this is not possible.
 * @param {*} message The message that was received. Used to determine the channel (and the
 *                    user, if necessary).
 * @param {*} rating The rating to use (safe, questionable or explicit. See danbooru)
 */
function requestNsfwImage(message, rating)
{
  if(message.channel.nsfw)
  {
    console.log("Requesting " + rating + " image from danbooru ...");
    requestImage(message, rating, maxAttempts);
  }
  else
  {
    console.log("Requesting " + rating + " image outside an nsfw channel. Denied.");
    message.channel.send("I'm sorry, " + message.author + ", i'm afraid i can't do that.")
  }
}

/**
 * Request an image from danbooru and post it to the channel.
 * @param {*} message The message that was received. Used to determine the channel
 * @param {*} rating The rating to use (safe, questionable or explicit. See danbooru)
 * @param {*} count The number of attempts that are made, if errors occur. You may get
 *                  responses without images (only visible for gold members) from danbooru,
 *                  in this case the bot requests another image.
 */
function requestImage(message, rating, attempts)
{
  request("https://danbooru.donmai.us/posts.json?random=true&limit=1&tags=rating:" + rating,
  function(error, response, body)
  {
    if(error !== null)
    {
      console.log(error);

      message.channel.send("An error occured. Pelase try again.");
      return -1;
    }
    else if(body === null || body === "[]" )
    {
      console.log("Error: no body");
      console.log(response);

      message.channel.send("An error occured. Please try again.");
    }

    var arr = JSON.parse(body);
    var entry = arr[0];

    if(entry.hasOwnProperty("file_url"))
    {
      message.channel.send("https://danbooru.donmai.us" + entry.file_url);
    }
    else if(attempts > 0)
    {
      var attemptsLeft = attempts - 1;
      console.log("Error: body did not contain file_url. Attempting again (" + (attemptsLeft) + " attempts left)");
      onRequestImage(message, rating, attemptsLeft);
    }
    else
    {
      message.channel.send("An error occured. Please try again.");
    }
  });
}