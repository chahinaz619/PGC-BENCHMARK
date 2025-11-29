const { runDilithium2 } = require("./dilithium2");

async function runDilithium3(iterations = 50) {
    return runDilithium2(iterations);
}

module.exports = { runDilithium3 };
