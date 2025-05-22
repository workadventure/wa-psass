// @ts-ignore
export const host = import.meta.env.MODE == 'development' ? "http://localhost:5173" : "https://workadventure.github.io/wa-psass";

export const acceptableTimeOut = 600;

export interface RolesState {
    villagers: string[];
    werewolfs: string[];
    yougGirl: string | undefined;
    leader: string | undefined;
}

export const initVariable = () => {
    if(WA.state.startGame === undefined) WA.state.saveVariable("startGame", false);
    if(WA.state.night === undefined) WA.state.saveVariable("night", false);
    if(WA.state.day === undefined) WA.state.saveVariable("day", false);
    if(WA.state.roles === undefined) WA.state.saveVariable("roles", {
        villagers: [],
        werewolfs: [],
        yougGirl: undefined,
        leader: undefined
    });
}

export const resetVariable = () => {
    WA.state.saveVariable("night", false);
    WA.state.saveVariable("day", false);
    WA.state.saveVariable("roles", undefined);
    WA.player.state.saveVariable('role', undefined, {
        public: false,
        persist: true,
        scope: 'room',
    });
    WA.state.saveVariable("startGame", false);
}
