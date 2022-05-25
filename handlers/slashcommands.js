const fs = require("fs")

const getFiles = (path, ending) => {
    return fs.readdirSync(path).filter(f => f.endsWith(ending))
}

module.exports = (bot, reload) => {
    const { client } = bot

    let slashcommands = getFiles("./slash/", ".js")

    if (slashcommands.length === 0)
        console.log("No slash commands loaded")

    slashcommands.forEach(f => {
        if (reload) delete require.cache[require.resolve[`../slash/${f}`]]
        const slashcmd = require(`../slash/${f}`)
        client.slashcommands.set(slashcmd.data.name, slashcmd)
        client.commandsToLoad.push(slashcmd.data.toJSON())
    })
}