import { UIWebsite } from "@workadventure/iframe-api-typings";
import { isLeader } from "./variable";

export class VoteScene {
    private voteView?: UIWebsite;

    constructor() {
        this.openVote();
    }

    public async openVote() {
        if(isLeader()){
            this.voteView = await WA.ui.website.open({
                url: "pages/vote/leader.html",
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
        this.voteView = await WA.ui.website.open({
            url: "pages/vote.html",
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
        if (this.voteView) {
            await this.voteView.close();
            this.voteView = undefined;
        }
    }
}