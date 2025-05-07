/// <reference types="@workadventure/iframe-api-typings" />

export const isLeader = () => {
    return WA.state.leaderUuid != undefined && WA.state.leaderUuid === WA.player.uuid;
}

export const isVillager = () => {
    return WA.player.state.role === 'villager';
}

export const isWolf = () => {
    return WA.player.state.role === 'wolf';
}

export const isYoungGirl = () => {
    return WA.player.state.role === 'youggirl';
}

WA.onInit().then(() => {
    console.info('Initiate Waiting Room');

    WA.player.state.onVariableChange('role').subscribe((role) => {
        const img = document.getElementById('my-role') as HTMLImageElement;
        img.classList.add('w-24', 'h-24', 'rounded-full');
        if(isWolf()) img.src = "../werewolf-illustration.jpg";
        if (isVillager()) img.src = "../hunter-illustration.jpg";
        if (isYoungGirl()) img.src = "../younggirl-illustration.jpg";
        if (isLeader()) img.src = "../leader-illustration.jpg";
    })
});