/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initGame } from "./werewolves/main";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    var nightSound = WA.sound.loadSound("night.mp3");
    var daySound = WA.sound.loadSound("day.mp3");
    var config = {
        volume : 1,
        loop : false,
        rate : 1,
        detune : 1,
        delay : 0,
        seek : 0,
        mute : false
    }
    WA.ui.actionBar.addButton({
        id: 'night-btn',
        // @ts-ignore
        label: 'LA NUIT TOMBE',
        callback: () => {
            WA.room.hideLayer('Day');
            WA.room.hideLayer('DayItems');
            WA.room.showLayer('Night');
            WA.room.showLayer('NightItems');
            daySound.stop();
            nightSound.play(config);
        }
    });
    WA.ui.actionBar.addButton({
        id: 'day-btn',
        // @ts-ignore
        label: 'LE JOUR SE LÈVE',
        callback: () => {
            WA.room.showLayer('Day');
            WA.room.showLayer('DayItems');
            WA.room.hideLayer('Night');
            WA.room.hideLayer('NightItems');
            nightSound.stop();
            daySound.play(config);
        }
    });

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(async () => {
        console.log('Scripting API Extra ready');

        // Init the loup garou game
        initGame();
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};
