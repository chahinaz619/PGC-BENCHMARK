// run-all.js — MASTER CONTROLLER (50 iterations)

const { runKyber512 } = require("./kyber512");
const { runKyber768 } = require("./kyber768");
const { runDilithium2 } = require("./dilithium2");
const { runDilithium3 } = require("./dilithium3");
const { runChaCha20Poly1305 } = require("./chacha20");

(async () => {
    console.log("===== PQC Benchmark: START =====");

    await runKyber512(50);
    await runKyber768(50);
    await runDilithium2(50);
    await runDilithium3(50);
    await runChaCha20Poly1305(50);

    console.log("===== PQC Benchmark: COMPLETE =====");
})();
