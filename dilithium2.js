// dilithium2.js
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const monitoring = require('./monitoring');
const utils = require('./utils');

async function runDilithium(level = 'dilithium2', iterations = 20) {
  const keygenCmd = process.env.DILITHIUM_KEYGEN_CMD || `echo "simulate_${level}_keygen"`;
  const signCmd = process.env.DILITHIUM_SIGN_CMD || `echo "simulate_${level}_sign"`;
  const verifyCmd = process.env.DILITHIUM_VERIFY_CMD || `echo "simulate_${level}_verify"`;

  const results = [];

  for (let i = 0; i < iterations; ++i) {
    const monKeygen = monitoring.startMonitoring();
    const tKeygen = await utils.timeAsyncCommand(keygenCmd);
    const samplesKeygen = monKeygen.stop();

    const monSign = monitoring.startMonitoring();
    const tSign = await utils.timeAsyncCommand(signCmd);
    const samplesSign = monSign.stop();

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

    await utils.sleep(100);
  }

  return { scheme: level, iterations, results };
}

module.exports = { runDilithium };
