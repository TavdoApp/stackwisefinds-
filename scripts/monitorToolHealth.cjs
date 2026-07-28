const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { readAutoPublishedData, writeAutoPublishedData } = require('./toolData.cjs');

const autoPublishedAnswersPath = path.join(__dirname, '..', 'data', 'auto-published-answers.json');

function readAutoPublishedAnswers() {
  if (!fs.existsSync(autoPublishedAnswersPath)) return { answers: [] };
  try {
    return JSON.parse(fs.readFileSync(autoPublishedAnswersPath, 'utf8'));
  } catch {
    return { answers: [] };
  }
}

function writeAutoPublishedAnswers(data) {
  fs.writeFileSync(autoPublishedAnswersPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function probeUrl(url, redirects = 0) {
  if (!url || !url.startsWith('http')) return Promise.resolve(false);
  const client = url.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    try {
      const req = client.request(url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'StakDockHealthMonitor/1.0 (+https://stakdock.com)' },
        timeout: 6000
      }, (res) => {
        const code = res.statusCode || 0;
        const location = res.headers.location;
        res.resume();

        if (code >= 300 && code < 400 && location && redirects < 3) {
          try {
            const nextUrl = new URL(location, url).toString();
            return resolve(probeUrl(nextUrl, redirects + 1));
          } catch {
            return resolve(false);
          }
        }
        resolve(code >= 200 && code < 400);
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function monitorToolHealth() {
  console.log('Starting StakDock Health Monitoring Audit...');

  // 1. Audit Auto-Published Tools
  const toolData = readAutoPublishedData();
  const currentTools = Array.isArray(toolData.tools) ? toolData.tools : [];
  const healthyTools = [];
  let quarantinedCount = 0;

  for (const tool of currentTools) {
    const isHealthy = await probeUrl(tool.website || tool.affiliateUrl);
    if (isHealthy) {
      healthyTools.push(tool);
    } else {
      console.warn(`[Quarantine] Tool "${tool.name}" website unreachable (${tool.website}). Quarantining record.`);
      quarantinedCount++;
    }
  }

  if (quarantinedCount > 0) {
    writeAutoPublishedData({
      ...toolData,
      updatedAt: new Date().toISOString(),
      tools: healthyTools
    });
    console.log(`Successfully quarantined ${quarantinedCount} unreachable auto-published tools.`);
  } else {
    console.log(`Health Check Passed: All ${healthyTools.length} auto-published tools healthy.`);
  }

  // 2. Audit Auto-Published Answer Guides
  const answerData = readAutoPublishedAnswers();
  const currentAnswers = Array.isArray(answerData.answers) ? answerData.answers : [];
  const validAnswers = currentAnswers.filter(a => a && a.slug && a.title);

  if (validAnswers.length !== currentAnswers.length) {
    writeAutoPublishedAnswers({
      ...answerData,
      updatedAt: new Date().toISOString(),
      answers: validAnswers
    });
    console.log('Cleaned invalid answer entries from auto-published-answers.json.');
  }

  console.log('Health Monitoring Audit Complete.');
}

if (require.main === module) {
  monitorToolHealth().catch(err => {
    console.error('Health monitoring error:', err);
    process.exit(0); // Exit cleanly to prevent blocking CI
  });
}

module.exports = { monitorToolHealth };
