// *AF*
// Hades star Technology Level

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  //const user = `<@${message.author.id}>`;
  if (args[0] == null || args[1] == null) return message.reply("Invalid command, need 2 arguments");
  
  const techID = args[0];
  const techLevel = Number(args[1]);
  
 // client.logger.log(`Trying to set tech "${techID}" to "${techLevel}" for userId "${message.author.id}"`);
  
  if (client.config.techList.indexOf(` ${techID},`) < 0) return message.reply(`Invalid Tech: ${techID}`);
  if (!(techLevel >= 0 && techLevel <=10)) return message.reply(`Invalid Level: ${techLevel}`);
  
  //client.hsTech.set(message.author.id, { transp: 0,	miner: 0,	bs: 0,	cargobay: 0,	computer: 0,	tradeboost: 0,	rush: 0,	tradeburst: 0,	autopilot: 0,	offload: 0,	beam: 0,	entrust: 0,	recall: 0,	hydrobay: 0,	miningboost: 0,	enrich: 0,	remote: 0,	hydroupload: 0,	miningunity: 0,	crunch: 0,	genesis: 0,	battery: 0,	laser: 0,	mass: 0,	dual: 0,	barrage: 0,	alpha: 0,	delta: 0,	pas: 0,	omega: 0,	mirror: 0,	emp: 0,	teleport: 0,	rsextender: 0,	repair: 0,	warp: 0,	unity: 0,	sanctuary: 0,	stealth: 0,	fortify: 0,	impulse: 0,	rocket: 0,	salvage: 0,	suppress: 0,	destiny: 0,	barrier: 0,	vengeance: 0,	leap: 0 });
  
  var allTech = client.hsTech.get(message.author.id) || { transp: 0,	miner: 0,	bs: 0,	cargobay: 0,	computer: 0,	tradeboost: 0,	rush: 0,	tradeburst: 0,	autopilot: 0,	offload: 0,	beam: 0,	entrust: 0,	recall: 0,	hydrobay: 0,	miningboost: 0,	enrich: 0,	remote: 0,	hydroupload: 0,	miningunity: 0,	crunch: 0,	genesis: 0,	battery: 0,	laser: 0,	mass: 0,	dual: 0,	barrage: 0,	alpha: 0,	delta: 0,	pas: 0,	omega: 0,	mirror: 0,	emp: 0,	teleport: 0,	rsextender: 0,	repair: 0,	warp: 0,	unity: 0,	sanctuary: 0,	stealth: 0,	fortify: 0,	impulse: 0,	rocket: 0,	salvage: 0,	suppress: 0,	destiny: 0,	barrier: 0,	vengeance: 0,	leap: 0 };
  message.reply(`\n${client.config.techArray[techID]} : set to ${techLevel} (was ${allTech[techID]})`);
  allTech[techID] = techLevel;
  client.hsTech.set(message.author.id, allTech);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["st"],
  permLevel: "User"
};

exports.help = {
  name: "settech",
  category: "Hades Star",
  description: "Update your Technology Level",
  usage: "settech [techID] [level] \n\nValid Tech: transp, miner, bs, cargobay, computer, tradeboost, rush, tradeburst, autopilot, offload, beam, entrust, recall, hydrobay, miningboost, enrich, remote, hydroupload, miningunity, crunch, genesis, battery, laser, mass, dual, barrage, alpha, delta, passive, omega, mirror, emp, teleport, rsextender, repair, warp, unity, sanctuary, stealth, fortify, impulse, rocket, salvage, suppress, destiny, barrier, vengeance, leap"
};
