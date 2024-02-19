require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const createThread = async () => {
    return new Promise((resolve, reject) => {
        fetch(`https://retune.so/api/chat/${process.env.RETUNE_CHAT_ID}/new-thread`, {
            "headers": {
                "X-Workspace-API-Key": process.env.RETUNE_API_KEY,
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            resolve(data.threadId);
        }).catch((err) => {
            reject(err);
        });
    })
}

const sendResponse = async (threadId, message) => {
    return new Promise((resolve, reject) => {
        fetch(`https://retune.so/api/chat/${process.env.RETUNE_CHAT_ID}/response`, {
            "headers": {
                "X-Workspace-API-Key": process.env.RETUNE_API_KEY,
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "threadId": threadId,
                "input": message
            }),
            "method": "POST"
        }).then((res) => {
            return res.json();
        }).then((data) => {
            resolve(data.response.value);
        }).catch((err) => {
            reject(err);
        });
    })
}

module.exports = {
    createThread,
    sendResponse,
}