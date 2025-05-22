import { Sound } from "@workadventure/iframe-api-typings";
import { isLeader, role } from ".";
import { acceptableTimeOut, host } from "./variable";

export class DayScene {
    private sound: Sound;
    private config: any;

    private showLayers = ['Day', 'DayItems'];

    private isActive = false;

    constructor() {
        this.sound = WA.sound.loadSound("day.mp3");
        this.config = {
            volume: 1,
            loop: false,
            rate: 1,
            detune: 1,
            delay: 0,
            seek: 0,
            mute: false
        };
    }

    public start() {
        this.showLayers.forEach(layer => WA.room.showLayer(layer));

        WA.ui.modal.closeModal();
        WA.ui.actionBar.removeButton('day-btn');
        this.sound.play(this.config);

        // Open the popup
        const asset = `${host}/pages/day`;
        let src = `${asset}/villagerInstruction.html`;
        switch (WA.player.state.role) {
            case role.wolf:
                src = `${asset}/wolfInstruction.html`;
                break;
            case role.hunter:
                src = `${asset}/hunterInstruction.html`;
                break;
            case role.leader:
                src = `${asset}/leaderInstruction.html`;
                break;
            case role.youggirl:
                src = `${asset}/younggirlInstruction.html`;
                break;
            case role.villager:
                src = `${asset}/villagerInstruction.html`;
                break;
        }

        console.log("start Day", src);
        setTimeout(() => {
            WA.ui.modal.openModal({
                allowApi: true,
                position: "left",
                allow: "fullscreen",
                src: src,
                title: "Day"
            });
        }, acceptableTimeOut);

        if(isLeader())
            WA.ui.actionBar.addButton({
                id: 'night-btn',
                // @ts-ignore
                label: 'LA NUIT TOMBE 🌛',
                callback: () => {
                    console.log("Night");
                    WA.state.day = false;
                    WA.state.night = true;
                }
            });
        
        this.isActive = true;
    }

    public end(){
        this.showLayers.forEach(layer => WA.room.hideLayer(layer));
        this.sound.stop();
        WA.ui.modal.closeModal();

        // Layer of the map
        WA.room.showLayer('Day');
        WA.room.showLayer('DayItems');
        if(WA.player.state.role === role.leader) WA.ui.actionBar.removeButton('night-btn');
        this.isActive = false;
    }

    get active() {
        return this.isActive;
    }
}