// kyber512.js
// Full scientific benchmark for Kyber512 using fake placeholder PQC logic

const { performance } = require("perf_hooks");
const utils = require("./utils");
const { saveCSV } = require("./utils");

// Fake Kyber512 computation (placeholder until real Kyber library)
async function fakeKyber512() {
    return new Promise(resolve => setTimeout(resolve, 2)); // simulated workload
}

async function runKyber512(iterations = 20) {
    console.log("=== Kyber512 Benchmarks ===");
    console.log(`Running kyber512 for ${iterations} iterations...`);

    const results = [];

    // Create CSV file name
    const csvName = "results_kyber512.csv";

    for (let i = 1; i <= iterations; i++) {
        console.log(`Iteration ${i}/${iterations}`);

        // -------------------------------------------
        // 1. TIME MEASUREMENT
        // -------------------------------------------
        const t0 = performance.now();
        await fakeKyber512();
        const t1 = performance.now();

        const cpu_ms = t1 - t0;

        // -------------------------------------------
        // 2. PERF CPU CYCLE MEASUREMENT
        // -------------------------------------------
        const cpu_cycles = utils.measurePerfCycles(["echo", "test"]) || 0;

        // -------------------------------------------
        // 3. MEMORY MEASUREMENT
        // -------------------------------------------
        const mem_mb = utils.getMemoryMB();

        // -------------------------------------------
        // 4. ENERGY ESTIMATION
        // -------------------------------------------
        const energy_j = utils.estimateEnergy(cpu_ms, cpu_cycles);

        results.push({
            iteration: i,
            cpu_ms,
            cpu_cycles,
            mem_mb,
            energy_j
        });

        await utils.sleep(20);
    }

    // Save CSV
    saveCSV(csvName, results);
    console.log(`✔ CSV saved: ${csvName}`);

    return { results };
}

module.exports = { runKyber512 };
