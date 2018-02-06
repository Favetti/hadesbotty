// *AF*
// Hades star Technology Level

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  //const user = `<@${message.author.id}>`;
  
  var allTech = client.hsTech.get(message.author.id) || { transp: 0,	miner: 0,	bs: 0,	cargobay: 0,	computer: 0,	tradeboost: 0,	rush: 0,	tradeburst: 0,	autopilot: 0,	offload: 0,	beam: 0,	entrust: 0,	recall: 0,	hydrobay: 0,	miningboost: 0,	enrich: 0,	remote: 0,	hydroupload: 0,	miningunity: 0,	crunch: 0,	genesis: 0,	battery: 0,	laser: 0,	mass: 0,	dual: 0,	barrage: 0,	alpha: 0,	delta: 0,	pas: 0,	omega: 0,	mirror: 0,	emp: 0,	teleport: 0,	rsextender: 0,	repair: 0,	warp: 0,	unity: 0,	sanctuary: 0,	stealth: 0,	fortify: 0,	impulse: 0,	rocket: 0,	salvage: 0,	suppress: 0,	destiny: 0,	barrier: 0,	vengeance: 0,	leap: 0 };
  var msg = "";
  var techID = "";
           
  for (techID in allTech) {
    // skip loop if the property is from prototype
    if (!allTech.hasOwnProperty(techID)) continue;
    
    var techLevel = allTech[techID];
    if (techLevel >0) msg += (`\n${client.config.techArray[techID]}: ${techLevel}`);    
  }

  return message.reply(`here are your Tech levels: ${msg}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["gt"],
  permLevel: "User"
};

exports.help = {
  name: "gettech",
  category: "Hades Star",
  description: "Read your Technology Level",
  usage: "gettech"
};
