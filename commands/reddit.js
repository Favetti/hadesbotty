// test to fetch reddit wiki... turns out hard to read on discord.
// need more work

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  args = args.map(function(x){ return x.toLowerCase() });
  const snoowrap = require('snoowrap'),
        subreddit = "HadesStar",
        r = new snoowrap({
    userAgent: 'hadesbotty.glitch.me',
    clientId: process.env.REDDIT_BOT_ID,
    clientSecret: process.env.REDDIT_BOT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
  });
  
  var wikiPage = "ships/transport",
      page = await r.getSubreddit(subreddit).getWikiPage(wikiPage).content_md;
  
  //r.getSubreddit(subreddit).getWikiPage(wikiPage).content_md.then(console.log);
  
  message.reply( "```" + page + "```" + "\nhttps://reddit.com/r/"+subreddit+"/wiki/"+wikiPage);
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "reddit",
  category: "Hades Star",
  description: "",
  usage: "reddit [topic]"
};
