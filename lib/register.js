// @ts-check

export function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce((callback, name) => {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  const hooks = state.registry[name];

  // Fast path: no hooks registered
  if (!hooks || hooks.length === 0) {
    return Promise.resolve(method(options));
  }

  // Fast path: single hook
  if (hooks.length === 1) {
    return Promise.resolve(hooks[0].hook(method, options));
  }

  // Multiple hooks: use reduce
  return Promise.resolve(
    hooks.reduce((method, registered) => {
      return registered.hook.bind(null, method, options);
    }, method)()
  );
}
