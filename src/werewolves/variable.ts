export const host = "http://localhost:5173";

export const initVariable = () => {
    WA.state.onVariableChange('startGame').subscribe((value) => {
        // Save the state of the game
        WA.player.state.isGaming = value;
        if(!value) return;

        // True
            // Play sound to start the game
            // Show waiting room for players
    });

    WA.state.onVariableChange('isDay').subscribe((newValue) => {
        // Play sound for the day
        // For everyone gamers
            // Show open your eyes to the players
        
        // For Leader
            // Show check that everyone has eyes open for the admin
            // Show instruction to say whos is dead
            // Show instruction to say whos is alive
            // Show instruction to vote
        
        WA.player.state.isDay = newValue;
    });

    WA.state.onVariableChange('isNight').subscribe((newValue) => {
        // Play sound for the night
        // For everyone
            // Show close your eyes to the players

        // For Leader
            // Show check that everyone has eyes closed for the admin
            // Show instruction to call wolfes
            // Show instruction to call hunter
            // Show instruction to end the turn
        
        
        WA.player.state.isDay = newValue;
    });

    WA.state.onVariableChange('isVoting').subscribe((newValue) => {
        // True
            // Play sound to vote
            // For everyone
                // Show vote to the players
            
            // For Leader
                // Show instruction to vote
                // Show data in the live board to appreciate the votes

        // False
            // Play sound to end the vote
            // For everyone
                // Show end vote to the players
            // For Leader
                // Show instruction to end the vote
                // Show data in the live board to appreciate the votes
        console.log('isVoting', newValue);
    });

    WA.state.onVariableChange('roles').subscribe((value) => {
        const { hunters, werewolfs } = value as { hunters: any; werewolfs: any };
        // Add logic here to handle members and werewolfs
        if(werewolfs.includes(WA.player.uuid)) WA.player.state.role = 'wolf';
        else if(hunters.includes(WA.player.uuid)) WA.player.state.role = 'hunter';
        else WA.player.state.role = 'villager';
    });

    WA.player.state.saveVariable('role', undefined, {
        public: false,
        persist: true,
        scope: 'room',
    });

    WA.player.state.saveVariable('isDead', false, {
        public: true,
        persist: true,
        scope: 'room',
    });

    WA.state.saveVariable("roles", {
        villagers: [],
        werewolfs: [],
        yougGirl: undefined,
        leader: undefined
    });
}

export const isLeader = () => {
    return WA.state.leaderUuid != undefined && WA.state.leaderUuid === WA.player.uuid;
}

export const isVillager = () => {
    return WA.player.state.role === 'villager';
}

export const isWolf = () => {
    return WA.player.state.role === 'wolf';
}

export const isYoungGirl = () => {
    return WA.player.state.role === 'youggirl';
}

export const siDay = () => {
    WA.state.isDay = true;
    WA.state.isNight = false;
}

export const siNight = () => {
    WA.state.isDay = false;
    WA.state.isNight = true;
}

export const isDead = () => {
    return WA.player.state.isDead;
};
