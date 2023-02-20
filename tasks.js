module.exports = {

    Harvest: function(worker) {

        let source = Game.getObjectById(worker.memory.taskTarget);

        if(worker.memory.working && worker.store[RESOURCE_ENERGY] == 0 ) {
            worker.memory.working = false;
            worker.say('harvest');
        }
        if(!worker.memory.working && worker.store.getFreeCapacity() == 0) {
            worker.memory.working = true;
            worker.say('haul');
        }
        if (!worker.memory.working) {
            if(worker.harvest(source) == ERR_NOT_IN_RANGE) {
                worker.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
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

            if(stores.length > 0) {
                if(worker.transfer(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    worker.moveTo(stores[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },
    
    Upgrade: function(worker) {
        if(worker.memory.working && worker.store[RESOURCE_ENERGY] == 0) {
            worker.memory.working = false;
            worker.say('🔄 harvest');
        }
        if(!worker.memory.working && worker.store.getFreeCapacity() == 0) {
            worker.memory.working = true;
            worker.say('⚡ upgrade');
        }

        if(!worker.memory.working) {
                var sources = worker.room.find(FIND_SOURCES);
                if(worker.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    worker.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
        }
        else {
            if(worker.upgradeController(worker.room.controller) == ERR_NOT_IN_RANGE) {
                worker.moveTo(worker.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    /*
    Build: {
        
    }
    
    Repair: {
        
    }
    
    Haul: {
        
    }
    
    Sweep: {
        
    }
    */
}