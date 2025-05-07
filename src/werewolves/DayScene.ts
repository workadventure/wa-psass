import { Sound } from "@workadventure/iframe-api-typings";
import { role } from "./main";

export class DayScene {
    private sound: Sound;
    private config: any;

    private showLayers = ['Day', 'DayItems'];

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
        this.sound.play(this.config);

        // Open the popup
        let src = "pages/day/villagerInstruction.html";
        switch (WA.player.state.role) {
            case role.wolf:
                src = "pages/day/wolfInstruction.html";
                break;
            case role.hunter:
                src = "pages/day/hunterInstruction.html";
                break;
            case role.leader:
                src = "pages/day/leaderInstruction.html";
                break;
            case role.youggirl:
                src = "pages/day/younggirlInstruction.html";
                break;
        }

        WA.ui.modal.openModal({
            allowApi: true,
            position: "center",
            allow: "fullscreen",
            src: src,
            title: "Day"
        });
    }

    public end(){
        this.showLayers.forEach(layer => WA.room.hideLayer(layer));
        this.sound.stop();
        WA.ui.modal.closeModal();
    }
}