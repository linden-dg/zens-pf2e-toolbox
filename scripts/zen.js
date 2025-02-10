import { client } from "./client/index.js";
import { Sockets } from "./sockets/index.js";
import { sentinelInterceptStrikeDamage } from "./client/protector/effect.js";
import { HookManager } from "./utils/hooks.js";

Hooks.once("socketlib.ready", () => {
  Sockets.initialise();
  console.log("ZenTools | Sockets initialised");
});

Hooks.on("init", () => {
  Sockets.registerSockets();
  console.log("ZenTools | Sockets Registered");
});

Hooks.once("ready", () => {
  game.ZenTools = client;

  HookManager.registerCheck(
    "CONFIG.PF2E.Actor.documentClasses.character.prototype.applyDamage",
    async (data) => await sentinelInterceptStrikeDamage(data)
  );

  // HookManager.registerCheck(
  //    "CONFIG.PF2E.Actor.documentClasses.npc.prototype.applyDamage",
  //     async (data) => await sentinelInterceptStrikeDamage(data)
  //   );

  console.log("ZenTools | Ready");
});
