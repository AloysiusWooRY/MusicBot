const { updateConsole, updateQueue } = require("../util/updateGUI")

module.exports = {
    name: "music",
    run: async(client, interaction, parameters) => {
        const btn = parameters[0]

        if (!interaction.guild) return interaction.reply({ content: "This command can only be used in a guild!", ephemeral: true })

        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await updateConsole("error", interaction, "There are no songs in the queue")

        const currentSong = queue.current
        switch (btn) {
            case "skip":
                await updateConsole(btn, interaction, currentSong)
                queue.skip()
                break
            case "stop":
                await updateConsole("stop", interaction)
                queue.destroy()
                break
            case "pause":
                queue.metadata.pause = !queue.metadata.pause
                await updateConsole("pause", interaction, queue.metadata.pause)
                queue.setPaused(queue.metadata.pause)
                break
            case "shuffle":
                await queue.shuffle()
                await updateQueue(client, queue)
                await updateConsole("shuffle", interaction)
                break

        }



    }
}