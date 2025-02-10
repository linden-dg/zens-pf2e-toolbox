import { deleteToken } from "./delete-token.js";
import { spawnToken } from "./spawn-token.js";
import { spawnSentinel } from "./protector/token.js";

export const client = {
  deleteToken,
  spawnToken,
  spawnSentinel,
};

// export { sentinelInterceptStrikeDamage } from "./protector/effect.js";
