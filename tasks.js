module.exports = {

    Harvest: function (worker) {

        let source = Game.getObjectById(worker.memory.taskTarget);
        if (worker.store.getFreeCapacity() == 0) {
            worker.drop(RESOURCE_ENERGY);
            worker.say('dropping')
        }
        if (worker.harvest(source) == ERR_NOT_IN_RANGE) {
            worker.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            worker.say('harvesting')
        }
    },

    Upgrade: function (worker) {
        if (worker.memory.working && worker.store[RESOURCE_ENERGY] == 0) {
            worker.memory.working = false;
            worker.say('sweeping');
        }
        if (!worker.memory.working && worker.store.getFreeCapacity() == 0) {
            worker.memory.working = true;
            worker.say('upgrading');
        }

        if (worker.memory.working) {
            if (worker.upgradeController(worker.room.controller) == ERR_NOT_IN_RANGE) {
                worker.moveTo(worker.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            let target = worker.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (worker.pickup(target) == ERR_NOT_IN_RANGE) {
                worker.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },

    Build: function (worker) {

        let constructionSite = Game.getObjectById(worker.memory.taskTarget);

        if (worker.memory.working && worker.store[RESOURCE_ENERGY] == 0) {
            worker.memory.working = false;
            worker.say('sweeping');
        }
        if (!worker.memory.working && worker.store.getFreeCapacity() == 0) {
            worker.memory.working = true;
            worker.say('building');
        }

        if (worker.memory.working) {
            if (worker.build(constructionSite) == ERR_NOT_IN_RANGE) {
                worker.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            let target = worker.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (worker.pickup(target) == ERR_NOT_IN_RANGE) {
                worker.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },

    Haul: function (worker) {
        let target = Game.getObjectById(worker.memory.taskTarget);
        //console.log(target)
        if (worker.memory.working && worker.store[RESOURCE_ENERGY] == 0) {
            worker.memory.working = false;
            worker.say('sweeping');
        }
        if (!worker.memory.working && worker.store.getFreeCapacity() == 0) {
            worker.memory.working = true;
            worker.say('hauling');
        }

        if (!worker.memory.working) {
            if(worker.pickup(target) == ERR_NOT_IN_RANGE) {
                worker.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } })
            }
        } else {
            let stores = worker.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (stores.length > 0) {
                if (worker.transfer(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    worker.moveTo(stores[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else { worker.memory.task = 'idle'}
        }
        /*
        Repair: {
            
        }    
        
        Sweep: {
            
        }
        */
    }
}