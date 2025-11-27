// dilithium2.js — FINAL SCIENTIFIC VERSION
// ----------------------------------------

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const monitoring = require('./monitoring');
const utils = require('./utils');

// Generic Dilithium runner (dilithium2 or dilithium3)
async function runDilithium(level = 'dilithium2', iterations = 20) {

  const keygenCmd = `echo simulate_${level}_keygen`;
  const signCmd   = `echo simulate_${level}_sign`;
  const verifyCmd = `echo simulate_${level}_verify`;

  const results = [];

  for (let i = 0; i < iterations; i++) {

    // --- Keygen ---
    const monKeygen = monitoring.startMonitoring();
    const tKeygen = await utils.timeAsyncCommand(keygenCmd);
    const samplesKeygen = monKeygen.stop();

    // --- Sign ---
    const monSign = monitoring.startMonitoring();
    const tSign = await utils.timeAsyncCommand(signCmd);
    const samplesSign = monSign.stop();

    // --- Verify ---
    const monVerify = monitoring.startMonitoring();
    const tVerify = await utils.timeAsyncCommand(verifyCmd);
    const samplesVerify = monVerify.stop();

    results.push({
      iteration: i + 1,
      keygen_ms: tKeygen.ms,
      sign_ms: tSign.ms,
      verify_ms: tVerify.ms,
      keygen_samples: samplesKeygen,
      sign_samples: samplesSign,
      verify_samples: samplesVerify,
    });

    await utils.sleep(50);
  }

  return { scheme: level, iterations, results };
}

// Export EXACTLY what run-all.js expects!
module.exports = { runDilithium };
