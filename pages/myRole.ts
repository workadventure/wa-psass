/// <reference types="@workadventure/iframe-api-typings" />

import { host } from "../../src/werewolves/variable";
import { isLeader, isVillager, isWolf, isYoungGirl, role } from "../../src/werewolves/main";

function initMyRoleCard(){
    const img = document.getElementById('my-role');
    const roleDescription = document.getElementById('role-description');
    const roleTitle = document.getElementById('role-title');
    if(!img || !roleDescription || !roleTitle) return;

    const role = WA.player.state.role;
    // @ts-ignore
    if(isWolf(role)) {
        // @ts-ignore
        img.src = `${host}/werewolf-illustration.jpg`;
        roleDescription.innerText = "Chaque nuit, tu te réveilleras en secret avec les autres Loups-Garous pour choisir une victime. Ton objectif est d’éliminer tous les Villageois sans te faire démasquer.";
        roleTitle.innerText = "Tu es un Loup-Garou 🐺";
    }
    // @ts-ignore
    if (isVillager(role)) {
        // @ts-ignore
        img.src = `${host}/villager-illustration.jpg`;
        roleDescription.innerText = "Tu ne possèdes aucun pouvoir spécial, mais ta force est dans la discussion et la déduction. Ton but est de découvrir et éliminer les Loups-Garous.";
        roleTitle.innerText = "Tu es un Villageois 👨‍🌾";
    }
    // @ts-ignore
    if (isYoungGirl(role)) {
        // @ts-ignore
        img.src = `${host}/younggirl-illustration.jpg`;
        roleDescription.innerText = "La nuit, tu peux discrètement espionner les Loups-Garous pendant leur réunion. Mais attention ! Si tu te fais repérer, tu risques d’être leur prochaine cible…";
        roleTitle.innerText = "Tu es la Petite Fille 👧";
    }
    if (isLeader()) {
        // @ts-ignore
        img.src = `${host}/player-avatar.jpg`;
        roleDescription.innerText = "Tu diriges le rythme du jeu (passage jour/nuit, validation des votes, etc.).";
        roleTitle.innerText = "Tu es le Leader 🎩";
    }
}

WA.onInit().then(() => {
    console.info('Initiate MyRole Room');

    initMyRoleCard();
    WA.player.state.onVariableChange('role').subscribe((role) => {
        initMyRoleCard()
    });
});