import { DayScene } from "./DayScene";
import { NightScene } from "./NightScene";
import { RoleScene } from "./RoleScene";
import { host, initVariable } from "./variable";

export const role = {
    wolf: "WOLF",
    hunter: "HUNTER",
    villager: "VILLAGER",
    youggirl: "YOUNGGIRL",
    leader: "LEADER",
}

const dayScene = new DayScene();
const nightScene = new NightScene();

// Open the role view
let roleView: RoleScene | undefined;
function openRoleView(newRole?: string) {
    if(newRole == undefined) {
        if(roleView) roleView.close();
        return;
    }

    roleView = new RoleScene();
}

// Open the waiting view
function openWaitingView(toggleValue: boolean) {
    if(!toggleValue){
        WA.ui.modal.closeModal();
        return;
    }

    WA.ui.modal.openModal({
        allowApi: true,
        position: "center",
        allow: "fullscreen",
        src: `${host}/pages/waitingRoom.html`,
        title: "Waiting Room"
    });
}

// Open the night view
function openNightView(toggleValue: boolean) {
    if(!toggleValue){
        nightScene.end();
        return;
    }
    nightScene.start();
}

// Open the day view
function openDayView(toggleValue: boolean) {
    if(!toggleValue){
        dayScene.end();
        return;
    }
    dayScene.start();
}

function endGameView(toggleValue: boolean) {
    if(!toggleValue){
        WA.ui.modal.closeModal();
        return;
    }
    WA.ui.modal.openModal({
        allowApi: true,
        position: "center",
        allow: "fullscreen",
        src: "/pages/endgame.html",
        title: "End Game"
    });
}

function voteView(toggleValue: boolean) {
    if(!toggleValue){
        WA.ui.modal.closeModal();
        return;
    }
    WA.ui.modal.openModal({
        allowApi: true,
        position: "center",
        allow: "fullscreen",
        src: "/pages/vote.html",
        title: "Vote"
    });
}

export function initGame(){
    initVariable();

    // Add button to start the game
    WA.ui.actionBar.addButton({
        id: 'game-btn',
        // @ts-ignore
        label: 'Create the game',
        callback: () => {
            WA.state.leaderUuid = WA.player.uuid;
            WA.state.startGame = true;
            openWaitingView(true);
        }
    });

    WA.state.onVariableChange("startGame").subscribe.bind(openWaitingView);
    WA.state.onVariableChange("night").subscribe.bind(openNightView);
    WA.state.onVariableChange("day").subscribe.bind(openDayView);
    WA.state.onVariableChange("role").subscribe.bind(openRoleView);
    WA.state.onVariableChange("vote").subscribe.bind(voteView);
    WA.state.onVariableChange("endGame").subscribe.bind(endGameView);
}
