const buildings = require('buildings')
const tasks = require('tasks')
const units = require('units')
const MAX_PEON = 15;

const Superviseur = (room) => {
    buildings.Graveyards();
    buildings.Sensors(room);
    //console.log('analyzing tasks');

    for (let source in room.memory.sources) {
        let isSourceUsed = _.filter(Game.creeps, creep => creep.memory.taskTarget == room.memory.sources[source]);
        if (isSourceUsed.length < 1) {
            Contremaitre('Miner', 'harvest', room, room.memory.sources[source]);
        }
    }

    for (let droppedEnergy in room.memory.dropped) {
        let isDroppedEnergyReserved = _.filter(Game.creeps, creep => creep.memory.taskTarget == room.memory.dropped[droppedEnergy]);
        if(isDroppedEnergyReserved.length < 1) {
            Contremaitre('Hauler', 'haul', room, room.memory.dropped[droppedEnergy]);
        }
    }

    for (let constructionSite in room.memory.constructionSites) {
        let isConstSiteUsed = _.filter(Game.creeps, creep => creep.memory.taskTarget == room.memory.constructionSites[constructionSite]);
        if (isConstSiteUsed.length < 1 && _.filter(Game.creeps, worker => worker.memory.task == 'build').length < 5) {
            Contremaitre('Builder', 'build', room, room.memory.constructionSites[constructionSite]);
        }
    }

    for (let worker in Game.creeps) {
        if (!Game.getObjectById(Game.creeps[worker].memory.taskTarget)) {
            Game.creeps[worker].memory.task = 'idle';
        }
        if (_.filter(Game.creeps, worker => worker.memory.task == 'upgrade').length < 5) {
            Contremaitre('Upgrader', 'upgrade', room, room.controller.id)
        }
        Manager(room);
    }
}

const Contremaitre = (unitType, task, room, target) => {
    //console.log('planning tasks');
    let idleWorkers = [];
    for (let creep of room.memory.creeps) {
        let worker = Game.creeps[creep];
        if (worker.memory.task == 'idle') {
            idleWorkers.push(worker);
        } 
    } 
    console.log(_.filter(idleWorkers, worker => worker.memory.type == unitType))
    if (_.filter(idleWorkers, worker => worker.memory.type == unitType).length > 0) {
        let worker = Game.creeps[idleWorkers[0].name];
        switch (task) {
            case 'harvest':
                worker.memory.task = 'harvest';
                worker.memory.taskTarget = target;
                break;
            case 'haul':
                worker.memory.task = 'haul';
                worker.memory.taskTarget = target;
                break;
            case 'upgrade':
                worker.memory.task = 'upgrade';
                worker.memory.taskTarget = target;
                break;
            case 'build':
                worker.memory.task = 'build';
                worker.memory.taskTarget = target;
                break;
        }
    } else {
        let numberOfWorkers = room.memory.creeps.length;
        const bodyCost = _.sum(units[unitType].body, part => BODYPART_COST[part]);
        let spawner = Game.spawns[room.memory.spawns[0]];
        if (numberOfWorkers < MAX_PEON) {
            if (bodyCost <= room.energyAvailable) {
                buildings.Barracks(units[unitType], spawner);
            }
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
            case 'haul':
                tasks.Haul(worker);
                break;
            case 'upgrade':
                tasks.Upgrade(worker);
                break;
            case 'build':
                tasks.Build(worker);
                break;
        }
    }
}

    module.exports = { Contremaitre, Superviseur }

