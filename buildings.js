module.exports = {

    Barracks: function (unit, spawn) {
        //console.log('hatchery hatching');
        spawn.spawnCreep(unit.body, unit.type + Game.time, { memory: { type: unit.type, task: 'idle', working: false } });
    },

    Sensors: function (room) {
        //console.log('scanning room');
        let SOURCES = room.find(FIND_SOURCES);
        room.memory.sources = [];
        for (let sourceNumber in SOURCES) {
            room.memory.sources[sourceNumber] = SOURCES[sourceNumber].id;
        }
        
        let DROPPED_ENERGY = room.find(FIND_DROPPED_RESOURCES);
        room.memory.dropped = [];
        for (let droppedEnergyNumber in DROPPED_ENERGY) {
            room.memory.dropped.push(DROPPED_ENERGY[droppedEnergyNumber].id)
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

        let CONSTRUCTIONS_SITES = room.find(FIND_CONSTRUCTION_SITES);
        room.memory.constructionSites = []
        for (let constSiteId in CONSTRUCTIONS_SITES) {
            room.memory.constructionSites.push(CONSTRUCTIONS_SITES[constSiteId].id)
        }

        let numberOfHarvester = _.filter(Game.creeps, creep => creep.memory.task == 'harvest').length
        let numberOfUpgrader = _.filter(Game.creeps, creep => creep.memory.task == 'upgrade').length
        let numberOfBuilder = _.filter(Game.creeps, creep => creep.memory.task == 'build').length
        let numberOfHauler = _.filter(Game.creeps, creep => creep.memory.task == 'haul').length
        let numberOfWanker = _.filter(Game.creeps, creep => creep.memory.task == 'idle').length
        console.log(`harvester: ${numberOfHarvester} / hauler: ${numberOfHauler} / upgrader: ${numberOfUpgrader} / builder: ${numberOfBuilder} / idle: ${numberOfWanker}`)
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