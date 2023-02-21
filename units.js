module.exports = {
    
    BODYPART_COST: { 
        MOVE: 50, 
        WORK: 100, 
        ATTACK: 80, 
        CARRY: 50, 
        HEAL: 250, 
        RANGED_ATTACK: 150, 
        TOUGH: 10, 
        CLAIM: 600 
    },

    Peon: {
        body: [WORK, CARRY, MOVE],
        type: 'Peon',
        name: ''
    },

    Miner: {
        body: [WORK, WORK, WORK, MOVE],
        type: 'Miner',
        name: ''
    },

    Hauler: {
        body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        type: 'Hauler',
        name: ''
    },

    Upgrader: {
        body: [WORK, WORK, CARRY, MOVE],
        type: 'Upgrader',
        name: ''
    },

    Builder: {
        body: [WORK, CARRY, MOVE, MOVE],
        type: 'Builder',
        name: ''
    }
};