/// <reference types="@workadventure/iframe-api-typings" />

import { isLeader } from "../../src/werewolves/main";
import { acceptableTimeOut } from "../../src/werewolves/variable";

async function addNewAttendee(player){
    const playerList = document.getElementById("characters");

    const divAvatar = document.createElement('div');
    divAvatar.classList.add('flex');
    divAvatar.classList.add('flex-col');
    divAvatar.classList.add('justify-center');
    divAvatar.classList.add('items-center');

    const pAvatar = document.createElement('p');
    pAvatar.classList.add('text-white');
    pAvatar.innerText = player.name;
    pAvatar.id = player.uuid;

    const imgAvatar = document.createElement('img');
    imgAvatar.classList.add('w-24');
    imgAvatar.classList.add('h-24');
    imgAvatar.classList.add('rounded-full');
    imgAvatar.src = "/player-avatar.jpg";

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

function updateLeader(){
    // Add leader mention to the player
    // @ts-ignore
    const playerElement = document.getElementById(WA.state.leaderUuid);
    if(playerElement) {
        playerElement.innerText = playerElement.innerText + ' (leader)';
        playerElement.classList.add('font-bold');
    }

    const startGameElement = document.getElementById('start-game');

    if(isLeader()) {
        if(startGameElement) startGameElement.classList.remove('hidden');

        const startGameButton = document.getElementById('start-game-button');
        if(startGameButton) startGameButton.addEventListener('click', allocateRoles);
    }else{
        if(startGameElement) startGameElement.classList.add('hidden');

        const startGameButton = document.getElementById('start-game-button');
        if(startGameButton) startGameButton.removeEventListener('click', allocateRoles);
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

function setTimeoutToupdateAttendeesList(){
    setTimeout(() => {
        updateAttendeesList();
        setTimeoutToupdateAttendeesList();
    }, 5000);
}

WA.onInit().then(async () => {
    console.info('Initiate Waiting Room');

    if(!WA.state.startGame) {
        WA.ui.modal.closeModal();
        return;
    }

    await WA.players.configureTracking();
    setTimeout(() => {
         updateAttendeesList();
    }, acceptableTimeOut)
    setTimeoutToupdateAttendeesList();
    WA.players.onPlayerEnters.subscribe(() => {
        updateAttendeesList();
    });
    WA.players.onPlayerLeaves.subscribe(() => {
        updateAttendeesList();
    });

    updateLeader();
    WA.state.onVariableChange('leaderUuid').subscribe(() => {
        updateLeader();
    });
});