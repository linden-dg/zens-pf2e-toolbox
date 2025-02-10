/**
 * Applies damage to the sentinel token
 *
 * @param {Object} params - The parameters for the update
 * @param {string} params.tokenId - The ID of the token
 * @param {string} params.sceneId - The ID of the scene
 * @param {number} params.damage - The damage to apply
 * @returns {Promise<number>} The remaining damage
 */

export const gmApplyDamageToSentinel = async ({ tokenId, sceneId, damage }) => {
  const token = await fromUuid(`Scene.${sceneId}.Token.${tokenId}`);
  if (!token?.object?.actor) {
    return damage;
  }

  const actor = token.object.actor;
  const currentHitPoints = actor.system.attributes.hp.value;
  if (currentHitPoints > damage) {
    actor.update({
      "system.attributes.hp.value": currentHitPoints - damage,
    });

    ChatMessage.create({
      type: CONST.CHAT_MESSAGE_STYLES.EMOTE,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: await renderTemplate(
        "./systems/pf2e/templates/chat/action/content.hbs",
        {
          imgPath: "icons/skills/melee/shield-block-fire-orange.webp",
          message: `${token.name} intercepts the Strike and takes ${damage} damage.`,
        }
      ),
    });

    return 0;
  } else {
    token.delete();

    ChatMessage.create({
      type: CONST.CHAT_MESSAGE_STYLES.EMOTE,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: await renderTemplate(
        "./systems/pf2e/templates/chat/action/content.hbs",
        {
          imgPath: "icons/skills/melee/shield-block-fire-orange.webp",
          message: `${token.name} intercepts the Strike, takes ${damage} damage, and is destroyed.`,
        }
      ),
    });

    return damage - currentHitPoints;
  }
};
