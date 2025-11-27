// run-all.js — FINAL SCIENTIFIC VERSION
// -----------------------------------------------------------
// Master controller for all PQC + symmetric benchmarks.
// Each algorithm writes its own CSV with detailed measurements:
//   - time_ms
//   - cpu_cycles
//   - memory (MB)
//   - energy (Joules)
// -----------------------------------------------------------

console.log("===== PQC Benchmark Suite: START =====");

async function main() {
  try {
    // -----------------------------
    // Kyber512
    // -----------------------------
    console.log("\n▶ Running Kyber512...");
    const { runKyber512 } = require("./kyber512");
    await runKyber512(20);
    console.log("✔ Kyber512 complete.");

    // -----------------------------
    // Kyber768
    // -----------------------------
    console.log("\n▶ Running Kyber768...");
    const { runKyber768 } = require("./kyber768");
    await runKyber768(20);
    console.log("✔ Kyber768 complete.");

    // -----------------------------
    // Dilithium2
    // -----------------------------
    console.log("\n▶ Running Dilithium2...");
    const { runDilithium2 } = require("./dilithium2");
    await runDilithium2(20);
    console.log("✔ Dilithium2 complete.");

    // -----------------------------
    // Dilithium3
    // -----------------------------
    console.log("\n▶ Running Dilithium3...");
    const { runDilithium3 } = require("./dilithium3");
    await runDilithium3(20);
    console.log("✔ Dilithium3 complete.");

    // -----------------------------
    // ChaCha20-Poly1305 (baseline)
    // -----------------------------
    console.log("\n▶ Running ChaCha20-Poly1305 baseline...");
    const { runChaCha20Poly1305 } = require("./chacha20");
    await runChaCha20Poly1305(50, 1024);   // 1KB payload
    console.log("✔ ChaCha20-Poly1305 complete.");

    console.log("\n===== PQC Benchmark Suite: COMPLETE =====");

  } catch (err) {
    console.error("\n❌ ERROR during benchmark run:");
    console.error(err);
    console.log("\nExiting benchmark suite.");
  }
}

main();
