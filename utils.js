// utils.js — FINAL SCIENTIFIC VERSION
// Includes: perf metrics, energy model, timing utilities, memory sampling

const { performance } = require("perf_hooks");
const { execSync } = require("child_process");
const fs = require("fs");

// -----------------------------------------------------
// Sleep helper
// -----------------------------------------------------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// -----------------------------------------------------
// Memory usage (MB)
// -----------------------------------------------------
function getMemoryMB() {
    const mem = process.memoryUsage();
    return {
        rss: (mem.rss / 1024 / 1024).toFixed(2),
        heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(2),
        heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(2)
    };
}

// -----------------------------------------------------
// PERF measurement (Model A — lightweight echo commands)
// -----------------------------------------------------
function measurePerfCycles(cmdArray) {
    try {
        const perfCmd = [
            "perf", "stat",
            "-e", "cycles,instructions,cache-misses,branch-misses",
            ...cmdArray
        ];

        const output = execSync(perfCmd.join(" "), { stderr: "pipe" }).toString();

        const cycles = parseFloat(output.match(/([\d,]+)\s+cycles/)?.[1].replace(/,/g, "")) || 0;
        const instr = parseFloat(output.match(/([\d,]+)\s+instructions/)?.[1].replace(/,/g, "")) || 0;
        const cache = parseFloat(output.match(/([\d,]+)\s+cache-misses/)?.[1].replace(/,/g, "")) || 0;
        const branch = parseFloat(output.match(/([\d,]+)\s+branch-misses/)?.[1].replace(/,/g, "")) || 0;

        return { cycles, instr, cache, branch };

    } catch (err) {
        return { cycles: 0, instr: 0, cache: 0, branch: 0 };
    }
}

// -----------------------------------------------------
// Simple energy estimation model (not hardware-accurate)
// -----------------------------------------------------
function estimateEnergy(ms, cycles) {
    const cpuFreqGHz = 1.5; // Raspberry Pi 4 → 1.5GHz
    return (cycles / (cpuFreqGHz * 1e9)).toFixed(9);
}

// -----------------------------------------------------
// CSV SAVE
// -----------------------------------------------------
function saveCSV(filename, dataArray) {
    const headers = Object.keys(dataArray[0]).join(",");
    const rows = dataArray.map(obj =>
        Object.values(obj)
            .map(v => JSON.stringify(v ?? ""))
            .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    fs.writeFileSync(filename, csv);

    console.log(`✔ CSV saved: ${filename}`);
}

// -----------------------------------------------------
module.exports = {
    sleep,
    getMemoryMB,
    measurePerfCycles,
    estimateEnergy,
    saveCSV
};
