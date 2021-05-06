const router = require("express").Router();
const express = require("express");

const path = require("path");
const fs = require("fs");

const { imageSetter, imageResolve, userExist, updateMemory, userExistbyUsername } = require("../utils/resolvers");
const { getMessageQueue, appendMessage } = require("../utils/messageQueue");

const socket = require("../../index");

router.post("/profile", (req, res) => {
    let user = req.fields;
    let image = req.files.img;

    if(!user.user) {
        return res.status(400).send();
    }
    
    if(userExistbyUsername(user.user)) {
        return res.status(401).send();
    }

    if(image) {
        let profiles = path.resolve("./src/profiles/");
        let ext = image.name.slice(image.name.lastIndexOf("."), image.name.length)
        let newName = String(new Date().getTime()) + ext;
        let imgProfile = path.join(profiles, newName);
        user.img = newName;
        fs.copyFileSync(path.resolve(image.path), imgProfile);
        setTimeout(() =>{fs.unlinkSync(image.path)}, 5000)
    } else {
        user.img = undefined;
    }
    
    setTimeout( () => { imageSetter(user) }, 1000);
    res.status(204).send();
});

router.post("/upload", (req, res) => {
    let user = req.fields;
    let image = req.files.img;

    if(!user.user) {
        return res.status(400).send();
    }

    if(image) {
        let uploads = path.resolve("./src/uploads/");
        let ext = image.name.slice(image.name.lastIndexOf("."), image.name.length)
        let newName = String(new Date().getTime()) + ext;
        let file = path.join(uploads, newName);
 
        fs.copyFileSync(path.resolve(image.path), file);

        let data = imageResolve(user, user.id);
        data.content = `${process.env.HOST}/api/uploads/${newName}`;
        delete data.id;
        
        appendMessage(data);
        socket.socketInstance.sockets.emit("message", { data });
        res.status(204).send();

        setTimeout(() =>{fs.unlinkSync(image.path)}, 2500)
    } else {
        return res.status(400).send();
    }
});

router.get("/queue/:user", (req, res) => {
    let user = req.params;

    if(!user.user) {
        return res.status(400).send();
    }

    if(userExist(user.user)) {
        res.status(200).send(getMessageQueue());
    } else res.status(401).send();
});

router.post("/update", (req, res) => {
    let user = req.fields;
    let image = req.files.img;

    if(!user.id) {
        return res.status(400).send();
    }

    if(image) {
        let profiles = path.resolve("./src/profiles/");
        let ext = image.name.slice(image.name.lastIndexOf("."), image.name.length)
        let newName = String(new Date().getTime()) + ext;
        let imgProfile = path.join(profiles, newName);
        user.img = newName;
        fs.copyFileSync(path.resolve(image.path), imgProfile);
        setTimeout(() =>{fs.unlinkSync(image.path)}, 5000)
    }
    
    updateMemory(user);
    res.status(204).send();
});

router.use("/user", express.static(path.resolve("./src/profiles/")));
router.use("/uploads", express.static(path.resolve("./src/uploads/")));

module.exports = router;