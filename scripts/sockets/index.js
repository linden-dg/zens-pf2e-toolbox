import { gmDeleteToken, gmSetTokenOrigin } from "../gm/token.js";
import { gmApplyDamageToSentinel } from "../gm/protector/apply-damage.js";
import { gmCreateSentinel } from "../gm/protector/create.js";

export class Sockets {
  static #socketModule = "zens-pf2e-toolbox";
  static #socket;
  static #registry = {
    deleteToken: "token::delete",
    setTokenOrigin: "token::set-origin",
    createSentinel: "sentinel::create",
    applyDamageToSentinel: "sentinel::apply-damage",
  };

  static initialise() {
    this.#socket = socketlib.registerModule(this.#socketModule);
  }

  static registerSockets() {
    this.#socket.register(this.#registry.deleteToken, gmDeleteToken);
    this.#socket.register(this.#registry.setTokenOrigin, gmSetTokenOrigin);
    this.#socket.register(this.#registry.createSentinel, gmCreateSentinel);
    this.#socket.register(
      this.#registry.applyDamageToSentinel,
      gmApplyDamageToSentinel
    );
  }

  /**
   * Deletes a token from the scene
   * @param {Object} params - The parameters for the update
   * @param {string} params.sceneId - The ID of the scene
   * @param {string} params.tokenId - The ID of the token
   * @param {string} params.originSignature - The origin signature of the token
   * @returns {Promise<void>}
   */
  static async deleteOwnedToken({ sceneId, tokenId, originSignature }) {
    return await this.#socket.executeAsGM(this.#registry.deleteToken, {
      sceneId,
      tokenId,
      originSignature,
    });
  }

  /**
   * Sets the origin signature of a token
   * @param {Object} params - The parameters for the update
   * @param {string} params.sceneId - The ID of the scene
   * @param {string|string[]} params.tokenId - The ID of the token
   * @param {string} params.originSignature - The origin signature of the token
   * @returns {Promise<void>}
   */
  static async setTokenOrigin({ sceneId, tokenId, originSignature }) {
    return await this.#socket.executeAsGM(this.#registry.setTokenOrigin, {
      sceneId,
      tokenId,
      originSignature,
    });
  }

  /**
   * Creates a sentinel token
   * @param {Object} params - The parameters for the update
   * @param {string} params.sceneId - The ID of the scene
   * @param {string} params.tokenId - The ID of the token
   * @param {string} params.originSignature - The origin signature of the token
   * @param {number} params.hp - The hit points of the sentinel
   * @returns {Promise<void>}
   */
  static async createSentinel({ sceneId, tokenId, originSignature, hp }) {
    return await this.#socket.executeAsGM(this.#registry.createSentinel, {
      sceneId,

      tokenId,
      originSignature,
      hp,
    });
  }

  /**
   * Applies damage to a sentinel token
   * @param {Object} params - The parameters for the update
   * @param {string} params.tokenId - The ID of the token
   * @param {string} params.sceneId - The ID of the scene
   * @param {number} params.damage - The damage to apply
   * @returns {Promise<number>} The remaining damage
   */
  static async applyDamageToSentinel({ tokenId, sceneId, damage }) {
    return await this.#socket.executeAsGM(
      this.#registry.applyDamageToSentinel,
      {
        tokenId,
        sceneId,
        damage,
      }
    );
  }
}
