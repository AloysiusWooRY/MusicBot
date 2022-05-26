const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

const updateQueue = async(client, queue) => {

    console.log("queue!")
    const fetchMessages = await queue.metadata.channel.messages.fetch({ after: 1, limit: 1 })
    const guiMsg = fetchMessages.first()
    let playEmb
    let queueString = ""

    if (!queue || !queue.playing) {
        playEmb = new MessageEmbed(guiMsg.embeds[0].setDescription(`Nothing is playing! /play to play`).setThumbnail(''))
        playEmb.fields[0] = { name: "\u200B", value: `\`Length:\` ⠀⠀⠀⠀⠀\`Requested by:\` *your mom*` }
    } else {
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = 0
        const currentSong = queue.current

        queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** [${song.title}](${song.url}) ${song.duration} - <@${song.requestedBy.id}>`
        }).join("\n")

        const requestedBy = currentSong.requestedBy
        playEmb = new MessageEmbed(guiMsg.embeds[0].setDescription(`[${currentSong.title}](${currentSong.url})`).setThumbnail(currentSong.thumbnail))
        playEmb.fields[0] = { name: "\u200B", value: `\`Length:\` ${currentSong.duration}⠀⠀⠀⠀⠀\`Requested by:\` <@${requestedBy.id}>` }
    }

    let queueEmb = new MessageEmbed(guiMsg.embeds[1]).setDescription("__**Up Next**__\n" + queueString)
    queueEmb.fields[0] = { name: "\u200B", value: `**${queue.tracks.length} songs in queue | NIL total length**` }

    await guiMsg.edit({ embeds: [playEmb, queueEmb, guiMsg.embeds[2]] });
}

const updateConsole = async(command, interaction, data = null) => {

    console.log("console!")
    const fetchMessages = await interaction.channel.messages.fetch({ after: 1, limit: 1 })
    const guiMsg = fetchMessages.first()
    const myDate = new Date(Date.now()).toLocaleTimeString('en-SG', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })

    let descriptionArr = guiMsg.embeds[2].description.split("\n")

    switch (command) {
        case "play":
            descriptionArr.unshift(`\`${myDate}\` >> ${interaction.member.nickname || interaction.member.user.username} added [${data.title}](${data.url}) (\`${data.duration}\`)`)
            break
        case "skip":
            descriptionArr.unshift(`\`${myDate}\` >> ${interaction.member.nickname || interaction.member.user.username} skipped [${data.title}](${data.url}) (\`${data.duration}\`)`)
            break
        case "stop":
            descriptionArr.unshift(`\`${myDate}\` >> ${interaction.member.nickname || interaction.member.user.username} stopped the music 👎`)
            break
        case "pause":
            descriptionArr.unshift(`\`${myDate}\` >> ${interaction.member.nickname || interaction.member.user.username} ${data ? "" : "un"}paused the music ⏸`)
            break
        case "shuffle":
            descriptionArr.unshift(`\`${myDate}\` >> ${interaction.member.nickname || interaction.member.user.username} shuffled the playlist 🔀`)
            break
        case "error":
            descriptionArr.unshift(`\`${myDate}\` >> ${interaction.member.nickname || interaction.member.user.username}: 🚫 ${data}`)
            break
    }

    if (descriptionArr.length > 10) descriptionArr.pop()

    if (command === "pause") {
        let guiBtns = guiMsg.components[0].components
        guiBtns[2].setLabel(data ? "Paused" : "Pause").setStyle(data ? "DANGER" : "SECONDARY")
        await guiMsg.edit({
            embeds: [guiMsg.embeds[0], guiMsg.embeds[1], guiMsg.embeds[2].setDescription(descriptionArr.join("\n"))],
            components: [
                new MessageActionRow().addComponents([
                    guiBtns
                ])
            ]
        })
    } else {
        await guiMsg.edit({ embeds: [guiMsg.embeds[0], guiMsg.embeds[1], guiMsg.embeds[2].setDescription(descriptionArr.join("\n"))] })
    }

}

const clearPlay = async(client, channel) => {

    const fetchMessages = await channel.messages.fetch({ after: 1, limit: 1 })
    const guiMsg = fetchMessages.first()
    let guiBtns = guiMsg.components[0].components
    guiBtns[2].setLabel("Pause").setStyle("SECONDARY")

    playEmb = new MessageEmbed(guiMsg.embeds[0].setDescription(`Nothing is playing! /play to play`).setThumbnail(''))
    playEmb.fields[0] = { name: "\u200B", value: `\`Length:\` ⠀⠀⠀⠀⠀\`Requested by:\` *your mom*` }

    await guiMsg.edit({
        embeds: [playEmb, guiMsg.embeds[1], guiMsg.embeds[2]],
        components: [
            new MessageActionRow().addComponents([
                guiBtns
            ])
        ]
    });
}

module.exports = {
    updateQueue,
    updateConsole,
    clearPlay
}