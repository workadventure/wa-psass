import { acceptableTimeOut, host } from "./variable";

export class RoleScene {
    private isActive = false;

    constructor() {}

    public async start() {
        // Open modal
        setTimeout(() => {
            WA.ui.modal.openModal({
                allowApi: true,
                position: "left",
                allow: "fullscreen",
                src: `${host}/public/pages/myRole.html`,
                title: "My Role",
            });
        }, acceptableTimeOut);

        this.isActive = true;
    }

    public async end() {
        WA.ui.modal.closeModal();

        this.isActive = false;
    }

    get active() {
        return this.isActive;
    }
}