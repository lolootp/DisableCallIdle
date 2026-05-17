/**
 * @name DisableCallIdle
 * @author lolo
 * @authorId 687406069475049478
 * @description Disables automatic DM call disconnects after 5 mins
 * @source https://github.com/lolootp/DisableCallIdle/blob/main/DisableCallIdle.plugin.js
 * @version 1.4.0
 */

module.exports = class DisableCallIdle {
    start() {
        const { Patcher, Webpack } = BdApi;

        const timeoutModules = Webpack.getModules(m => m?.idleTimeout);
        timeoutModules.forEach(mod => {
            if (mod.idleTimeout?.start) {
                mod.idleTimeout.start = () => {};
                mod.idleTimeout.stop = () => {};
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
            }
        }
    }

    stop() {
        BdApi.Patcher.unpatchAll("DisableCallIdle");
    }
};
