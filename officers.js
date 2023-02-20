const buildings = require('buildings')
const tasks = require('tasks')
const units = require('units')
const MAX_PEON = 10;

const Superviseur = (room) => {
    buildings.Graveyards();
    buildings.Sensors(room);
    //console.log('analyzing tasks');

    for (let source in room.memory.sources) {
        let isSourceUsed = _.filter(Game.creeps, creep => creep.memory.taskTarget == room.memory.sources[source]);
        if (isSourceUsed.length == 0) {
            Contremaitre('harvest', room, room.memory.sources[source]);
        }
    }

    for (let constructionSite in room.memory.constructionSites) {
        let isConstSiteUsed = _.filter(Game.creeps, creep => creep.memory.taskTarget == room.memory.constructionSites[constructionSite]);
        if (isConstSiteUsed.length < 1) {
            Contremaitre('build', room, room.memory.constructionSites[constructionSite]);
        }
    }

    for (let worker in Game.creeps) {
        if (Game.creeps[worker].memory.task == undefined) {
            Game.creeps[worker].memory.task = 'idle';
        }
        if (_.filter(Game.creeps, worker => worker.memory.task == 'upgrade').length < 5) {
            Contremaitre('upgrade', room, room.controller.id)
        }

        Manager(room);
    }
}

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
                worker.memory.taskTarget = target;
                break;
            case 'build':
                worker.memory.task = 'build';
                worker.memory.taskTarget = target;
                break;
        }
    } else {
        let numberOfWorkers = room.memory.creeps.length;
        const bodyCost = _.sum(units.Peon.body, part => BODYPART_COST[part]);
        const spawner = Game.spawns[room.memory.spawns[0]];
        if (numberOfWorkers < MAX_PEON && bodyCost < spawner.store[RESOURCE_ENERGY]) {
            buildings.Barracks(units.Peon, spawner);
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
            case 'build':
                tasks.Build(worker);
                break;
        }
    }
}

    module.exports = { Contremaitre, Superviseur }

