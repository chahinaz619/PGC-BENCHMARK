// kyber512.js
// Correct export for run-all.js

const { runKyber } = require("./benchmark");

// Fake Kyber512 computation (placeholder for real PQC)
async function fakeKyber512() {
    return new Promise(resolve => setTimeout(resolve, 1));
}

async function runKyber512(iterations = 20) {
    console.log("=== Kyber512 Benchmarks ===");
    
    const results = await runKyber("Kyber512", iterations, fakeKyber512);

    return { results };
}

// ⭐ Correct export structure (run-all.js expects { runKyber512 })
module.exports = { runKyber512 };
