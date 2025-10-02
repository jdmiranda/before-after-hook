// @ts-check

export function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  const hooks = state.registry[name];

  // Optimized: use findIndex instead of map + indexOf
  const index = hooks.findIndex((registered) => registered.orig === method);

  if (index !== -1) {
    hooks.splice(index, 1);
  }
}
