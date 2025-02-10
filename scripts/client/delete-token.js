import { Sockets } from "../sockets/index.js";
import { gmDeleteToken } from "../gm/token.js";

  export const deleteToken = async ({ sceneId, tokenId, originSignature }) => {

    const props = {
      sceneId,
      tokenId,
      originSignature
    }
    if (!game.user.isGM) {
      await Sockets.deleteOwnedToken(props);
    } else {
      await gmDeleteToken(props);
    }

  }
