const buildings = require('buildings')
const tasks = require('tasks')
const units = require('units')
const MAX_PEON = 10;


const Contremaitre = (task, room, target) => {
    //console.log('planning tasks');
    let idleWorkers = [];
    for (let creep of room.memory.creeps) {
        let worker = Game.creeps[creep];
        if (worker.memory.task == 'idle') {
            idleWorkers.push(worker);
        }
    }

    if (idleWorkers.length > 0) {
        let worker = Game.creeps[idleWorkers[0].name];
        switch (task) {
            case 'harvest':
                worker.memory.task = 'harvest';
                worker.memory.taskTarget = target;
                break;
            case 'upgrade': 
                worker.memory.task = 'upgrade';
                worker.memory.taskTarget = target.id;
                break;
        }
    }
}

const Manager = (room) => {
    //console.log('making worker do da job');
    for (let creep of room.memory.creeps) {
        let worker = Game.creeps[creep];
        switch (worker.memory.task) {
            case 'harvest': 
                tasks.Harvest(worker);
                break;
            case 'upgrade':
                tasks.Upgrade(worker);
                break;
        }
    }
}

const Superviseur = (room) => {
    buildings.Graveyards();
    buildings.Sensors(room);

    if (room.memory.creeps.length < MAX_PEON) {
        //console.log('spawning worker');
        buildings.Barracks(units.Peon, Game.spawns[room.memory.spawns[0]])
    }

    //console.log('analyzing tasks');

    for (let source in room.memory.sources) {
        let isSourceUsed = _.filter(Game.creeps, creep => creep.memory.taskTarget == room.memory.sources[source]);
        if (isSourceUsed.length <= 1) {
            Contremaitre('harvest', room, room.memory.sources[source]);
        }
    }

    for (let worker in Game.creeps) {
        if (Game.creeps[worker].memory.task == undefined) {
            Game.creeps[worker].memory.task = 'idle';
        }
        Contremaitre('upgrade', room, room.controller)
    }

    Manager(room);
}


module.exports = { Contremaitre, Superviseur }

