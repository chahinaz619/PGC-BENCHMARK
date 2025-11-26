// benchmark.js
// Generic benchmarking engine for Kyber and other KEM-style algorithms

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Records each iteration's runtime into CSV
async function runKyber(name, iterations, fn) {
    const outFile = path.join(__dirname, `results_${name.toLowerCase()}.csv`);

    // Write header if file doesn't exist
    if (!fs.existsSync(outFile)) {
        fs.writeFileSync(outFile, 'iteration,time_ms\n');
    }

    console.log(`Running ${name} for ${iterations} iterations...`);

    const results = [];

    for (let i = 1; i <= iterations; i++) {
        const t1 = performance.now();
        await fn();             // run fake or real Kyber
        const t2 = performance.now();

        const ms = t2 - t1;

        results.push({ iteration: i, time_ms: ms });

        // Append to CSV
        fs.appendFileSync(outFile, `${i},${ms}\n`);
    }

    return results;
}

module.exports = { runKyber };
