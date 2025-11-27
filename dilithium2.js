// dilithium2.js
// Full scientific benchmark for Dilithium2 (placeholder simulation)

const { performance } = require("perf_hooks");
const utils = require("./utils");
const { saveCSV } = require("./utils");

// Fake Dilithium2 keygen
async function fakeKeygen() {
    return new Promise(resolve => setTimeout(resolve, 4));
}

// Fake Dilithium2 sign
async function fakeSign() {
    return new Promise(resolve => setTimeout(resolve, 5));
}

// Fake Dilithium2 verify
async function fakeVerify() {
    return new Promise(resolve => setTimeout(resolve, 3));
}

async function runDilithium2(iterations = 20) {
    console.log("=== Dilithium2 Benchmarks ===");
    console.log(`Running Dilithium2 for ${iterations} iterations...`);

    const results = [];
    const csvName = "results_dilithium2.csv";

    for (let i = 1; i <= iterations; i++) {
        console.log(`Iteration ${i}/${iterations}`);

        //
        // 1. Keygen
        //
        const t0_k = performance.now();
        await fakeKeygen();
        const t1_k = performance.now();
        const keygen_ms = t1_k - t0_k;

        const keygen_cycles = utils.measurePerfCycles(["echo", "keygen"]) || 0;
        const keygen_mem = utils.getMemoryMB();
        const keygen_energy = utils.estimateEnergy(keygen_ms, keygen_cycles);

        //
        // 2. Sign
        //
        const t0_s = performance.now();
        await fakeSign();
        const t1_s = performance.now();
        const sign_ms = t1_s - t0_s;

        const sign_cycles = utils.measurePerfCycles(["echo", "sign"]) || 0;
        const sign_mem = utils.getMemoryMB();
        const sign_energy = utils.estimateEnergy(sign_ms, sign_cycles);

        //
        // 3. Verify
        //
        const t0_v = performance.now();
        await fakeVerify();
        const t1_v = performance.now();
        const verify_ms = t1_v - t0_v;

        const verify_cycles = utils.measurePerfCycles(["echo", "verify"]) || 0;
        const verify_mem = utils.getMemoryMB();
        const verify_energy = utils.estimateEnergy(verify_ms, verify_cycles);

        //
        // Push results
        //
        results.push({
            iteration: i,

            keygen_ms,
            sign_ms,
            verify_ms,

            keygen_cycles,
            sign_cycles,
            verify_cycles,

            keygen_mem,
            sign_mem,
            verify_mem,

            keygen_energy,
            sign_energy,
            verify_energy
        });

        await utils.sleep(20);
    }

    saveCSV(csvName, results);
    console.log(`✔ CSV saved: ${csvName}`);

    return { results };
}

module.exports = { runDilithium2 };
