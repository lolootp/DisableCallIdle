/**
 * @name DisableCallIdle
 * @author lolo
 * @authorId 687406069475049478
 * @description Disables automatic DM call disconnects after 5 mins
 * @source https://github.com/lolootp/DisableCallIdle/blob/main/DisableCallIdle.plugin.js
 * @version 1.0.0
 */

module.exports = class DisableCallIdle {
    start() {
        const { Patcher, Webpack } = BdApi;

        try {

            const idleHandler = Webpack.getModule(m => 
                String(m).includes("handleIdleUpdate") || 
                (m?.prototype && typeof m.prototype.handleIdleUpdate === "function")
            );

            if (idleHandler) {
                const target = idleHandler.prototype || idleHandler;
                if (typeof target.handleIdleUpdate === "function") {
                    Patcher.instead("DisableCallIdle", target, "handleIdleUpdate", () => {});
                }
            }


            const timeoutModules = Webpack.getModules(m => 
                String(m).includes("idleTimeout")
            );

            timeoutModules.forEach(mod => {
                if (mod?.idleTimeout) {
                    mod.idleTimeout.start = () => {};
                    mod.idleTimeout.stop = () => {};
                }
            });


            const allModules = Webpack.getModules(m => 
                typeof m === "function" || typeof m === "object"
            ).filter(m => 
                String(m).toLowerCase().includes("idle")
            );

        } catch (err) {

        }
    }

    stop() {
        BdApi.Patcher.unpatchAll("DisableCallIdle");
    }
};
