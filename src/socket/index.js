const {socketInstance} = require("../../index");
const io = socketInstance;

const { imageResolve, userMemory, clearMemory, nameResolve } = require("../utils/resolvers");
const { appendMessage } = require("../utils/messageQueue");
const { joinMessage, disconnectionMessage } = require("../utils/randomMessage");

io.on("connection", client => {
   
    client.on("join", (data) => {
        userMemory(data, client.id);
        let message = joinMessage(data.user);
        io.to(client.id).emit("joined", { msg: `Welcome ${data.user}, hope you to 
            enjoy the party. Keep up the good ambient.` });
        client.broadcast.emit("event", { msg: message });
    });

    client.on("message", (data) => {
        data = imageResolve(data, client.id);
        appendMessage(data);
        io.sockets.emit("message", { data });
    });

    client.on("change", (data) => {
        let newName = nameResolve(client.id);
        appendMessage({ msg: `${data.user} now became ${newName}` });
        io.sockets.emit("event", { msg: `${data.user} now became ${newName}` });
    });

    client.on("writting", (data) => {
        let user = data.user;
        client.broadcast.emit("writting", { user });
    });

    client.on("write_stop", () => {
        client.broadcast.emit("write_stop", {});
    });

    client.on("disconnect", () => {
        let user = nameResolve(client.id);
        if(user) {
            let message = disconnectionMessage(user);
            appendMessage({ msg: message });
            io.sockets.emit("event", { msg: message });
            clearMemory(client.id);
        }
    });

});