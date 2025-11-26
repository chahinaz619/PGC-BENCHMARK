// utils.js
// Generic utilities for timing, memory, CPU, and CSV formatting

const { performance } = require('perf_hooks');
const { writeFileSync } = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// FIX: add missing function for Dilithium benchmarks
async function timeAsyncCommand(command) {
    const start = performance.now();
    await execAsync(command);
    const end = performance.now();
    return { ms: end - start };
}

// Export it together with existing functions
module.exports.timeAsyncCommand = timeAsyncCommand;
// ------------------------------------------------------------
// High-resolution timing utility
// ------------------------------------------------------------
function measureAsync(fn) {
  const start = performance.now();
  return fn().then((result) => {
    const end = performance.now();
    return { result, timeMs: end - start };
  });
}
function measureSync(fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, ms: end - start };
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// ------------------------------------------------------------
// Memory usage logger
// ------------------------------------------------------------
function getMemoryUsage() {
  const mem = process.memoryUsage();
  return {
    rss: mem.rss, // Resident Set Size
    heapTotal: mem.heapTotal,
    heapUsed: mem.heapUsed,
    external: mem.external,
  };
}

// ------------------------------------------------------------
// CPU usage logger
// ------------------------------------------------------------
function getCpuUsage() {
  const cpu = process.cpuUsage();
  return {
    user: cpu.user, // microseconds
    system: cpu.system,
  };
}

// ------------------------------------------------------------
// CSV Export
// ------------------------------------------------------------
function jsonToCSV(jsonArray) {
  if (!jsonArray || jsonArray.length === 0) return '';

  const headers = Object.keys(jsonArray[0]);
  const rows = jsonArray.map((obj) =>
    headers.map((h) => JSON.stringify(obj[h] ?? '')).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

function saveCSV(filename, dataArray) {
  const csv = jsonToCSV(dataArray);
  writeFileSync(filename, csv);
  console.log(`✔ CSV saved: ${filename}`);
}

// ------------------------------------------------------------
// Export
// ------------------------------------------------------------
module.exports = {
  measureAsync,
  measureSync,
  getMemoryUsage,
  getCpuUsage,
  jsonToCSV,
  saveCSV,
  timeAsyncCommand,
  sleep,
};