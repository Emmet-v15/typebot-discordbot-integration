require("dotenv").config();
const { Client, GatewayIntentBits, Partials, ChannelType } = require("discord.js");
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel],
});

const db = require("./db");
const retuneAPI = require("./retune-api");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    if (message.channel.type === ChannelType.DM && !message.author.bot) {
        message.reply("Loading...").then((reply) => {
            db.getThreadId(message.author.id)
                .then((threadId) => {
                    retuneAPI.sendResponse(threadId, message.content).then((response) => {
                        reply.edit(response);
                    });
                })
                .catch(() => {
                    retuneAPI.createThread().then((threadId) => {
                        retuneAPI.sendResponse(threadId, message.content).then((response) => {
                            reply.edit(response);
                        });
                        db.setThreadId(message.author.id, threadId);
                    });
                });
        }).catch(console.error);
    }
});

client.login();
