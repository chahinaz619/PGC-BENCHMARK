// run-all.js
// Master benchmark runner for PQC + baseline algorithms
// This script sequentially runs: Kyber512, Kyber768, Dilithium2, Dilithium3, ChaCha20
// and writes CSV outputs for each.

const { runKyber512 } = require('./kyber512');
const { runKyber768 } = require('./kyber768');
const { runDilithium } = require('./dilithium2');
const { runDilithium3 } = require('./dilithium3');
const { runChaCha20Poly1305 } = require('./chacha20');
const { exportCSV } = require('./csv-export');

(async () => {
  console.log("===== PQC Benchmark: START =====");

  try {
    // -------------------------------
    // Kyber512
    // -------------------------------
    console.log("Running Kyber512...");
    const kyber512 = await runKyber512(20);
    await exportCSV('results_kyber512.csv', kyber512.results);
    console.log("Kyber512 done. CSV saved: results_kyber512.csv");

    // -------------------------------
    // Kyber768
    // -------------------------------
    console.log("Running Kyber768...");
    const kyber768 = await runKyber768(20);
    await exportCSV('results_kyber768.csv', kyber768.results);
    console.log("Kyber768 done. CSV saved: results_kyber768.csv");

    // -------------------------------
    // Dilithium2
    // -------------------------------
    console.log("Running Dilithium2...");
    const dilithium2 = await runDilithium('dilithium2', 20);
    await exportCSV('results_dilithium2.csv', dilithium2.results);
    console.log("Dilithium2 done. CSV saved: results_dilithium2.csv");

    // -------------------------------
    // Dilithium3
    // -------------------------------
    console.log("Running Dilithium3...");
    const dilithium3 = await runDilithium3(20);
    await exportCSV('results_dilithium3.csv', dilithium3.results);
    console.log("Dilithium3 done. CSV saved: results_dilithium3.csv");

    // -------------------------------
    // ChaCha20-Poly1305 baseline
    // -------------------------------
    console.log("Running ChaCha20-Poly1305 baseline...");
    const chacha = await runChaCha20Poly1305(50, 1024);
    await exportCSV('results_chacha20.csv', chacha.results);
    console.log("ChaCha20 done. CSV saved: results_chacha20.csv");

    console.log("===== PQC Benchmark: COMPLETE =====");
  } catch (err) {
    console.error("Error during benchmark run:", err);
  }
})();