/**
 * @name DisableCallIdle
 * @author lolo
 * @authorId 687406069475049478
 * @description Disables automatic DM call disconnects after 5 mins
 * @source https://github.com/lolootp/DisableCallIdle/blob/main/DisableCallIdle.plugin.js
 * @version 1.1.0
 */

module.exports = class DisableCallIdle {
    start() {
        const Webpack = BdApi.Webpack;
        const Patcher = BdApi.Patcher;

        console.log("[DisableCallIdle] Starting...");

        // Improved finder for newer Discord versions
        this.module = Webpack.getModule(m =>
            m?.prototype?.handleIdleUpdate ||
            m?.handleIdleUpdate ||
            String(m).includes("handleIdleUpdate") ||
            String(m).includes("idleTimeout")
        );

        if (!this.module) {
            console.error("[DisableCallIdle] Failed to find idle module. Discord updated again.");
            return;
        }

        console.log("[DisableCallIdle] Module found!");

        const proto = this.module.prototype || this.module;

        // Main patch
        if (typeof proto.handleIdleUpdate === "function") {
            Patcher.instead(
                "DisableCallIdle",
                proto,
                "handleIdleUpdate",
                () => {}
            );
            console.log("[DisableCallIdle] ✓ Patched handleIdleUpdate");
        }

        // Backup timeout patch
        if (proto.idleTimeout) {
            proto.idleTimeout.start = () => {};
            proto.idleTimeout.stop = () => {};
            console.log("[DisableCallIdle] ✓ Patched idleTimeout");
        }

        console.log("[DisableCallIdle] Plugin enabled successfully.");
    }

    stop() {
        BdApi.Patcher.unpatchAll("DisableCallIdle");
        console.log("[DisableCallIdle] Plugin disabled.");
    }
};
