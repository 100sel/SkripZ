const officers = require('officers');

module.exports.loop = () => {
    //console.log(Game.time)
    for(roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        officers.Superviseur(room);
    }
}