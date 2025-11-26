const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

async function runBenchmark() {
    const outputFile = path.join(__dirname, 'kyber768.csv');

    // Create CSV with header if not exists
    if (!fs.existsSync(outputFile)) {
        fs.writeFileSync(outputFile, 'iteration,keygen,encrypt,decrypt\n');
    }

    console.log('\n🔷 Running Kyber-768 Benchmark...\n');

    for (let i = 1; i <= 50; i++) {  // Benchmark loop (change count if needed)
        console.log(`Iteration ${i}/50`);

        // ---- Key Generation ----
        let t1 = performance.now();
        spawnSync("openssl", ["pkey", "-gen", "-algorithm", "kyber768"], { encoding: "utf-8" });
        let keygenTime = performance.now() - t1;

        // ---- Encryption ----
        t1 = performance.now();
        spawnSync("openssl", ["pkeyutl", "-encrypt", "-pubin", "-inkey", "pub768.pem", "-in", "input.txt", "-out", "cipher768.bin"]);
        let encryptTime = performance.now() - t1;

        // ---- Decryption ----
        t1 = performance.now();
        spawnSync("openssl", ["pkeyutl", "-decrypt", "-inkey", "priv768.pem", "-in", "cipher768.bin", "-out", "output768.txt"]);
        let decryptTime = performance.now() - t1;

        // Save result to CSV
        fs.appendFileSync(outputFile, `${i},${keygenTime},${encryptTime},${decryptTime}\n`);
    }

    console.log("\n✅ Kyber-768 benchmark completed — results saved to kyber768.csv");
}

module.exports = runBenchmark;
