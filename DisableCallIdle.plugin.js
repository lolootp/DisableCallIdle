/**
 * @name DisableCallIdle
 * @author lolo
 * @authorId 687406069475049478
 * @description Disables automatic DM call disconnects after 5 mins
 * @source https://github.com/lolootp/DisableCallIdle/blob/main/DisableCallIdle.plugin.js
 * @version 1.4.3
 */

module.exports = class DisableCallIdle {

    getName() {
        return "DisableCallIdle";
    }

    start() {

        if (this.__started) {
            BdApi.UI.showNotification({
                title: this.getName(),
                content: "Tried to start twice!",
                type: "warning"
            });
            return;
        }
        this.__started = true;

        const { Patcher, Webpack } = BdApi;

        let patched = false;


        const timeoutModules = Webpack.getModules(m => m?.idleTimeout);
        timeoutModules.forEach(mod => {
            if (mod.idleTimeout?.start) {
                mod.idleTimeout.start = () => {};
                mod.idleTimeout.stop = () => {};
                patched = true;
            }
        });


        const idleHandler = Webpack.getModule(m => 
            m?.prototype?.handleIdleUpdate || 
            m?.handleIdleUpdate ||
            String(m).includes("handleIdleUpdate")
        );

        if (idleHandler) {
            const target = idleHandler.prototype || idleHandler;
            if (typeof target.handleIdleUpdate === "function") {
                Patcher.instead("DisableCallIdle", target, "handleIdleUpdate", () => {});
                patched = true;
            }
        }


        if (patched) {
            BdApi.UI.showNotification({
                title: this.getName(),
                content: "Call Idle Enabled DM calls will no longer disconnect", 
                type: "success"
            });
        } else {
            BdApi.UI.showNotification({
                title: this.getName(),
                content: "Loaded but no patches applied (Discord may have updated)",
                type: "warning"
            });
        }
    }

    stop() {
        BdApi.Patcher.unpatchAll("DisableCallIdle");
        this.__started = false;

        BdApi.UI.showNotification({
            title: this.getName(),
            content: "Disabled",
            type: "info"
        });
    }
};
