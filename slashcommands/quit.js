const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { updateConsole } = require("../util/updateGUI")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Stops the bot and clears the queue"),

    run: async({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs in the queue")

        await updateConsole("stop", interaction)
        queue.destroy()
            // await interaction.editReply("Bye!")
    },
}