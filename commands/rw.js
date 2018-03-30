exports.run = async (client, message, args, level) => { 
  
   const snoowrap = require('snoowrap'),
         subreddit = "HadesStar",
         wikiPage = "index",
         r = new snoowrap({
    userAgent: 'hadesbotty.glitch.me',
    clientId: process.env.REDDIT_BOT_ID,
    clientSecret: process.env.REDDIT_BOT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
  });
  
  const page = await r.getSubreddit(subreddit).getWikiPage(wikiPage).content_md,
        mainWiki = page.split(/\r?\n|\|/);
  
  var links = [];
    
  mainWiki.forEach(function(line) {
    line = line.trim();
    let index = line.indexOf("/r/HadesStar/wiki/");
        
    if (index >= 0) {
      if (line.indexOf("/r/HadesStar/wiki/modules/") >= 0){
        let tmp = line.substring(index+26,line.length-1);
        links.push("modules/"+tmp);
      }
      else if (line.indexOf("/r/HadesStar/wiki/ships/") >= 0){
        let tmp = line.substring(index+24,line.length-1);
        links.push("ships/"+tmp);
      } 
    }    
    
  });
  message.reply(JSON.stringify(links))
  
  links.foreach(function(line) {
    
  });
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["readwiki"],
  permLevel: "Bot Support"
};

exports.help = {
  name: "rw",
  category: "Hades Star",
  description: "update internal DB from the Reddit Wiki",
  usage: "rw"
};
