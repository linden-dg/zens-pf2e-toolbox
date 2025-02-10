import {
  getOriginSignature,
  setOriginSignature,
} from "../utils/origin-signature.js";

const deleteTokenFunction = async ({ sceneId, tokenId, originSignature }) => {
  const token = await fromUuid(`Scene.${sceneId}.Token.${tokenId}`);
  if (!token) {
    ui.notifications.error("Token not found");
    return;
  }

  const tokenOrigin = getOriginSignature(token);

  if (!tokenOrigin) {
    ui.notifications.error("Token has no origin signature");
  }

  if (tokenOrigin !== originSignature) {
    ui.notifications.error(
      "Token wasn't created by the origin actor & can't be deleted"
    );
  }

  await token.delete();
};

/**
 * Deletes the token if the origin signature is valid
 *
 * @param {Object} params - The parameters for the update
 * @param {string} params.sceneId - The ID of the scene
 * @param {string|string[]} params.tokenId - The ID of the token
 * @param {string} params.originSignature - The origin signature of the token
 */
export const gmDeleteToken = async ({
  sceneId,
  tokenId,
  originSignature,
}) => {
  if (Array.isArray(tokenId)) {
    tokenId.forEach(async (id) => {
      await deleteTokenFunction({ sceneId, tokenId: id, originSignature });
    });
  } else {
    await deleteTokenFunction({ sceneId, tokenId, originSignature });
  }
};

/**
 * Sets the origin signature of a token
 *
 * @param {Object} params - The parameters for the update
 * @param {string} params.sceneId - The ID of the scene
 * @param {string} params.tokenId - The ID of the token
 * @param {string} params.originSignature - The origin signature of the token
 */
export const gmSetTokenOrigin = async ({ sceneId, tokenId, originSignature }) => {
  const token = await fromUuid(`Scene.${sceneId}.Token.${tokenId}`);
  if (!token) {
    ui.notifications.error("Token not found");
    return;
  }

  setOriginSignature(token, originSignature);
};

