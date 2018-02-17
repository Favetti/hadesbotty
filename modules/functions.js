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
    try {
      const props = require(`../commands/${commandName}`);
      client.logger.log(`Loading Command: ${props.help.name}. 👌`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
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
    
  
  //HadesBotty userDB
  client.checkUserDB = (client, message) => {
    if (message.channel.type !=='text') return;
    const settings = client.settings.get(message.guild.id);
    
    // For ease of use in commands and functions, we'll attach the userDB
    // to the message object, so `message.userDB` is accessible.
    if (client.userDB.get(message.author.id)) {
      message.userDB = client.userDB.get(message.author.id);
      message.userDB.username = message.author.username;
      message.userDB.lastSeen = Date.now();
    }
    else
      message.userDB = {username: message.author.username, lastSeen: Date.now()};

    if (!message.userDB[message.guild.id]) 
      message.userDB[message.guild.id] = {name: message.guild.name, level: 0, points: 0, commands: 0 };

    
    client.logger.debug("got: "+JSON.stringify(message.userDB));
    
    if (message.content.indexOf(settings.prefix) === 0) 
      message.userDB[message.guild.id].commands++;
    else
      message.userDB[message.guild.id].points++;

    
    const curLevel = Math.floor(0.1 * Math.sqrt(message.userDB[message.guild.id].points));
    if (message.userDB[message.guild.id].level < curLevel) {
      //message.reply(`You've leveled up to chat level **${curLevel}**!`);
      message.userDB[message.guild.id].level = curLevel;
    }
      
    client.logger.debug("set: "+JSON.stringify(message.userDB));
    client.userDB.set(message.author.id, message.userDB);
    
    
  };
  
  // *AF Points Monitoring
  client.pointsMonitor = (client, message) => {
    if (message.channel.type !=='text') return;
        
    
    const settings = client.settings.get(message.guild.id);
    const score = client.points.get(message.guild.id+"::"+message.author.id) || { level: 0, points: 0, commands: 0 };
    if (message.content.startsWith(settings.prefix)) 
      score.commands++;
    else
      score.points++;
    
    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if (score.level < curLevel) {
      //message.reply(`You've leveled up to chat level **${curLevel}**!`);
      score.level = curLevel;
    }
    client.points.set(message.author.id, score);
    
    // User data recording
    if (!client.usersData.has(message.author.id)) client.logger.log(`No previous userData for user ${ message.author.username} (${message.author.id})`);
    var userData = client.usersData.get(message.author.id) || {userName: message.author.username};
    //client.logger.debug(`:pre: message from: ${message.author.id} :: ${userData["userName"]} :: ${userData["guildName"]} :: ${userData["timeOffset"]} :::: ${userData["lastSeen"]}`);
    
    if (message.guild) {
      userData["guildName"] = message.guild.name;
      userData["guild"] = message.guild.id;
    }
    userData["userName"] = message.author.username;
    userData["lastSeen"] = Date.now();
  
    //client.logger.debug(`:: writing to ${message.author.id} :: ${userData["userName"]} :: ${userData["guildName"]} :: ${userData["timeOffset"]} :::: ${userData["lastSeen"]} `);
    client.usersData.set(message.author.id, userData);
    //userData = client.usersData.get(message.author.id)
    //client.logger.debug(`:pos: message from: ${message.author.id} :: ${userData["userName"]} :: ${userData["guildName"]} :: ${userData["timeOffset"]} :::: ${userData["lastSeen"]}`);
    
  };

};
