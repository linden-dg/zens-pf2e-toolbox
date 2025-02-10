import { Sockets } from "../sockets/index.js";
import { gmSetTokenOrigin } from "../gm/token.js";
/**
 * Spawns a token for the given actor.
 * @param {string} originActorId - The actor to act as the origin of the token.
 * @param {string} tokenActorId - The actor to spawn the token from.
 * @param {number} range - The range to spawn the token from the origin actor.
 * @returns {Token} The spawned token.
 */

export const spawnToken = async (originActorId, tokenActorId, range = 30) => {
    if (
      !(
        game.modules.get("portal-lib").active &&
        game.modules.get("socketlib").active &&
        game.modules.get("lib-wrapper").active
      )
    ) {
      ui.notifications.error(
        "This functionality requires the Portal Lib, SocketLib, and LibWrapper modules to be installed and enabled"
      );
      return;
    }

    const actor = game.actors.get(originActorId);
    if (!actor) {
      return;
    }

    const actorToken = actor.getActiveTokens()?.[0];
    if (!actorToken) {
      return;
    }
  
    const portal = new Portal()
      .addCreature(tokenActorId)
      .origin(actorToken)
      .range(range);
  

    await portal.pick();
  
    if (!game.users.activeGM) {
      ui.notifications.error(
        "There is no Gamemaster connected to create the creature."
      );
      return;
    }
  
    const [token] = await portal.spawn();

    const props = {
      sceneId: game.scenes.active.id,
      tokenId: token.id,
      originSignature: actor.signature
    }
    if (!game.users.isGM) {
      await Sockets.setTokenOrigin(props);
    } else {
      await gmSetTokenOrigin(props);
    }

    return token;

  };