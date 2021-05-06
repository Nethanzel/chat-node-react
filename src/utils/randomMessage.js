function disconnectionMessage(user) {
    let msgPos = getRandomInt(0, farewellMessages.length);
    let message = farewellMessages[msgPos];
    return message.replace("#", user);
}

function joinMessage(user) {
    let msgPos = getRandomInt(0, greetingMessages.length);
    let message = greetingMessages[msgPos];
    return message.replace("#", user);
}

let farewellMessages = [
    "Goodbye #! See you the next time",
    "# just left the party",
    "Well, that's all for #",
];

let greetingMessages = [
    "Everybody say hi to #",
    "# just joined the party!",
    "Say hi! # is here!"
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

  module.exports.joinMessage = joinMessage;
  module.exports.disconnectionMessage = disconnectionMessage;