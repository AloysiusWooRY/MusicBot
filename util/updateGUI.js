const { ButtonBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")

const updateQueue = async (client, queue) => {

    const fetchMessages = await queue.metadata.channel.messages.fetch({ after: 1, limit: 1 })
    const guiMsg = fetchMessages.first()
    const tracks = !queue.isEmpty() ? queue.tracks.data : []

    let playEmb
    let queueString = ""

    if (!queue.isPlaying()) {
        playEmb = EmbedBuilder.from(guiMsg.embeds[0])
            .setDescription(`Nothing is playing! /play to play`)
            .setThumbnail(null)
            .spliceFields(0, 1, { name: "\u200B", value: `\`Length:\` ⠀⠀⠀⠀⠀\`Requested by:\` *your mom*` })
    } else {
        const totalPages = Math.ceil(tracks.length / 10) || 1
        const page = 0
        const currentSong = queue.currentTrack

        queueString = tracks ? tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** [${song.title}](${song.url}) ${song.duration} - <@${song.requestedBy.id}>`
        }).join("\n") : ""

        const requestedBy = currentSong.requestedBy
        playEmb = EmbedBuilder.from(guiMsg.embeds[0])
            .setDescription(`[${currentSong.title}](${currentSong.url})`)
            .setThumbnail(currentSong.thumbnail)
            .spliceFields(0, 1, { name: "\u200B", value: `\`Length:\` ${currentSong.duration}⠀⠀⠀⠀⠀\`Requested by:\` <@${requestedBy.id}>` })
    }

    let queueEmb = EmbedBuilder.from(guiMsg.embeds[1]).setDescription("__**Up Next**__\n" + queueString)
    queueEmb.spliceFields(0, 1, { name: "\u200B", value: `**${queue.size} songs in queue | ${queue.durationFormatted} total length**` })

    await guiMsg.edit({ embeds: [playEmb, queueEmb, guiMsg.embeds[2]] });
}

const updateConsole = async (command, interaction, data = null) => {

    const fetchMessages = await interaction.channel.messages.fetch({ after: 1, limit: 1 })
    const guiMsg = fetchMessages.first()
    const myDate = new Date(Date.now()).toLocaleTimeString('en-SG', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' })

    let descriptionArr = guiMsg.embeds[2].description.split("\n")

    const userName = interaction.member.nickname || interaction.member.user.username
    switch (command) {
        case "play":
            if (!data) break;
            descriptionArr.unshift(`\`${myDate}\` >> ${userName} added [${data.title}](${data.url}) (\`${data.duration}\`)`)
            break
        case "skip":
            if (!data) descriptionArr.unshift(`\`${myDate}\` >> ${userName} removed the added song`);
            else descriptionArr.unshift(`\`${myDate}\` >> ${userName} skipped [${data.title}](${data.url}) (\`${data.duration}\`)`)
            break
        case "stop":
            descriptionArr.unshift(`\`${myDate}\` >> ${userName} stopped the music 👎`)
            break
        case "pause":
            descriptionArr.unshift(`\`${myDate}\` >> ${userName} ${data ? "" : "un"}paused the music ⏸`)
            break
        case "shuffle":
            descriptionArr.unshift(`\`${myDate}\` >> ${userName} shuffled the playlist 🔀`)
            break
        case "error":
            descriptionArr.unshift(`\`${myDate}\` >> ${userName}: 🚫 ${data}`)
            break
    }

    if (descriptionArr.length > 10) descriptionArr.pop()

    if (command === "pause") {
        let guiBtns = guiMsg.components[0].components
        await guiMsg.edit({
            embeds: [
                guiMsg.embeds[0],
                guiMsg.embeds[1],
                EmbedBuilder.from(guiMsg.embeds[2]).setDescription(descriptionArr.join("\n"))
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    guiBtns.map((btnComponent, i) => {
                        if (i != 2) return ButtonBuilder.from(btnComponent)
                        return ButtonBuilder.from(guiBtns[2]).setLabel(data ? "Paused" : "Pause").setStyle(data ? ButtonStyle.Danger : ButtonStyle.Secondary)
                    })
                )
            ]
        })
    } else {
        await guiMsg.edit({ embeds: [guiMsg.embeds[0], guiMsg.embeds[1], EmbedBuilder.from(guiMsg.embeds[2]).setDescription(descriptionArr.join("\n"))] })
    }

}

const clearPlay = async (client, channel) => {

    const fetchMessages = await channel.messages.fetch({ after: 1, limit: 1 })
    const guiMsg = fetchMessages.first()
    let guiBtns = guiMsg.components[0].components

    playEmb = EmbedBuilder.from(guiMsg.embeds[0])
        .setDescription(`Nothing is playing! /play to play`)
        .setThumbnail(null)
        .spliceFields(0, 1, { name: "\u200B", value: `\`Length:\` ⠀⠀⠀⠀⠀\`Requested by:\` *your mom*` })


    await guiMsg.edit({
        embeds: [playEmb, guiMsg.embeds[1], guiMsg.embeds[2]],
        components: [
            new ActionRowBuilder().addComponents(
                guiBtns.map((btnComponent, i) => {
                    if (i != 2) return ButtonBuilder.from(btnComponent)
                    return ButtonBuilder.from(guiBtns[2]).setLabel("Pause").setStyle(ButtonStyle.Secondary)
                })
            )
        ]
    });
}

module.exports = {
    updateQueue,
    updateConsole,
    clearPlay
}