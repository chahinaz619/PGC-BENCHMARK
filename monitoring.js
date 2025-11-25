// monitoring.js
const os = require('os');
const fs = require('fs');

const SAMPLE_INTERVAL_MS = 250;

function readCPULoadPercent() {
  const load = os.loadavg()[0];
  const cores = os.cpus().length || 1;
  return (load / cores) * 100;
}

function readMemory() {
  return {
    free: os.freemem(),
    total: os.totalmem(),
    used: os.totalmem() - os.freemem(),
  };
}

function readTemperature() {
  try {
    const path = '/sys/class/thermal/thermal_zone0/temp';
    if (fs.existsSync(path)) {
      const raw = fs.readFileSync(path, 'utf8').trim();
      const milli = parseInt(raw, 10);
      if (!Number.isNaN(milli)) return milli / 1000.0;
    }
  } catch {}
  return null;
}

function startMonitoring() {
  const samples = [];
  const t0 = Date.now();
  const interval = setInterval(() => {
    samples.push({
      t: Date.now() - t0,
      cpu_percent: readCPULoadPercent(),
      mem_used: readMemory().used,
      mem_total: readMemory().total,
      temp_c: readTemperature(),
    });
  }, SAMPLE_INTERVAL_MS);

  return {
    stop: () => {
      clearInterval(interval);
      return samples;
    },
    getSamples: () => samples,
  };
}

module.exports = { startMonitoring, readTemperature, readMemory, readCPULoadPercent };