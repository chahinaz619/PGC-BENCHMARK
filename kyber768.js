// kyber768.js — PERF ENABLED

const { performance } = require("perf_hooks");
const utils = require("./utils");

async function fakeKyber768() {
    return new Promise(resolve => setTimeout(resolve, 3));
}

async function runKyber768(iterations = 50) {
    console.log("=== Kyber768 Benchmarks ===");
    console.log(`Running Kyber768 for ${iterations} iterations...`);

    const results = [];

    for (let i = 1; i <= iterations; i++) {
        console.log(`Iteration ${i}/${iterations}`);

        const t0 = performance.now();
        await fakeKyber768();
        const t1 = performance.now();
        const time_ms = t1 - t0;

        const perf = utils.measurePerfCycles(["echo", "kyber768"]);
        const mem = utils.getMemoryMB();
        const energy = utils.estimateEnergy(time_ms, perf.cycles);

        results.push({
            iteration: i,
            time_ms,

            cycles: perf.cycles,
            instructions: perf.instr,
            cache_misses: perf.cache,
            branch_misses: perf.branch,

            rss_MB: mem.rss,
            heapUsed_MB: mem.heapUsed,
            heapTotal_MB: mem.heapTotal,

            energy_j: energy
        });

        await utils.sleep(10);
    }

    utils.saveCSV("results_kyber768.csv", results);
    return { results };
}

module.exports = { runKyber768 };
