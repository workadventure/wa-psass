import { UIWebsite } from "@workadventure/iframe-api-typings";

export class RoleScene {
    private roleView?: UIWebsite;

    constructor() {
        this.openR();
    }

    public async openR() {
        let src = "pages/role/villager.html";
        switch (WA.player.state.role) {
            case "wolf":
                src = "pages/role/wolf.html";
                break;
            case "hunter":
                src = "pages/role/hunter.html";
                break;
            case "youggirl":
                src = "pages/role/younggirl.html";
                break;
        }
        this.roleView = await WA.ui.website.open({
            url: src,
            visible: true,
            position: {
                vertical: 'middle',
                horizontal: 'middle'
            },
            size: {
                width: '400px',
                height: '400px'
            },
            margin: {
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            }
        });
    }

    public async close() {
        if (this.roleView) {
            await this.roleView.close();
            this.roleView = undefined;
        }
    }
}