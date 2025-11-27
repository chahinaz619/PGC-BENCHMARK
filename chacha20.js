// chacha20.js
// Full scientific benchmark for ChaCha20-Poly1305 (baseline symmetric algorithm)

const crypto = require("crypto");
const { performance } = require("perf_hooks");
const utils = require("./utils");
const { saveCSV } = require("./utils");

async function runChaCha20Poly1305(iterations = 50, payloadSize = 1024) {
    console.log("=== ChaCha20-Poly1305 Benchmarks ===");
    console.log(`Running ChaCha20 for ${iterations} iterations...`);

    const results = [];
    const csvName = "results_chacha20.csv";

    for (let i = 1; i <= iterations; i++) {
        console.log(`Iteration ${i}/${iterations}`);

        //
        // 1. Key generation (simulate symmetric key gen)
        //
        const t0_k = performance.now();
        const key = crypto.randomBytes(32); // ChaCha20 key
        const t1_k = performance.now();
        const keygen_ms = t1_k - t0_k;

        const keygen_cycles = utils.measurePerfCycles(["echo", "kg_chacha20"]) || 0;
        const keygen_mem = utils.getMemoryMB();
        const keygen_energy = utils.estimateEnergy(keygen_ms, keygen_cycles);

        //
        // 2. Encryption
        //
        const nonce = crypto.randomBytes(12);
        const plaintext = crypto.randomBytes(payloadSize);

        const t0_e = performance.now();
        const encResult = (() => {
            const cipher = crypto.createCipheriv("chacha20-poly1305", key, nonce, {
                authTagLength: 16,
            });
            const ct = Buffer.concat([cipher.update(plaintext), cipher.final()]);
            const tag = cipher.getAuthTag();
            return { ct, tag };
        })();
        const t1_e = performance.now();
        const enc_ms = t1_e - t0_e;

        const enc_cycles = utils.measurePerfCycles(["echo", "enc_chacha20"]) || 0;
        const enc_mem = utils.getMemoryMB();
        const enc_energy = utils.estimateEnergy(enc_ms, enc_cycles);

        //
        // 3. Decryption
        //
        const t0_d = performance.now();
        const decResult = (() => {
            const decipher = crypto.createDecipheriv("chacha20-poly1305", key, nonce, {
                authTagLength: 16,
            });
            decipher.setAuthTag(encResult.tag);
            const pt = Buffer.concat([
                decipher.update(encResult.ct),
                decipher.final(),
            ]);
            return pt;
        })();
        const t1_d = performance.now();
        const dec_ms = t1_d - t0_d;

        const dec_cycles = utils.measurePerfCycles(["echo", "dec_chacha20"]) || 0;
        const dec_mem = utils.getMemoryMB();
        const dec_energy = utils.estimateEnergy(dec_ms, dec_cycles);

        //
        // 4. Push results
        //
        results.push({
            iteration: i,

            keygen_ms,
            enc_ms,
            dec_ms,

            keygen_cycles,
            enc_cycles,
            dec_cycles,

            keygen_mem,
            enc_mem,
            dec_mem,

            keygen_energy,
            enc_energy,
            dec_energy,
        });

        await utils.sleep(20);
    }

    saveCSV(csvName, results);
    console.log(`✔ CSV saved: ${csvName}`);

    return { results };
}

module.exports = { runChaCha20Poly1305 };
