const https = require('https');

const botToken = '8893841010:AAHEaWaZgPfKks3ZchCfR0TjVIrsbLvCjSU';
const chatId = '1088779618';

const payload = JSON.stringify({
  chat_id: chatId,
  text: "🚨 <b>STAKDOCK TELEGRAM ALERT TEST OK!</b>\n\nSystem verification test passed.",
  parse_mode: 'HTML'
});

const req = https.request(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Telegram API Response:', body));
});

req.write(payload);
req.end();
