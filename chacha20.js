// chacha20.js — PERF ENABLED

const { performance } = require("perf_hooks");
const crypto = require("crypto");
const utils = require("./utils");

async function runChaCha20Poly1305(iterations = 50) {
    console.log("=== ChaCha20 Benchmarks ===");
    console.log(`Running ChaCha20 for ${iterations} iterations...`);

    const results = [];

    for (let i = 1; i <= iterations; i++) {
        console.log(`Iteration ${i}/${iterations}`);

        const key = crypto.randomBytes(32);
        const nonce = crypto.randomBytes(12);
        const pt = crypto.randomBytes(1024);

        const t0 = performance.now();
        const cipher = crypto.createCipheriv("chacha20-poly1305", key, nonce);
        cipher.update(pt);
        cipher.final();
        const t1 = performance.now();

        const perf = utils.measurePerfCycles(["echo", "chacha"]);
        const mem = utils.getMemoryMB();
        const energy = utils.estimateEnergy(t1 - t0, perf.cycles);

        results.push({
            iteration: i,
            time_ms: t1 - t0,

            cycles: perf.cycles,
            instructions: perf.instr,
            cache_misses: perf.cache,
            branch_misses: perf.branch,

            rss_MB: mem.rss,
            heapUsed_MB: mem.heapUsed,

            energy_j: energy
        });
    }

    utils.saveCSV("results_chacha20.csv", results);
    return { results };
}

module.exports = { runChaCha20Poly1305 };
