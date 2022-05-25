const { MessageActionRow, MessageButton, MessageEmbed, Message } = require("discord.js")

module.exports = {
    name: "gui",
    category: "admin",
    devOnly: true,
    run: async({ client, message, args }) => {

        const playEmb = new MessageEmbed()
            .setTitle('Now Playing :musical_note:')
            .setDescription('[Rick Astley - Never Gonna Give You Up (Official Music Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)')
            .addField("\u200B", "`Length:` 69:69⠀⠀⠀⠀⠀`Requested by:` Jia Hao")
            .setThumbnail('https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg')
            .setColor('#ff0000')

        const queueEmb = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle('Queue')
            .setDescription(
                "__**Up Next**__\n" +
                "`1.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n" +
                "`2.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`\n" +
                "`3.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n" +
                "`4.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`\n" +
                "`5.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n" +
                "`6.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`\n" +
                "`7.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n" +
                "`8.` **[Coldplay - Hymn For The Weekend (Official Video)](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `3:46`\n" +
                "`9.` **[twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ)** | `4:43`\n"
            )
            .addField("\u200B", "**5 songs in queue | 18:39 total length**")

        const consoleEmb = new MessageEmbed()
            .setTitle("Console")
            .setColor("#0000ff")
            .setDescription(
                "`1.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`2.` Zoling skipped [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`3.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`4.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n" +
                "`5.` Boo added [twenty one pilots: Stressed Out [OFFICIAL VIDEO]](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `4:43`\n"
            )

        const buttonSkip = new MessageButton()
            .setStyle('SECONDARY')
            .setCustomId('music-skip')
            .setLabel('Skip')
        const buttonStop = new MessageButton()
            .setStyle('SECONDARY')
            .setCustomId('music-stop')
            .setLabel('Stop')
        const buttonPause = new MessageButton()
            .setStyle('SECONDARY')
            .setCustomId('music-pause')
            .setLabel('Pause')


        message.channel.send({
            embeds: [
                playEmb,
                queueEmb,
                consoleEmb
            ],
            components: [
                new MessageActionRow().addComponents([
                    buttonSkip,
                    buttonStop,
                    buttonPause
                ])
            ]
        })
    }
}