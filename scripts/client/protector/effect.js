import { PROTECTED_EFFECT_ID } from "../../constants/effect.js";
import { Sockets } from "../../sockets/index.js";
import { gmApplyDamageToSentinel } from "../../gm/protector/apply-damage.js";

const buildReducedDamage = (damage, damageToReduce) => {
  const newDamage = damage.clone();

  newDamage._evaluated = true;
  newDamage._total = damage._total - damageToReduce;

  let iNewTerm = 0;
  for (let iTerm = 0; iTerm < damage.terms.length; iTerm++) {
    const instancePool = damage.terms[iTerm];
    const newInstancePool = newDamage.terms[iNewTerm];

    newInstancePool._evaluated = true;

    let iNewInstance = 0;
    for (
      let iInstance = 0;
      iInstance < instancePool.rolls.length;
      iInstance++
    ) {
      const instance = instancePool.rolls[iInstance];
      const newInstance = newInstancePool.rolls[iNewInstance];

      if (instance._total > damageToReduce) {
        newInstance._evaluated = true;
        newInstance._total = instance._total - damageToReduce;
        newInstancePool.results.push({
          result: newInstance._total,
          active: true,
        });

        damageToReduce = 0;

        iNewInstance++;
      } else {
        newInstancePool.rolls.shift();

        damageToReduce -= instance._total;
      }
    }
  }

  return newDamage;
};

export const sentinelInterceptStrikeDamage = async (data) => {
  console.log("sentinelInterceptStrikeDamage");
  if (!game.users.activeGM) {
    ui.notifications.warn(
      "There is no Gamemaster connected to support the Protector effect."
    );
    return true;
  }

  console.log("data", data);

  // If the damage isn't from a strike, apply normally.
  if (!data.rollOptions?.has("origin:action:slug:strike")) {
    // console.warn("not a strike");
    return true;
  }
  // If the token doesn't exist, apply normally.
  const token = data.token?.object;
  if (!token) {
    // console.warn("no token");
    return true;
  }

  const protectedEffect = token.actor.itemTypes.effect.find(
    (e) => e.sourceId === PROTECTED_EFFECT_ID
  );
  if (!protectedEffect) {
    // console.warn("no protected effect");
    return true;
  }

  const sentinelToken = await fromUuid(
    protectedEffect.system.context.origin.token
  );
  if (!sentinelToken) {
    // console.warn("no sentinel token");
    return true;
  }

  console.log("sentinelToken", sentinelToken);

  let remainingDamage = data.damage.total;

  console.warn("initialDamage", remainingDamage);

  const props = {
    tokenId: sentinelToken.id,
    sceneId: sentinelToken.scene.id,
    damage: data.damage.total,
  };
  if (game.user.isGM) {
    remainingDamage = await gmApplyDamageToSentinel(props);
  } else {
    remainingDamage = await Sockets.applyDamageToSentinel(props);
  }

  console.warn("remainingDamage", remainingDamage);
  // If the sentinel was destroyed, don't apply the damage.
  if (remainingDamage === 0) {
    return false;
  }

  data.damage = buildReducedDamage(
    data.damage,
    data.damage.total - remainingDamage
  );

  return true;
};
