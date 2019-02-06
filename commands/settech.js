// Hades star Technology Level
// This command will set the level of a specified technology for the user

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const cmd = client.commands.get("tech");
  args.push("set");
  try { cmd.run(client, message, args, level); }
  catch (e) {
    message.reply("An error occured and was caught by the message event: " + e);
    throw e;
  }
  return;
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["st"],
  permLevel: "User"
};

exports.help = {
  name: "settech",
  category: "x Deprecated - HS x",
  description: "Use: !tech set",
  usage: "This command was replaced by the TECH command, this remais as an ALIAS.\nsettech [techID] [level] \n\nValid Tech: transp, miner, bs, rs, cargobay, computer, tradeboost, rush, tradeburst, autopilot, shipdrone, offload, beam, entrust, dispatch, recall, hydrobay, miningboost, enrich, remote, hydroupload, miningunity, crunch, genesis, minedrone, battery, laser, mass, dual, barrage, dart, alpha, delta, passive, omega, mirror, blast, area, emp, teleport, rsextender, repair, warp, unity, sanctuary, stealth, fortify, impulse, rocket, salvage, suppress, destiny, barrier, vengeance, deltarocket, leap, drone, omegarocket"
};
