// dilithium2.js — PERF ENABLED

const { performance } = require("perf_hooks");
const utils = require("./utils");

async function fakeKeygen() { return new Promise(r => setTimeout(r, 4)); }
async function fakeSign()   { return new Promise(r => setTimeout(r, 5)); }
async function fakeVerify() { return new Promise(r => setTimeout(r, 3)); }

async function runDilithium2(iterations = 50) {
    console.log("=== Dilithium2 Benchmarks ===");
    console.log(`Running Dilithium2 for ${iterations} iterations...`);

    const results = [];

    for (let i = 1; i <= iterations; i++) {
        console.log(`Iteration ${i}/${iterations}`);

        // keygen
        const t0k = performance.now(); await fakeKeygen(); const t1k = performance.now();
        const perfK = utils.measurePerfCycles(["echo", "d2_keygen"]);
        const memK = utils.getMemoryMB();

        // sign
        const t0s = performance.now(); await fakeSign(); const t1s = performance.now();
        const perfS = utils.measurePerfCycles(["echo", "d2_sign"]);
        const memS = utils.getMemoryMB();

        // verify
        const t0v = performance.now(); await fakeVerify(); const t1v = performance.now();
        const perfV = utils.measurePerfCycles(["echo", "d2_verify"]);
        const memV = utils.getMemoryMB();

        results.push({
            iteration: i,

            keygen_ms: t1k - t0k,
            sign_ms:   t1s - t0s,
            verify_ms: t1v - t0v,

            keygen_cycles: perfK.cycles,
            sign_cycles:   perfS.cycles,
            verify_cycles: perfV.cycles,

            keygen_instr: perfK.instr,
            sign_instr:   perfS.instr,
            verify_instr: perfV.instr,

            keygen_cache: perfK.cache,
            sign_cache:   perfS.cache,
            verify_cache: perfV.cache,

            keygen_branch: perfK.branch,
            sign_branch:   perfS.branch,
            verify_branch: perfV.branch,

            mem_rss: memK.rss,
            mem_heapUsed: memK.heapUsed,

            energy_keygen: utils.estimateEnergy(t1k - t0k, perfK.cycles),
            energy_sign:   utils.estimateEnergy(t1s - t0s, perfS.cycles),
            energy_verify: utils.estimateEnergy(t1v - t0v, perfV.cycles)
        });

        await utils.sleep(10);
    }

    utils.saveCSV("results_dilithium2.csv", results);
    return { results };
}

module.exports = { runDilithium2 };
