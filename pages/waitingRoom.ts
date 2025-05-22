import { isLeader, role } from "../../src/werewolves";
import { acceptableTimeOut, host } from "../../src/werewolves/variable";

async function addNewAttendee(player){
    const playerList = document.getElementById("characters");

    const divAvatar = document.createElement('div');
    divAvatar.classList.add('flex');
    divAvatar.classList.add('flex-col');
    divAvatar.classList.add('justify-center');
    divAvatar.classList.add('items-center');

    const pAvatar = document.createElement('p');
    pAvatar.classList.add('text-white');
    pAvatar.innerText = `${player.uuid === WA.player.uuid ? 'Vous' :player.name}${player.uuid === WA.state.leaderUuid ? ' (leader)' : ''}`;
    pAvatar.id = player.uuid;

    const imgAvatar = document.createElement('img');
    imgAvatar.classList.add('w-24');
    imgAvatar.classList.add('h-24');
    imgAvatar.classList.add('rounded-full');
    imgAvatar.src = `${host}/player-avatar.jpg`;

    divAvatar.appendChild(imgAvatar);
    divAvatar.appendChild(pAvatar);
    
    playerList?.appendChild(divAvatar);
}

function updateAttendeesList(){
    const playerList = document.getElementById("characters");
    if(playerList) playerList.innerHTML = '';

    addNewAttendee(WA.player);
    const players = WA.players.list();
    console.log('players', players);
    for (const player of players) {
        addNewAttendee(player);
    }
}

function setError(error){
    const errorElement = document.getElementById('error-message');
    if(errorElement == undefined) {
        console.error("Error element not found");
        return;
    }
    if(error != undefined) errorElement.innerText = error;
    else errorElement.innerText = "";
}

function allocateRoles(){
    // check that player are minimum 4
    const players = Array.from(WA.players.list());
    console.log("Players: ", players.length);
    if(players.length < 4) {
        setError("Vous devez être au moins 4 joueurs pour commencer la partie");
        return;
    }else setError(undefined);
    // allocate role to all players

    // calculate the number of players
    const numberOfPlayers = players.length;
    // calculate the number of wolf (20% of players)
    let numberOfWolves = Math.floor(numberOfPlayers * 0.2);
    if(numberOfWolves < 1) {
        numberOfWolves = 1;
    }
    console.log('Number of wolves: ', numberOfWolves);

    // create matrix of roles with wolvers, villagers and youngirl
    const roles = ["younGirl"];
    for (let i = 0; i < numberOfWolves; i++) {
        roles.push('wolf');
    }
    for (let i = 0; i < (numberOfPlayers -1) - numberOfWolves; i++) {
        roles.push('villager');
    }

    console.log("Roles: ", roles);
    roles.sort(() => Math.random() - 0.5); // shuffle the roles
    console.log("Roles shuffled: ", roles);

    // assign roles to players
    const villagers = [];
    const werewolfs = [];
    let yougGirl = "";
    const leader = WA.player.uuid;
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const role = roles[i];
        if(role === 'wolf') {
            // @ts-ignore
            werewolfs.push(player.uuid);
        }else if(role === 'villager') {
            // @ts-ignore
            villagers.push(player.uuid);
        }else if(role === 'younGirl') {
            yougGirl = players[i].uuid;
        }
    }

    WA.state.saveVariable("roles", {
        villagers, 
        werewolfs,
        yougGirl,
        leader
    });
    WA.ui.modal.closeModal();
}

function addNewRole(role_, nb){
    const divRole = document.createElement('div');
    divRole.classList.add('flex');
    divRole.classList.add('flex-col');
    divRole.classList.add('justify-center');
    divRole.classList.add('items-center');

    const pRole = document.createElement('p');
    pRole.classList.add('text-white');
    pRole.innerText = `${role_} (${nb})`;
    pRole.id = role_;

    const imgRole = document.createElement('img');
    imgRole.classList.add('w-24');
    imgRole.classList.add('h-24');
    imgRole.classList.add('rounded-full');

    switch (role_) {
        case role.leader:
            imgRole.src = `${host}/player-avatar.jpg`;
            pRole.innerText = `Leader (${nb})`;
            break;
        case role.wolf:
            imgRole.src = `${host}/werewolf-illustration.jpg`;
            pRole.innerText = `Loup garou (${nb})`;
            break;
        case role.villager:
            imgRole.src = `${host}/villager-illustration.jpg`;
            pRole.innerText = `Villageoi (${nb})`;
            break;
        case role.youggirl:
            imgRole.src = `${host}/younggirl-illustration.jpg`;
            pRole.innerText = `Petite fille (${nb})`;
            break;
    }

    divRole.appendChild(imgRole);
    divRole.appendChild(pRole);
    return divRole;
}

function updateRolesList(){
    const numberOfPlayers = Array.from(WA.players.list()).length;
    if(Array.from(WA.players.list()).length >= 4) {
        // calculate the number of wolf (20% of players)
        let numberOfWolves = Math.floor(numberOfPlayers * 0.2);
        if(numberOfWolves < 1) numberOfWolves = 1;

        // Reset the game roles
        const gameRoles = document.getElementById("game-roles");
        if (gameRoles) gameRoles.innerHTML = '';

        const gameInstructions = document.getElementById("game-instructions");
        if (gameInstructions) gameInstructions.innerText = `Il y a ${numberOfPlayers} joueurs dans la partie soit 1 petite fille, ${numberOfPlayers - numberOfWolves} villageois et ${numberOfWolves} loups garous`;

        gameRoles?.appendChild(addNewRole(role.youggirl, 1));
        gameRoles?.appendChild(addNewRole(role.villager, numberOfPlayers - numberOfWolves));
        gameRoles?.appendChild(addNewRole(role.wolf, numberOfWolves));
    }else{
        const gameRoles = document.getElementById("game-roles");
        if(gameRoles) gameRoles.innerHTML = '';

        const gameInstructions = document.getElementById("game-instructions");
        if (gameInstructions) gameInstructions.innerHTML = `Il manque (${4 - numberOfPlayers}) joueurs pour commencer la partie`;
    }
}

function setTimeoutToupdateAttendeesList(){
    setTimeout(() => {
        updateAttendeesList();
        updateRolesList();
        setTimeoutToupdateAttendeesList();
    }, 5000);
}

WA.onInit().then(async () => {
    console.info('Initiate Waiting Room');

    if(!WA.state.startGame) {
        WA.ui.modal.closeModal();
        return;
    }

    const divStartGame = document.getElementById('start-game');
    const buttonStartGame = document.getElementById('start-game-button');
    if(isLeader()){
        divStartGame?.classList.remove('hidden');
        buttonStartGame?.addEventListener('click', allocateRoles);
    }else{
        divStartGame?.classList.add('hidden');
        buttonStartGame?.removeEventListener('click', allocateRoles);
    }

    await WA.players.configureTracking();
    setTimeout(() => {
         updateAttendeesList();
          updateRolesList();
    }, acceptableTimeOut)
    setTimeoutToupdateAttendeesList();
    WA.players.onPlayerEnters.subscribe(() => {
        updateAttendeesList();
        updateRolesList();
    });
    WA.players.onPlayerLeaves.subscribe(() => {
        updateAttendeesList();
         updateRolesList();
    });
});