/// <reference types="@workadventure/iframe-api-typings" />

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
}).catch(e => console.error(e));

export {};
