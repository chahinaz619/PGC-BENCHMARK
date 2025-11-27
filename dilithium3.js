const { runDilithium } = require('./dilithium2');

async function runDilithium3(iterations = 20) {
  return runDilithium('dilithium3', iterations);
}

module.exports = { runDilithium3 };
