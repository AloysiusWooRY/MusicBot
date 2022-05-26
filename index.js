const Discord = require("discord.js")
const fs = require("fs")
const { Player } = require("discord-player")
const { updateQueue, clearPlay } = require("./util/updateGUI")
require("dotenv").config()

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
})

let bot = {
    client,
    prefix: "=",
    owners: ["217655330014756865"]
}

client.commandsToLoad = []
client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.slashcommands = new Discord.Collection()
client.buttons = new Discord.Collection()

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadButtons = (bot, reload) => require("./handlers/buttons")(bot, reload)

client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadSlashCommands(bot, false)
client.loadButtons(bot, false)

module.exports = bot


client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

client.player.on("trackStart", (queue, track) => {
    updateQueue(client, queue)
})

client.player.on("trackAdd", (queue, track) => {
    if (!queue || !queue.playing) return
    updateQueue(client, queue)
})

client.player.on("queueEnd", (queue) => {
    clearPlay(client, queue.metadata.channel)
});


client.login(process.env.TOKEN)