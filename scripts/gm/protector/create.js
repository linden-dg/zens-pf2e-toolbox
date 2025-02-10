import {
  setOriginSignature,
  getOriginSignature,
} from "../../utils/origin-signature.js";

import { GUARDIAN_EFFECT_ID } from "../../constants/effect.js";


/**
 * Deletes the token if the origin signature is valid
 *
 * @param {Object} params - The parameters for the update
 * @param {string} params.sceneId - The ID of the scene
 * @param {string} params.tokenId - The ID of the token
 * @param {string} params.originSignature - The origin signature of the token
 * @param {number} params.hp - The HP of the token
 */

export const gmCreateSentinel = async ({
  sceneId,
  tokenId,
  originSignature,
  hp,
}) => {
  const token = await fromUuid(`Scene.${sceneId}.Token.${tokenId}`);
  if (!token) {
    ui.notifications.error("Token not found");
    return;
  }
  await setOriginSignature(token, originSignature);

  // Ensure all other tokens with the same origin are deleted
  const scene = game.scenes.get(sceneId);
  scene.tokens
    .filter(
      (t) =>
        t.actorId === token.actorId &&
        t.id !== token.id &&
        getOriginSignature(t) === originSignature
    )
    .forEach((t) => t.delete());

  const tokenActor = token.object.actor;

  await tokenActor.update({
    "system.attributes.hp.max": hp,

    // "system": {
    //     "attributes.hp": {
    //         "max": hp
    //     }
    // }
  });

  tokenActor.update({
    "system.attributes.hp.value": hp,
  });

  const guardianEffectSource = (await fromUuid(GUARDIAN_EFFECT_ID)).toObject();
  guardianEffectSource.flags["zen"] = {
    alliance: "party",
    originSignature,
  };

  token.actor.createEmbeddedDocuments("Item", [guardianEffectSource]);

  
};

