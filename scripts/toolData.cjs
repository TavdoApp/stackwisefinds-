const fs = require('fs');
const path = require('path');

const staticDataPath = path.join(__dirname, '..', 'src', 'data', 'saasData.jsx');
const autoPublishedPath = path.join(__dirname, '..', 'data', 'auto-published-tools.json');

function readStaticTools() {
  const source = fs.readFileSync(staticDataPath, 'utf8');
  const match = source.match(/export const staticSaasTools = (\[[\s\S]*?\n\]);/);
  if (!match) throw new Error('Could not parse the static tool dataset.');
  return JSON.parse(match[1]);
}

function readAutoPublishedData() {
  if (!fs.existsSync(autoPublishedPath)) return { schemaVersion: 1, updatedAt: null, tools: [] };
  const data = JSON.parse(fs.readFileSync(autoPublishedPath, 'utf8'));
  return { schemaVersion: 1, updatedAt: data.updatedAt || null, tools: Array.isArray(data.tools) ? data.tools : [] };
}

function writeAutoPublishedData(data) {
  fs.writeFileSync(autoPublishedPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readAllTools() {
  const seenNames = new Set();
  return [...readStaticTools(), ...readAutoPublishedData().tools].filter((tool) => {
    if (/-\d+$/.test(tool.id) && !tool.autoQualifiedAt) return false;
    const key = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!key || seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });
}

module.exports = { readAllTools, readAutoPublishedData, writeAutoPublishedData };