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
function openWaitingView() {
    WA.ui.modal.openModal({
        allowApi: true,
        position: "center",
        allow: "fullscreen",
        src: `${host}/pages/waitingRoom.html`,
        title: "Waiting Room",
    }, 
    () => {
        console.log("WA.state.startGame", WA.state.startGame);
        console.log("WA.state.leaderUuid", WA.state.leaderUuid);
    });
}

function addButtonCreateGame(){
    // Close button if it exists
    WA.ui.actionBar.removeButton('game-btn');
    setTimeout(() => {
        // Add button to start the game
        WA.ui.actionBar.addButton({
            id: 'game-btn',
            // @ts-ignore
            label: 'Create the game',
            callback: async () => {
                await WA.state.saveVariable('leaderUuid', WA.player.uuid);
                WA.state.startGame = true;
                openWaitingView();
                addButtonEndGame();
            }
        });
    }, 100);
}

function addButtonEndGame(){
    // Close button if it exists
    WA.ui.actionBar.removeButton('game-btn');
    setTimeout(() => {
        // Add button to end the game
        WA.ui.actionBar.addButton({
            id: 'game-btn',
            // @ts-ignore
            label: 'End the game',
            callback: async () => {
                await WA.state.saveVariable('leaderUuid', undefined);
                WA.state.startGame = false;
                WA.ui.modal.closeModal();
                addButtonCreateGame();
            }
        });
    }, 100);
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

    console.log("WA.state.startGame", WA.state.startGame);
    console.log("WA.state.leaderUuid", WA.state.leaderUuid);
    const startGame = WA.state.loadVariable('startGame');
    console.log("startGame", startGame);
    // Add button to start the game
    if(WA.state.leaderUuid == WA.player.uuid) addButtonEndGame();
    if(WA.state.startGame) {
        openWaitingView();
    } else {
        addButtonCreateGame();
    }


    WA.state.onVariableChange("startGame").subscribe(() => {
        if(WA.state.startGame) {
            openWaitingView();
            // remove button create game
            WA.ui.actionBar.removeButton('game-btn');
        } else {
            WA.ui.modal.closeModal();
            // add button create game
            addButtonCreateGame();
        }
    });
    WA.state.onVariableChange("night").subscribe((value) => {
        openNightView(value as boolean);
    });
    WA.state.onVariableChange("day").subscribe((value) => {
        openDayView(value as boolean);
    });
    WA.state.onVariableChange("vote").subscribe((value) => {
        voteView(value as boolean);
    });
    WA.state.onVariableChange("endGame").subscribe((value) => {
        endGameView(value as boolean);
    });
    WA.player.state.onVariableChange("role").subscribe((value) => {
        openRoleView(value as string);
    });
}
