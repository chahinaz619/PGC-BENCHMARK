// monitor-collector.js
// Raspberry Pi runtime monitor for PQC benchmarks
// Logs CPU usage, RAM usage, and temperature to CSV

const fs = require('fs');
const { startMonitoring } = require('./monitoring');
const { saveCSV } = require('./utils');

const OUTPUT_FILE = 'system_log.csv';
const INTERVAL_MS = 500; // sample every 0.5 seconds

console.log('Starting system monitor...');

const samples = [];
const monitor = startMonitoring();

// Function to periodically collect samples
const interval = setInterval(() => {
  const latestSamples = monitor.getSamples();
  if (latestSamples.length > 0) {
    samples.push(latestSamples[latestSamples.length - 1]);
    // Optional: print to console
    const s = latestSamples[latestSamples.length - 1];
    console.log(`t=${s.t}ms CPU=${s.cpu_percent.toFixed(1)}% MEM=${(s.mem_used/1024/1024).toFixed(1)}MB TEMP=${s.temp_c??'N/A'}°C`);
  }
}, INTERVAL_MS);

// Stop function to end monitoring and save CSV
function stopMonitoring() {
  clearInterval(interval);
  const csvFile = OUTPUT_FILE;
  saveCSV(csvFile, samples);
  console.log(`System monitoring stopped. CSV saved: ${csvFile}`);
}

// Handle Ctrl+C to stop gracefully
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Stopping monitor...');
  stopMonitoring();
  process.exit();
});

// Export for optional programmatic control
module.exports = { stopMonitoring };

console.log('Monitor running. Press Ctrl+C to stop.');
