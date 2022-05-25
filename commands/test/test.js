module.exports = {
    name: "test",
    category: "test",
    devOnly: false,
    run: async({ client, message, args }) => {
        let guild = message.channel.guild
        let mem = guild.members.cache.get("217655330014756865")

        console.log(mem.nickname)
    }
}