import { Sound } from "@workadventure/iframe-api-typings";

export const picRandomRole = (roles: string[]) => {
    const randomIndex = Math.floor(Math.random() * roles.length);
    return roles[randomIndex];
}

export const playSound = (sound: string) => {
    const soundConfig = {
        volume: 1,
        loop: false,
        rate: 1,
        detune: 1,
        delay: 0,
        seek: 0,
        mute: false
    };
    const soundInstance = WA.sound.loadSound(sound);
    soundInstance.play(soundConfig);
    return soundInstance;
}

export const stopSound = (soundInstance: Sound) => {
    soundInstance.stop();
}
