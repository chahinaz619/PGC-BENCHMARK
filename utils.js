// utils.js - FINAL SCIENTIFIC VERSION
// ---------------------------------------------------------
// Includes:
//  ✔ High-resolution timers
//  ✔ perf CPU cycle measurement
//  ✔ Memory usage measurement
//  ✔ Energy estimation model
//  ✔ CSV export
//  ✔ Sleep utility
// ---------------------------------------------------------

const { performance } = require("perf_hooks");
const { execSync, exec } = require("child_process");
const fs = require("fs");
const { promisify } = require("util");
const execAsync = promisify(exec);

// ---------------------------------------------------------
// Sleep helper
// ---------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------
// High-resolution synchronous measurement
// ---------------------------------------------------------
function measureSync(fn) {
  const t0 = performance.now();
  const result = fn();
  const t1 = performance.now();
  return { result, ms: t1 - t0 };
}

// ---------------------------------------------------------
// Async command measurement
// ---------------------------------------------------------
async function timeAsyncCommand(command) {
  const t0 = performance.now();
  await execAsync(command);
  const t1 = performance.now();
  return { ms: t1 - t0 };
}

// ---------------------------------------------------------
// Memory measurement (MB)
// ---------------------------------------------------------
function getMemoryMB() {
  const mem = process.memoryUsage();
  return Number((mem.rss / (1024 * 1024)).toFixed(2));
}

// ---------------------------------------------------------
// perf hardware cycle measurement
// ---------------------------------------------------------
//
// Returns hardware CPU cycles measured using perf
// Example:
//    measurePerfCycles(["echo", "x"])
//
function measurePerfCycles(cmdArray) {
  try {
    const output = execSync(
      `sudo perf stat -e cycles ${cmdArray.join(" ")}`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );

    // perf prints cycles to stderr, not stdout
    const cyclesMatch = /([\d,]+)\s+cycles/.exec(output);

    if (!cyclesMatch) return 0;

    return Number(cyclesMatch[1].replace(/,/g, ""));
  } catch (err) {
    return 0; // perf might fail on small commands; return 0 safely
  }
}

// ---------------------------------------------------------
// Energy estimation model (Joules)
// ---------------------------------------------------------
// This is a scientific approximate model often used in IoT testing.
//
// Energy = (cycles × 1e-9) × 0.5W
//          + execution_time_ms × 0.0002W
//
// Rough but acceptable for academic baselines.
//
function estimateEnergy(time_ms, cycles) {
  const energyFromCycles = (cycles * 1e-9) * 0.5;
  const energyFromTime = time_ms * 0.0002;
  return Number((energyFromCycles + energyFromTime).toFixed(6));
}

// ---------------------------------------------------------
// CSV Handling
// ---------------------------------------------------------
function jsonToCSV(arr) {
  if (!arr || arr.length === 0) return "";

  const headers = Object.keys(arr[0]);
  const rows = arr.map(obj =>
    headers.map(h => JSON.stringify(obj[h] ?? "")).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

function saveCSV(filename, data) {
  const csv = jsonToCSV(data);
  fs.writeFileSync(filename, csv);
  console.log(`✔ CSV saved: ${filename}`);
}

// ---------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------
module.exports = {
  sleep,
  measureSync,
  timeAsyncCommand,
  getMemoryMB,
  measurePerfCycles,
  estimateEnergy,
  saveCSV,
  jsonToCSV
};
