import { Sockets } from "../../sockets/index.js";
import { spawnToken } from "../spawn-token.js";
import { gmCreateSentinel } from "../../gm/protector/create.js";

export const spawnSentinel = async (originActorId, tokenActorId) => {
  const actor = game.actors.get(originActorId);
  if (!actor) {
    return;

  }
  const token = await spawnToken(originActorId, tokenActorId, 30);
  const props = {
    sceneId: token.scene.id,
    tokenId: token.id,
    originSignature: actor.signature,
    hp: Math.ceil(actor.level / 2) * 10,
  }


  if (!game.user.isGM) {
    await Sockets.createSentinel(props);
  } else {
    await gmCreateSentinel(props);
  }
};

