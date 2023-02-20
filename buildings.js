module.exports = {

    Barracks: function (unit, spawn) {
        //console.log('hatchery hatching');
        spawn.spawnCreep(unit.body, unit.name, { memory: { type: unit.type, task: 'idle', working: false } });
    },

    Sensors: function (room) {
        //console.log('scanning room');
        let SOURCES = room.find(FIND_SOURCES);
        room.memory.sources = [];
        for (let sourceNumber in SOURCES) {
            room.memory.sources[sourceNumber] = SOURCES[sourceNumber].id;
        }

        let SPAWNS = room.find(FIND_MY_SPAWNS);
        room.memory.spawns = [];
        for (let spawnNumber in SPAWNS) {
            room.memory.spawns.push(SPAWNS[spawnNumber].name);
        }

        let CREEPS = room.find(FIND_MY_CREEPS);
        room.memory.creeps = [];
        for (let creepName in CREEPS) {
            room.memory.creeps.push(CREEPS[creepName].name)
        }
    },
    

    Graveyards: function () {
        //console.log('saying goodbye to fallen creeps')
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
}