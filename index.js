require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages],
    partials: ["CHANNEL", "MESSAGE", "DM_CHANNEL"],
});

const db = require("./db");
const retuneAPI = require("./retune-api");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    console.log(`Message from ${message.author.tag}: ${message.content}`)
    if (message.channel.type === "DM") {
        console.log("detected dm")
        if (message.channel.messages.cache.first() === message) {
            console.log("detected first message")
            retuneAPI.createThread().then((threadId) => {
                retuneAPI.sendResponse(threadId, message.content).then((data) => {
                    message.channel.send(data.output);
                });
                db.setThreadId(message.author.id, threadId);
            });
        } else {
            db.getThreadId(message.author.id).then((threadId) => {
                retuneAPI.sendResponse(threadId, message.content).then((data) => {
                    message.channel.send(data.output);
                });
            });
        }
    }
});

client.login();
