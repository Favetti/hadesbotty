// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  // We need to add this guild to our settings!
  if (!client.settings.get(guild.id)) {
    client.logger.debug(".....NEW GUILD, using default settings: "+guild.id+" :: "+guild.name);
    client.settings.set(guild.id, client.config.defaultSettings);
  }
};
