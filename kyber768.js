const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

async function runBenchmark() {
    const outputFile = path.join(__dirname, 'kyber768.csv');

    if (!fs.existsSync(outputFile)) {
        fs.writeFileSync(outputFile, 'iteration,keygen,encrypt,decrypt\n');
    }

    console.log('\n🔷 Running Kyber-768 Benchmark...\n');

    for (let i = 1; i <= 20; i++) {
        console.log(`Iteration ${i}/20`);

        let t1 = performance.now();
        spawnSync("openssl", ["pkey", "-gen", "-algorithm", "kyber768"]);
        let keygenTime = performance.now() - t1;

        t1 = performance.now();
        spawnSync("openssl", ["pkeyutl", "-encrypt", "-pubin", "-inkey", "pub768.pem", "-in", "input.txt", "-out", "cipher768.bin"]);
        let encryptTime = performance.now() - t1;

        t1 = performance.now();
        spawnSync("openssl", ["pkeyutl", "-decrypt", "-inkey", "priv768.pem", "-in", "cipher768.bin", "-out", "output768.txt"]);
        let decryptTime = performance.now() - t1;

        fs.appendFileSync(outputFile, `${i},${keygenTime},${encryptTime},${decryptTime}\n`);
    }

    console.log("\n✅ Kyber-768 benchmark completed — results saved to kyber768.csv");
}

async function runKyber768(iterations = 20) {
    console.log("=== Kyber768 Benchmarks ===");
    await runBenchmark();

    return { results: [] };
}

module.exports = { runKyber768 };
