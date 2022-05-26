const { MessageEmbed, MessageActionRow } = require("discord.js")

module.exports = {
    name: "test",
    category: "test",
    devOnly: false,
    run: async({ client, message, args }) => {
        const fetchMessages = await message.channel.messages.fetch({ after: 1, limit: 1 })
        const guiMsg = fetchMessages.first()

        guiMsg.edit({
                components: [
                    new MessageActionRow().addComponents([
                        guiMsg.components[0].components[0],
                        guiMsg.components[0].components[1],
                        guiMsg.components[0].components[2].setLabel("Pause")
                    ])
                ]
            })
            // console.log(guiMsg.components[0].components[2].setLabel("Changed"))
    }
}



//queue.metadata.channel.guild.members.cache.get(requestedBy.id).nickname