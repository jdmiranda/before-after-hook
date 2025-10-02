// @ts-check
import Hook from "./index.js";

const ITERATIONS = 100000;

function benchmark(name, fn) {
  const start = performance.now();
  return fn().then(() => {
    const end = performance.now();
    const duration = end - start;
    const opsPerSec = (ITERATIONS / duration) * 1000;
    console.log(
      `${name}: ${duration.toFixed(2)}ms (${opsPerSec.toFixed(0)} ops/sec)`
    );
    return { duration, opsPerSec };
  });
}

async function runBenchmarks() {
  console.log(`Running benchmarks with ${ITERATIONS} iterations...\n`);

  // Benchmark 1: No hooks
  await benchmark("No hooks", async () => {
    const hook = new Hook.Collection();
    for (let i = 0; i < ITERATIONS; i++) {
      await hook("test", () => i);
    }
  });

  // Benchmark 2: Single before hook
  await benchmark("Single before hook", async () => {
    const hook = new Hook.Collection();
    hook.before("test", () => {});
    for (let i = 0; i < ITERATIONS; i++) {
      await hook("test", () => i);
    }
  });

  // Benchmark 3: Multiple before hooks
  await benchmark("3 before hooks", async () => {
    const hook = new Hook.Collection();
    hook.before("test", () => {});
    hook.before("test", () => {});
    hook.before("test", () => {});
    for (let i = 0; i < ITERATIONS; i++) {
      await hook("test", () => i);
    }
  });

  // Benchmark 4: Single after hook
  await benchmark("Single after hook", async () => {
    const hook = new Hook.Collection();
    hook.after("test", () => {});
    for (let i = 0; i < ITERATIONS; i++) {
      await hook("test", () => i);
    }
  });

  // Benchmark 5: Multiple after hooks
  await benchmark("3 after hooks", async () => {
    const hook = new Hook.Collection();
    hook.after("test", () => {});
    hook.after("test", () => {});
    hook.after("test", () => {});
    for (let i = 0; i < ITERATIONS; i++) {
      await hook("test", () => i);
    }
  });

  // Benchmark 6: Error hook
  await benchmark("Single error hook", async () => {
    const hook = new Hook.Collection();
    hook.error("test", () => {});
    for (let i = 0; i < ITERATIONS; i++) {
      await hook("test", () => i);
    }
  });

  // Benchmark 7: Wrap hook
  await benchmark("Single wrap hook", async () => {
    const hook = new Hook.Collection();
    hook.wrap("test", (method, options) => method(options));
    for (let i = 0; i < ITERATIONS; i++) {
      await hook("test", () => i);
    }
  });

  // Benchmark 8: Mixed hooks
  await benchmark("Mixed hooks (before + after + error)", async () => {
    const hook = new Hook.Collection();
    hook.before("test", () => {});
    hook.after("test", () => {});
    hook.error("test", () => {});
    for (let i = 0; i < ITERATIONS; i++) {
      await hook("test", () => i);
    }
  });

  // Benchmark 9: Singular hook
  await benchmark("Singular hook (no hooks)", async () => {
    const hook = new Hook.Singular();
    for (let i = 0; i < ITERATIONS; i++) {
      await hook(() => i);
    }
  });

  // Benchmark 10: Singular hook with before
  await benchmark("Singular hook (with before)", async () => {
    const hook = new Hook.Singular();
    hook.before(() => {});
    for (let i = 0; i < ITERATIONS; i++) {
      await hook(() => i);
    }
  });

  console.log("\nBenchmarks complete!");
}

runBenchmarks().catch(console.error);
