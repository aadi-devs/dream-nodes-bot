const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function toBase64(filePath, mimeType) {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath).toString('base64');
    return `data:${mimeType};base64,${data}`;
  }
  return '';
}

const logoBase64 = toBase64(path.join(__dirname, '..', 'assets', 'logo.jpg'), 'image/jpeg');
const announceBase64 = toBase64(path.join(__dirname, '..', 'emojis', 'Emojis', 'announce.gif'), 'image/gif');
const sparklesBase64 = toBase64(path.join(__dirname, '..', 'emojis', 'Emojis', 'sparkles_sparkles.gif'), 'image/gif');
const lightningBase64 = toBase64(path.join(__dirname, '..', 'emojis', 'Emojis', 'Lightning.gif'), 'image/gif');
const settingsBase64 = toBase64(path.join(__dirname, '..', 'emojis', 'Emojis', 'settings.gif'), 'image/gif');
const tickBase64 = toBase64(path.join(__dirname, '..', 'emojis', 'Emojis', 'Tick5.gif'), 'image/gif');
const updatesBase64 = toBase64(path.join(__dirname, '..', 'emojis', 'Emojis', 'updates.gif'), 'image/gif');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #313338;
      color: #dbdee1;
      font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
      padding: 30px 40px;
      display: flex;
      justify-content: center;
    }
    .discord-message {
      display: flex;
      gap: 16px;
      width: 100%;
      max-width: 820px;
    }
    .avatar-wrap {
      flex-shrink: 0;
    }
    .avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
    }
    .message-content {
      flex: 1;
      min-width: 0;
    }
    .header-line {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .bot-name {
      font-weight: 700;
      color: #f2f3f5;
      font-size: 15px;
    }
    .bot-badge {
      background: #5865f2;
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .bot-badge svg {
      width: 10px;
      height: 10px;
      fill: currentColor;
    }
    .timestamp {
      font-size: 12px;
      color: #949ba4;
      font-weight: 500;
    }
    .container-v2 {
      background: #2b2d31;
      border: 1px solid #1e1f22;
      border-radius: 8px;
      padding: 18px 22px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    }
    .emoji-inline {
      width: 20px;
      height: 20px;
      vertical-align: -3px;
      display: inline-block;
    }
    .title-h1 {
      font-size: 21px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      letter-spacing: -0.4px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .title-sub {
      font-size: 14.5px;
      color: #dbdee1;
      font-weight: 600;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    .divider {
      border: none;
      border-top: 1px solid #3f4147;
      margin: 14px 0;
    }
    .section-h3 {
      font-size: 15px;
      font-weight: 700;
      color: #f2f3f5;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .quote-box {
      border-left: 4px solid #5865f2;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 0 6px 6px 0;
      padding: 10px 14px;
      margin-bottom: 12px;
      color: #dbdee1;
      font-size: 14px;
      line-height: 1.5;
    }
    .quote-item {
      margin-bottom: 10px;
    }
    .quote-item:last-child {
      margin-bottom: 0;
    }
    .quote-title {
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .quote-desc {
      color: #c4c9ce;
      font-size: 13.5px;
    }
    .inline-code {
      background: #1e1f22;
      color: #f2f3f5;
      padding: 2px 5px;
      border-radius: 4px;
      font-family: Consolas, monospace;
      font-size: 12.5px;
    }
    .bullet-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 13.5px;
      color: #dbdee1;
    }
    .cta-row {
      margin-top: 12px;
      font-size: 14px;
      color: #dbdee1;
      line-height: 1.5;
    }
    .mention-role {
      background: rgba(88, 101, 242, 0.3);
      color: #c9cdfb;
      padding: 1px 6px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 13px;
    }
    .mention-channel {
      background: rgba(255, 255, 255, 0.08);
      color: #dbdee1;
      padding: 1px 6px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 13px;
    }
    .url-link {
      color: #00a8fc;
      text-decoration: none;
      word-break: break-all;
    }
    .action-row {
      display: flex;
      gap: 10px;
      margin-top: 14px;
      flex-wrap: wrap;
    }
    .btn {
      background: #383a40;
      border: 1px solid #45474e;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 13.5px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      cursor: pointer;
    }
    .btn:hover {
      background: #404249;
    }
    .footer-note {
      font-size: 12px;
      color: #949ba4;
      margin-top: 14px;
    }
  </style>
</head>
<body>
  <div class="discord-message">
    <div class="avatar-wrap">
      <img class="avatar" src="${logoBase64}" alt="DreamNodes Avatar" />
    </div>
    <div class="message-content">
      <div class="header-line">
        <span class="bot-name">DreamNodes</span>
        <span class="bot-badge">
          <svg viewBox="0 0 16 16"><path d="M7.4 11.9 4.2 8.7l1.1-1.1 2.1 2.1 4.4-4.4 1.1 1.1z"/></svg>
          APP
        </span>
        <span class="timestamp">Today at 9:34 PM</span>
      </div>

      <div class="container-v2">
        <div class="title-h1">
          <img class="emoji-inline" src="${updatesBase64}" />
          <span>DREAM NODES ┃ SYSTEM CHANGELOG</span>
          <img class="emoji-inline" src="${sparklesBase64}" />
        </div>

        <div class="title-sub">
          <div>╭・<img class="emoji-inline" src="${announceBase64}" /> <strong>Control Panel & System Infrastructure Update</strong></div>
          <div>╰┈➤ <img class="emoji-inline" src="${lightningBase64}" /> <strong>Version 1.2.0 • Feature & Proxy Release</strong></div>
        </div>

        <hr class="divider" />

        <div class="section-h3">
          <img class="emoji-inline" src="${settingsBase64}" />
          <span>What's New in this Release:</span>
        </div>

        <div class="quote-box">
          <div class="quote-item">
            <div class="quote-title"><span class="inline-code">~</span> 🎨 <strong>Panel Theme Updated (Nebula)</strong></div>
            <div class="quote-desc">The server management dashboard has been upgraded to the high-performance <strong>Nebula Theme</strong>, offering an ultra-clean modern UI, improved mobile responsiveness, and dark-mode optimization.</div>
          </div>
          
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 8px 0;" />

          <div class="quote-item">
            <div class="quote-title"><span class="inline-code">~</span> 👤 <strong>Client Account Registration Added</strong></div>
            <div class="quote-desc">Direct user self-registration is now fully operational on the panel! New clients can immediately create accounts and manage servers with zero onboarding delay.</div>
          </div>

          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 8px 0;" />

          <div class="quote-item">
            <div class="quote-title"><span class="inline-code">~</span> 🚀 <strong>Velocity Proxy Egg & Java 25 Support Added</strong></div>
            <div class="quote-desc">Official <strong>Velocity Proxy</strong> egg has been introduced into our Minecraft node catalog, pre-configured and updated with support for modern Java runtimes (including Java 25 & 21 LTS) for optimal network routing.</div>
          </div>
        </div>

        <hr class="divider" />

        <div class="bullet-row">
          <img class="emoji-inline" src="${tickBase64}" />
          <span>Next-Gen NVMe Arrays • Instant Node Synchronization • Automated DDoS Mitigation</span>
        </div>
        <div class="bullet-row">
          <img class="emoji-inline" src="${tickBase64}" />
          <span>Active 24/7 Client Care • 99.9% Infrastructure Uptime SLA</span>
        </div>

        <div class="cta-row">
          📩 <strong>Have questions or need assistance?</strong> Open a ticket in <span class="mention-channel"># ⊘・ᴄʀᴇᴀᴛᴇ-ᴛɪᴄᴋᴇᴛ</span> <span class="mention-role">@⋆｡°✩ ƈʅιҽɳƚ ✩°｡⋆</span><br>
          <a class="url-link" href="https://discord.com/channels/1573272872737181696/1573281601775870043">https://discord.com/channels/1573272872737181696/1573281601775870043</a>
        </div>

        <hr class="divider" />

        <div class="action-row">
          <div class="btn">
            <span>🌐</span>
            <span>Client Panel</span>
          </div>
          <div class="btn">
            <span>🎫</span>
            <span>Open a Ticket</span>
          </div>
          <div class="btn">
            <span>📖</span>
            <span>How To Buy</span>
          </div>
          <div class="btn">
            <span>📜</span>
            <span>Official Website</span>
          </div>
        </div>

        <div class="footer-note">
          -# 💙 Dream Nodes • High-Performance Cloud Hosting & 24/7 Client Care Desk
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

const previewHtmlPath = path.join(__dirname, '..', 'preview_changelog.html');
fs.writeFileSync(previewHtmlPath, htmlContent, 'utf8');

const artifactDir = 'C:\\\\Users\\\\suman\\\\.gemini\\\\antigravity\\\\brain\\\\665e6595-2842-48ae-8678-cd5b7e9e7121';
const screenshotPath = path.join(artifactDir, 'changelog_embed_preview.png');

const chromePath = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${screenshotPath}" --window-size=920,860 "${previewHtmlPath}"`;

console.log('Rendering screenshot using Chrome headless...');
execSync(cmd);

console.log('Screenshot generated:', fs.existsSync(screenshotPath), screenshotPath);
