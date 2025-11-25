// utils.js
// Generic utilities for timing, memory, CPU, and CSV formatting

const { performance } = require('perf_hooks');
const { writeFileSync } = require('fs');

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
  getMemoryUsage,
  getCpuUsage,
  jsonToCSV,
  saveCSV,
};