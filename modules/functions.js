module.exports = (client) => {

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    var msg = "";
    try {
      const props = require(`../commands/${commandName}`);
      //msg += `${props.help.name}👌;  `;
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e.stack}`;
    }    
    //client.logger.log(`Loading Commands: ${msg}`);
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
  
  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 
  
  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };    
  
  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });
 
  // *** userDB stores user information
  client.checkUserDB = (message) => {
    if (message.channel.type !=='text') return;
    const settings = client.settings.get(message.guild.id);
    
    //Welcome a new user
    if (!client.userDB.has(message.author.id))
      message.author.send("Hello, it seems to be the first time i see you here. I´m a BOT designed to deal with Hade's Star technologies.\nYou may type "+settings.prefix+"help at anytime to view the available commands, and "+settings.prefix+"help <command> to describe any one of them.\n I suggest your first inputs to be using the "+settings.prefix+"Tech set command, using TechGroups (so you can batch input all your research levels).");
    
    // For ease of use in commands and functions, attach the current userDB to the message object
    message.userDB = client.userDB.get(message.author.id) || {username: message.author.username};

    // ** Points system
    if (!message.userDB[message.guild.id])
      message.userDB[message.guild.id] = {name: message.guild.name, level: 0, points: 0, commands: 0 };
    if (message.content.indexOf(settings.prefix) === 0) {
      if (!message.userDB[message.guild.id].commands) // avoid situation where data was null and woulndt ++
        message.userDB[message.guild.id].commands = 1;
      else
        message.userDB[message.guild.id].commands++;
    }
    else {
      if (!message.userDB[message.guild.id].points) // avoid situation where data was null and woulndt ++
        message.userDB[message.guild.id].points = 1;
      else
        message.userDB[message.guild.id].points++;
    }
    const curLevel = Math.floor(0.1 * Math.sqrt(message.userDB[message.guild.id].points));
    if (message.userDB[message.guild.id].level < curLevel) {
      //message.reply(`You've leveled up to chat level **${curLevel}**!`);
      message.userDB[message.guild.id].level = curLevel;
    }

    // Update lastseen and save
    message.userDB.lastSeen = Date.now();
    client.userDB.set(message.author.id, message.userDB)

    //client.logger.debug("> "+JSON.stringify(message.userDB));

    // Update username ASYNC
    client.updateDisplayName(message.author.id, message.author.username, message.guild);

  };

  client.updateDisplayName = async (userID, username, guild) => {
    try {
      const now = Date.now(),
            delay = 2; //delay for update if user not seen, in hours

      var userDB = client.userDB.get(userID) || {username: userID};
      if (!userDB.hasOwnProperty(guild.id))
        userDB[guild.id] = {name: guild.name, lastUpdate: 0}

      //client.logger.debug(guild.id+":"+!userDB[guild.id].hasOwnProperty("nickname")+" || "+userDB[guild.id].lastUpdate+"/"+now+":"+(userDB[guild.id].lastUpdate <= now-(delay*3600000))+" || "+userDB.username+":"+(userDB.username.indexOf("@") >= 0)+"\n"+JSON.stringify(userDB))

        if ((!userDB[guild.id].hasOwnProperty("nickname")) || (!userDB[guild.id].hasOwnProperty("lastUpdate")) || (userDB[guild.id].lastUpdate <= now-(delay*3600000)) || (userDB.username.indexOf("@") >= 0)) { 
        guild.fetchMember(userID)
          .then(result => { 
            //client.logger.debug("Update username: "+username+"|"+result.displayName+"("+guild.name+")"); //+"\n"+JSON.stringify(userDB))
            userDB.username = username;
            userDB[guild.id].nickname = result.displayName;
            userDB[guild.id].lastUpdate = now;
            client.userDB.set(userID, userDB);
          });
      }
    } catch (error) { client.logger.error(`There was an error in updateDisplayName: ${error}`); } 
  };

  client.getDisplayName = (userID, guild) => {
    try {

      const userDB = client.userDB.get(userID) || {username: userID};
      let returnName = userDB.username || userID;

      if (!guild)
        return returnName

      if (userDB.hasOwnProperty(guild.id))
        if (userDB[guild.id].hasOwnProperty("nickname")) 
          returnName = userDB[guild.id].nickname;

      if (returnName.replace(/[^0-9]/g,"") == userID)
        client.updateDisplayName(userID, returnName.replace(/[^0-9]/g,""), guild);

      return returnName;

    } catch (error) { client.logger.error(`There was an error in getDisplayName: ${error}`); } 
      
  };
  
};
