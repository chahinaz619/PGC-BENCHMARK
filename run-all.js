// run-all.js (FINAL SCIENTIFIC VERSION, 50 ITERATIONS)
// ----------------------------------------------------
// Runs the full benchmarking suite:
// Kyber512, Kyber768, Dilithium2, Dilithium3, ChaCha20-Poly1305
// Each algorithm runs with 50 iterations (configurable below).

const ITER = 50;  // ⭐ GLOBAL iteration count for all algorithms

const { runKyber512 } = require('./kyber512');
const { runKyber768 } = require('./kyber768');
const { runDilithium } = require('./dilithium2');
const { runDilithium3 } = require('./dilithium3');
const { runChaCha20Poly1305 } = require('./chacha20');

const { saveCSV } = require('./utils');

(async () => {
  console.log("===== PQC Benchmark: START =====");

  try {
    // -------------------------------
    // Kyber512
    // -------------------------------
    console.log("Running Kyber512...");
    const kyber512 = await runKyber512(ITER);
    saveCSV('results_kyber512.csv', kyber512.results);
    console.log("Kyber512 done. CSV saved: results_kyber512.csv");

    // -------------------------------
    // Kyber768
    // -------------------------------
    console.log("Running Kyber768...");
    const kyber768 = await runKyber768(ITER);
    saveCSV('results_kyber768.csv', kyber768.results);
    console.log("Kyber768 done. CSV saved: results_kyber768.csv");

    // -------------------------------
    // Dilithium2
    // -------------------------------
    console.log("Running Dilithium2...");
    const dilithium2 = await runDilithium('dilithium2', ITER);
    saveCSV('results_dilithium2.csv', dilithium2.results);
    console.log("Dilithium2 done. CSV saved: results_dilithium2.csv");

    // -------------------------------
    // Dilithium3
    // -------------------------------
    console.log("Running Dilithium3...");
    const dilithium3 = await runDilithium3(ITER);
    saveCSV('results_dilithium3.csv', dilithium3.results);
    console.log("Dilithium3 done. CSV saved: results_dilithium3.csv");

    // -------------------------------
    // ChaCha20-Poly1305 baseline
    // -------------------------------
    console.log("Running ChaCha20-Poly1305 baseline...");
    const chacha = await runChaCha20Poly1305(ITER, 1024);
    saveCSV('results_chacha20.csv', chacha.results);
    console.log("ChaCha20 done. CSV saved: results_chacha20.csv");

    console.log("===== PQC Benchmark: COMPLETE =====");
  } catch (err) {
    console.error("❌ Error during benchmark run:", err);
  }
})();
