const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
require("dotenv").config()

const client = new Discord.Client({
    intents: ["GUILDS"]
})

let bot = {
    client
}

const CLIENT_ID = "347319288366891021"
const GUILD_ID = "322271623543783424"

client.slashcommands = new Discord.Collection()

client.commandsToLoad = []
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)
client.loadSlashCommands(bot, true)


client.on("ready", async() => {
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: client.commandsToLoad })
        .then(() => {
            console.log("Successfully loaded")
            process.exit(0)
        })
        .catch((err) => {
            console.log(err)
            process.exit(1)
        })
})

client.login(process.env.TOKEN)