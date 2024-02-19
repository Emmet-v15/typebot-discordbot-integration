const enmap = require("enmap");

const db = new enmap({
    name: "userDB",
});

const getThreadId = async (userId) => {
    return new Promise((resolve, reject) => {
        const threadId = db.get(userId);
        if (threadId) {
            resolve(threadId);
        } else {
            reject(`No threadId found for ${userId}`);
        }
    });
}

const setThreadId = (userId, threadId) => {
    db.set(userId, threadId);
}

module.exports = {
    getThreadId,
    setThreadId,
}
