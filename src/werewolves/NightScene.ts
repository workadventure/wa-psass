import { Sound } from "@workadventure/iframe-api-typings";
import { role } from "./main";

export class NightScene {
    private sound: Sound;
    private config: any;

    private showLayers = ['Night', 'NightItems'];

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

    public start() {
        this.showLayers.forEach(layer => WA.room.showLayer(layer));
        this.sound.play(this.config);

        // Open the popup
        let src = "pages/night/villagerInstruction.html";
        switch (WA.player.state.role) {
            case role.wolf:
                src = "pages/night/wolfInstruction.html";
                break;
            case role.hunter:
                src = "pages/night/hunterInstruction.html";
                break;
            case role.leader:
                src = "pages/night/leaderInstruction.html";
                break;
            case role.youggirl:
                src = "pages/night/younggirlInstruction.html";
                break;
        }

        WA.ui.modal.openModal({
            allowApi: true,
            position: "center",
            allow: "fullscreen",
            src: src,
            title: "Night"
        });
    }

    public end(){
        this.showLayers.forEach(layer => WA.room.hideLayer(layer));
        this.sound.stop();
        WA.ui.modal.closeModal();
    }
}