// csv-export.js
// Simple wrapper around utils.saveCSV for consistency

const { saveCSV } = require('./utils');

/**
 * Export results to a CSV file.
 * @param {string} filename - The output CSV filename
 * @param {Array<Object>} data - Array of JSON records
 */
function exportCSV(filename, data) {
  if (!Array.isArray(data)) {
    console.error('exportCSV: data must be an array');
    return;
  }

  try {
    saveCSV(filename, data);
  } catch (err) {
    console.error('CSV export error:', err);
  }
}

module.exports = { exportCSV };
