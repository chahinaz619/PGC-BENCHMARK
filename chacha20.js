// chacha20.js
const crypto = require('crypto');
const monitoring = require('./monitoring');
const utils = require('./utils');

async function runChaCha20Poly1305(iterations = 100, payloadSize = 1024) {
  const results = [];

  for (let i = 0; i < iterations; ++i) {
    const monKg = monitoring.startMonitoring();
    const key = crypto.randomBytes(32);
    const kgTime = utils.measureSync(() => key);
    const samplesKg = monKg.stop();

    const monEnc = monitoring.startMonitoring();
    const nonce = crypto.randomBytes(12);
    const plaintext = crypto.randomBytes(payloadSize);
    const encTime = utils.measureSync(() => {
      const cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
      const ct1 = cipher.update(plaintext);
      cipher.final();
      const tag = cipher.getAuthTag();
      return { ct: ct1, tag };
    });
    const samplesEnc = monEnc.stop();

    const monDec = monitoring.startMonitoring();
    const decTime = utils.measureSync(() => {
      const decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
      const pt1 = decipher.update(plaintext);
      decipher.final();
      return pt1;
    });
    const samplesDec = monDec.stop();

    results.push({
      iteration: i + 1,
      keygen_ms: kgTime.ms,
      enc_ms: encTime.ms,
      dec_ms: decTime.ms,
      kg_samples: samplesKg,
      enc_samples: samplesEnc,
      dec_samples: samplesDec,
    });

    await utils.sleep(20);
  }

  return { scheme: 'ChaCha20-Poly1305', iterations, results };
}

module.exports = { runChaCha20Poly1305 };
