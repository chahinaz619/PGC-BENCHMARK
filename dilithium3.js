// dilithium3.js
// Full scientific benchmark for Dilithium3 (placeholder simulation)

const { performance } = require("perf_hooks");
const utils = require("./utils");
const { saveCSV } = require("./utils");

// Fake Dilithium3 keygen
async function fakeKeygen3() {
    return new Promise(resolve => setTimeout(resolve, 5)); // heavier than dilithium2
}

// Fake Dilithium3 sign
async function fakeSign3() {
    return new Promise(resolve => setTimeout(resolve, 6));
}

// Fake Dilithium3 verify
async function fakeVerify3() {
    return new Promise(resolve => setTimeout(resolve, 4));
}

async function runDilithium3(iterations = 20) {
    console.log("=== Dilithium3 Benchmarks ===");
    console.log(`Running Dilithium3 for ${iterations} iterations...`);

    const results = [];
    const csvName = "results_dilithium3.csv";

    for (let i = 1; i <= iterations; i++) {
        console.log(`Iteration ${i}/${iterations}`);

        //
        // 1. Keygen
        //
        const t0_k = performance.now();
        await fakeKeygen3();
        const t1_k = performance.now();
        const keygen_ms = t1_k - t0_k;

        const keygen_cycles = utils.measurePerfCycles(["echo", "keygen3"]) || 0;
        const keygen_mem = utils.getMemoryMB();
        const keygen_energy = utils.estimateEnergy(keygen_ms, keygen_cycles);

        //
        // 2. Sign
        //
        const t0_s = performance.now();
        await fakeSign3();
        const t1_s = performance.now();
        const sign_ms = t1_s - t0_s;

        const sign_cycles = utils.measurePerfCycles(["echo", "sign3"]) || 0;
        const sign_mem = utils.getMemoryMB();
        const sign_energy = utils.estimateEnergy(sign_ms, sign_cycles);

        //
        // 3. Verify
        //
        const t0_v = performance.now();
        await fakeVerify3();
        const t1_v = performance.now();
        const verify_ms = t1_v - t0_v;

        const verify_cycles = utils.measurePerfCycles(["echo", "verify3"]) || 0;
        const verify_mem = utils.getMemoryMB();
        const verify_energy = utils.estimateEnergy(verify_ms, verify_cycles);

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

module.exports = { runDilithium3 };
