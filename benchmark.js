// benchmark.js
const { performance } = require("perf_hooks");
const { randomBytes } = require("crypto");

async function runKyber(name, runs, kyberImpl) {
    console.log(`Running ${name} for ${runs} iterations...`);

    let results = [];

    for (let i = 0; i < runs; i++) {
        const start = performance.now();

        // --- simulate KEM operations ---
        await kyberImpl();

        const end = performance.now();
        results.push(end - start);
    }

    return results;
}

module.exports = { runKyber };
