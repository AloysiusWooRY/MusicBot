const { Client, Collection, IntentsBitField } = require("discord.js")
const fs = require("fs")
const { Player } = require("discord-player")
const { YouTubeExtractor } = require('@discord-player/extractor');
const { updateQueue, clearPlay } = require("./util/updateGUI")
require("dotenv").config()

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent
    ]
})

let bot = {
    client,
    prefix: "=",
    owners: ["217655330014756865"]
}

client.commandsToLoad = []
client.commands = new Collection()
client.events = new Collection()
client.slashcommands = new Collection()
client.buttons = new Collection()

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
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
        filter: "audioonly"
    }
})
client.player.extractors.loadDefault();
console.log(client.player.scanDeps())

client.player.events.on("playerStart", (queue, track) => {
    console.log("Start")
    updateQueue(client, queue)
})

client.player.events.on("audioTrackAdd", (queue, track) => {
    console.log("Add")
    if (!queue || !queue.isPlaying()) return
    updateQueue(client, queue)
})

client.player.events.on("emptyQueue", (queue) => {
    console.log("End")
    clearPlay(client, queue.metadata.channel)
});


client.login(process.env.TOKEN)