let userMap = new Map();

const path = require("path");
const fs = require("fs");

function imageResolve(data, client) {
    let user = userMap.get(client);
    if (user) {
        if(fs.existsSync(path.resolve(`./src/profiles/${user.img}`))) {
            return {...data, img: `${process.env.HOST}/api/user/${user.img}`};
        } return {...data, img: `${process.env.HOST}/api/user/unkuser.jpg`};
    } else return {...data, img: `${process.env.HOST}/api/user/unkuser.jpg`};
}

function imageSetter(user) {
    userMap.forEach( (value, key) => {
        if(value.user === user.user) {
            user.img ? value.img = user.img : value.img = "unkuser.jpg";
            userMap.set(key, value);
        }
    });
}

function userMemory(data, client) {
    userMap.set(client, data);
}

function userExist(client) {
    let exist = userMap.has(client);
    return exist;
}

function userExistbyUsername(name) {
    let counter = 0;
    userMap.forEach( (value) => {
        if(value.user.toLowerCase() === name.toLowerCase()) {
            counter++;
        }
    });
    return counter > 0 ? true : false;
}

function clearMemory(client) {
    let user = userMap.get(client);
    
    if(user.img !== "unkuser.jpg") {
        user ? fs.unlinkSync(path.resolve(`./src/profiles/${user.img}`)) : undefined;
    }
    userMap.delete(client);
}

function updateMemory(newUser) {
    if(userMap.has(newUser.id)) {
        let user = userMap.get(newUser.id);
        let currentImage = user.img;
        if(newUser.user !== "undefined") { user.user = newUser.user }
        if(newUser.img !== "undefined") {
            user.img = newUser.img
            if(currentImage !== "unkuser.jpg") {
                fs.unlinkSync(path.resolve("./src/profiles/" + currentImage))
            }
        }
        userMap.set(newUser.id, user);
    }
}

function nameResolve(client) {
    let user = userMap.get(client);
    return user ? user.user : undefined;
}

module.exports.imageResolve = imageResolve;
module.exports.userMemory = userMemory;
module.exports.clearMemory = clearMemory;
module.exports.updateMemory = updateMemory;
module.exports.nameResolve = nameResolve;
module.exports.imageSetter = imageSetter;
module.exports.userExist = userExist;
module.exports.userExistbyUsername = userExistbyUsername;