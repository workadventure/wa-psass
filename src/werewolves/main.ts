import { DayScene } from "./DayScene";
import { NightScene } from "./NightScene";
import { RoleScene } from "./RoleScene";
import { acceptableTimeOut, host, initVariable } from "./variable";

export const role = {
    wolf: "WOLF",
    hunter: "HUNTER",
    villager: "VILLAGER",
    youggirl: "YOUNGGIRL",
    leader: "LEADER",
}

export const isLeader = () => {
    return WA.state.leaderUuid != undefined && WA.state.leaderUuid === WA.player.uuid;
}

export const isVillager = (role_: string) => {
    return role_ === role.villager;
}

export const isWolf = (role_: string) => {
    return role_ === role.wolf;
}

export const isYoungGirl = (role_: string) => {
    return role_ === role.youggirl;
}

// Open the role view
let roleView: RoleScene | undefined;
function toggleRoleView(toggleValue: boolean) {
    if(roleView == undefined) {
        roleView = new RoleScene();
    }

    if(toggleValue == false && roleView.active == true) {
        roleView.end();
    }else if (toggleValue == true && roleView.active == false) {
        roleView.start();
    }
}

// Open the waiting view
function openWaitingView() {
    WA.ui.modal.openModal({
        allowApi: true,
        position: "center",
        allow: "fullscreen",
        src: `${host}/pages/waitingRoom.html`,
        title: "Waiting Room",
    });
}

function addButtonCreateGame(){
    // Close button if it exists
    WA.ui.actionBar.removeButton('game-btn');
    WA.ui.actionBar.removeButton('night-btn');
    WA.ui.actionBar.removeButton('day-btn');
    setTimeout(() => {
        // Add button to start the game
        WA.ui.actionBar.addButton({
            id: 'game-btn',
            // @ts-ignore
            label: 'Loup garou 🐺',
            callback: async () => {
                await WA.state.saveVariable('leaderUuid', WA.player.uuid);
                WA.state.startGame = true;
                openWaitingView();
            }
        });
    }, acceptableTimeOut);
}

function addButtonEndGame(){
    // Close button if it exists
    WA.ui.actionBar.removeButton('game-btn');
    setTimeout(() => {
        // Add button to end the game
        WA.ui.actionBar.addButton({
            id: 'game-btn',
            // @ts-ignore
            label: 'Finir la partie ❌',
            callback: async () => {
                await WA.state.saveVariable('leaderUuid', undefined);
                WA.state.startGame = false;
            }
        });
    }, acceptableTimeOut);
}

// Open the night view
let nightScene: NightScene | undefined;
function toggleNightView(toggleValue: boolean) {
    console.log('toggleNightView', toggleValue, nightScene?.active);
    if(nightScene == undefined) {
        nightScene = new NightScene();
    }
    if(toggleValue == false && nightScene.active == true){
        nightScene.end();
    }else if(toggleValue == true && nightScene.active == false){
        nightScene.start();
    }
}

// Open the day view
let dayScene : DayScene | undefined;
function toggleDayView(toggleValue: boolean) {
    if(dayScene == undefined) {
        dayScene = new DayScene();
    }
    if(toggleValue == false && dayScene.active == true){
        dayScene.end();
    }else if(toggleValue == true && dayScene.active == false){
        dayScene.start();
    }
}

export function initGame(){
    initVariable();

    if( WA.player.state.role != undefined && WA.state.startGame) {
        // Restart the game
        if(WA.state.night) {
            toggleNightView(true);
        }else if(WA.state.day) {
            toggleDayView(true);
        }else{
            toggleRoleView(true);
        }

        // Add button to ends the game if the current player is the leader
        if(isLeader()) addButtonEndGame();
    }else if(WA.state.startGame) {
        // Open waiting view
        openWaitingView();

        // Add button to ends the game if the current player is the leader
        if(isLeader()) addButtonEndGame();
    }else{
        // Add button to start the game
        addButtonCreateGame();
    }
        

    WA.state.onVariableChange("startGame").subscribe((value) => {
        console.log("startGame => onVariableChange => ", value);
        if(value == true) {
            openWaitingView();
            // Add button to ends the game if the current player is the leader
            if(isLeader()) addButtonEndGame();
        } else {
            // Close all websites
            WA.ui.website.getAll().then((websites) => {
                websites.forEach((website) => {
                    website.close();
                });
            });
            // Close modal
            WA.ui.modal.closeModal();

            // Close all scene
            toggleRoleView(false);
            toggleDayView(false);
            toggleNightView(false);

            // add button create game
            addButtonCreateGame();
        }
    });
    WA.state.onVariableChange("night").subscribe((value) => {
        console.info("Is the Night", value);
        toggleNightView(value as boolean);
    });
        WA.state.onVariableChange("day").subscribe((value) => {
        console.info("Is the Day", value);
        toggleDayView(value as boolean);
    });
    WA.state.onVariableChange("roles").subscribe((value) => {
        console.log("roles => onVariableChange => ", value);
        const { villagers, werewolfs, yougGirl, leader } = value as { villagers: any; werewolfs: any; yougGirl: any; leader: any };
        // Add logic here to handle members and werewolfs
        let role_ = undefined;
        if(werewolfs.includes(WA.player.uuid)) role_ = role.wolf;
        else if(villagers.includes(WA.player.uuid)) role_ = role.villager;
        else if(yougGirl === WA.player.uuid) role_ = role.youggirl;
        else if(leader === WA.player.uuid) role_ = role.leader;
        WA.player.state.saveVariable('role', role_ ,{
            public: false,
            persist: true,
            scope: 'room',
        });

        // Close waiting modal
        WA.ui.modal.closeModal();

        // Open role view
        toggleRoleView(true);

        if(isLeader())
            WA.ui.actionBar.addButton({
                id: 'night-btn',
                // @ts-ignore
                label: 'LA NUIT TOMBE 🌛',
                callback: () => {
                    console.log("Night");
                    WA.state.saveVariable('day', false);
                    WA.state.saveVariable('night', true);
                }
            });
    });
}
