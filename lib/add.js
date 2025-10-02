// @ts-check

export function addHook(state, kind, name, hook) {
  const orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = async (method, options) => {
      await orig(options);
      return method(options);
    };
  }

  if (kind === "after") {
    hook = async (method, options) => {
      const result = await method(options);
      await orig(result, options);
      return result;
    };
  }

  if (kind === "error") {
    hook = async (method, options) => {
      try {
        return await method(options);
      } catch (error) {
        return orig(error, options);
      }
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}
