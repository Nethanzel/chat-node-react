const fs = require("fs");
const path = require("path");

let messagesQueue = [];

function appendMessage(message) {
    message.date = timeResolver();
    messagesQueue.push(message);
    if(messagesQueue.length > parseInt(process.env.Q_MAX)) {
        while (messagesQueue.length > parseInt(process.env.Q_MAX)) {
            let removedMessage = messagesQueue.shift();
            if(removedMessage.content) {
                let fileName = "";
                fileName = removedMessage.content;
                fileName = fileName.slice(fileName.lastIndexOf("/"), fileName.length);
                fs.unlinkSync(path.resolve("./src/uploads" + fileName));
            }
        }
    }
}

function getMessageQueue() {
    return messagesQueue;
}

const timeResolver = () => {
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    hour = hour > 9 ? hour : "0" + hour;
    minute = minute > 9 ? minute : "0" + minute;
    return `${hour}:${minute}`;
}

module.exports.appendMessage = appendMessage;
module.exports.getMessageQueue = getMessageQueue;