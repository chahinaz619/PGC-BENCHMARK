// kyber512.js
const { runKyber } = require("./benchmark");

// dummy placeholder — real Kyber comes later
async function fakeKyber512() {
    return new Promise(resolve => setTimeout(resolve, 2));
}

async function runKyber512(iterations = 20) {
    console.log("=== Kyber512 Benchmarks ===");
    const results = await runKyber("kyber512", iterations, fakeKyber512);
    return { results };
}

module.exports = { runKyber512 };
