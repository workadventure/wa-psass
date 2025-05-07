/// <reference types="@workadventure/iframe-api-typings" />

import { RemotePlayerInterface } from "@workadventure/iframe-api-typings/front/Api/Iframe/Players/RemotePlayer";

function addNewAttendee(player: RemotePlayerInterface){
    const playerList = document.getElementById("characters");

    const divAvatar = document.createElement('div');
    divAvatar.classList.add('flex flex-col items-center');

    const pAvatar = document.createElement('p');
    pAvatar.classList.add('text-white');

    const imgAvatar = document.createElement('img');
    imgAvatar.classList.add('w-24 h-24 rounded-full');
    imgAvatar.src;

    divAvatar.appendChild(pAvatar);
    divAvatar.appendChild(imgAvatar);
    
    playerList?.appendChild(divAvatar);
}
WA.onInit().then(() => {
    console.info('Initiate Waiting Room');

    WA.state.onVariableChange('role').subscribe((roles) => {
        const {villagers, werewolfs, youggirl, leader} = roles as {werewolfs: string[], villagers: string[], youggirl: string, leader: string};
        for (const player of WA.players.list()) {
            if(
                werewolfs.includes(player.uuid) ||
                villagers.includes(player.uuid) ||
                youggirl === player.uuid ||
                leader === player.uuid
            ) addNewAttendee(player);
        }
    })
});