import { Sound } from "@workadventure/iframe-api-typings";
import { isLeader, role } from ".";
import { acceptableTimeOut, host } from "./variable";

export class NightScene {
    private sound: Sound;
    private config: any;

    private showLayers = ['Night', 'NightItems'];
    private isActive = false;

    constructor() {
        this.sound = WA.sound.loadSound("night.mp3");
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

    public async start() {
        // Layer of the map
        this.showLayers.forEach(layer => WA.room.showLayer(layer))
        
         WA.ui.modal.closeModal();
         WA.ui.actionBar.removeButton('night-btn');

        this.sound.play(this.config);

        // Open the popup
        const asset = `${host}/pages/night`;
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

        setTimeout(() => {
            WA.ui.modal.openModal({
                allowApi: true,
                position: "left",
                allow: "fullscreen",
                src: src,
                title: "Night"
            });
        }, acceptableTimeOut);

        if(isLeader())
            WA.ui.actionBar.addButton({
                id: 'day-btn',
                // @ts-ignore
                label: 'LE JOUR SE LÈVE ☀️',
                callback: () => {
                    WA.state.day = true;
                    WA.state.night = false;
                }
            });

        this.isActive = true;
    }

    public end(){
        this.showLayers.forEach(layer => WA.room.hideLayer(layer));
        console.log("this sound", this.sound);
        this.sound.stop();
        WA.ui.modal.closeModal();
        if(WA.player.state.role === role.leader) WA.ui.actionBar.removeButton('day-btn');
        this.isActive = false;
    }

    get active(){
        return this.isActive;
    }
}