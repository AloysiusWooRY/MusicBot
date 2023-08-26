const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const { updateConsole } = require("../util/updateGUI")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("loads songs from yt")
        .addSubcommand((subcommand) =>
            subcommand.setName("song")
                .setDescription("Loads a single song from a url")
                .addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist of songs from a url")
                .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Searches for song based on provided keywords")
                .addStringOption((option) => option.setName("searchterms").setDescription("the search keywords").setRequired(true))
        ),
    run: async ({ client, interaction }) => {
        // interaction.deleteReply()
        if (!interaction.member.voice.channel)
            return updateConsole("error", interaction, "You need to be in a VC to use this command")

        const queue = await client.player.nodes.create(interaction.guild, {
            metadata: {
                "channel": interaction.channel,
                "pause": false
            }
        })
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()

        if (interaction.options.getSubcommand() == "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            }).catch(err => console.log(err))
            if (result.tracks.length === 0)
                return updateConsole("error", interaction, "No results")

            const song = result.tracks[0]
            await updateConsole("play", interaction, song)
            await queue.addTrack(song)

        } else if (interaction.options.getSubcommand() == "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            }).catch(err => console.log(err))
            if (result.tracks.length === 0)
                return updateConsole("error", interaction, "No results")

            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} [${playlist.title}](${playlist.url})** has been added to the Queue`)
                .setThumbnail(playlist.thumbnail)
        } else if (interaction.options.getSubcommand() == "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                fallbackSearchEngine: QueryType.YOUTUBE_SEARCH
            }).catch(err => console.log(err))
            if (result.tracks.length === 0)
                return updateConsole("error", interaction, "No results")

            const song = result.tracks[0]
            await updateConsole("play", interaction, song)
            await queue.addTrack(song)

        }
        if (!queue.isPlaying()) {
            console.log("Play")
            await queue.node.play()
        }

    }
}