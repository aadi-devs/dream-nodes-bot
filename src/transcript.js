/**
 * Dream Nodes Ticket System - Standalone HTML Transcript Generator
 * Generates rich, Discord-themed dark mode HTML transcripts with zero external runtime dependencies.
 */

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderMarkdown(text, client = null, guild = null) {
  if (!text) return '';
  let s = escapeHtml(text);

  // Code blocks: ```lang ... ```
  s = s.replace(/```(?:([a-zA-Z0-9_-]+)\n)?([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
  });

  // Inline code: `code`
  s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Bold & Italic: ***text***
  s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold: **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Strikethrough: ~~text~~
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // Underline: __text__
  s = s.replace(/__([^_]+)__/g, '<u>$1</u>');

  // Blockquotes: > quote
  s = s.replace(/^(?:&gt;|>)[ ]?(.*)$/gm, '<div class="quote">$1</div>');

  // Channel mentions: &lt;#123456789&gt;
  s = s.replace(/&lt;#(\d+)&gt;/g, (match, id) => {
    const ch = guild?.channels?.cache?.get(id);
    const name = ch ? ch.name : id;
    return `<span class="mention">#${escapeHtml(name)}</span>`;
  });

  // Role mentions: &lt;@&amp;123456789&gt;
  s = s.replace(/&lt;@&amp;(\d+)&gt;/g, (match, id) => {
    const r = guild?.roles?.cache?.get(id);
    const name = r ? r.name : 'role';
    return `<span class="mention">@${escapeHtml(name)}</span>`;
  });

  // User mentions: &lt;@!?123456789&gt;
  s = s.replace(/&lt;@!?(\d+)&gt;/g, (match, id) => {
    const m = guild?.members?.cache?.get(id);
    const name = m ? m.user.tag : id;
    return `<span class="mention">@${escapeHtml(name)}</span>`;
  });

  // Links: [label](url)
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Raw URLs
  s = s.replace(/(^|[^"])((?:https?:\/\/)[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');

  // Newlines to <br>
  s = s.replace(/\n/g, '<br>');

  return s;
}

function formatDuration(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

/**
 * Generate complete HTML transcript string
 */
function generateHtmlTranscript(ticket, messages, guild = null) {
  const sortedMessages = [...messages.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp);
  const openTime = ticket.createdAt ? new Date(ticket.createdAt * 1000).toUTCString() : 'Unknown';
  const closeTime = new Date().toUTCString();
  const durationStr = ticket.createdAt ? formatDuration((Date.now() / 1000) - ticket.createdAt) : 'N/A';

  const intakeRows = (ticket.intakeAnswers || []).map(ans => `
    <div class="intake-row">
      <div class="intake-label">${escapeHtml(ans.label)}</div>
      <div class="intake-val">${escapeHtml(ans.value)}</div>
    </div>
  `).join('');

  const messageHtmls = sortedMessages.map(msg => {
    const isBot = msg.author.bot;
    const isCreator = msg.author.id === ticket.userId;
    const isClaimer = msg.author.id === ticket.claimedBy;
    const avatarUrl = msg.author.displayAvatarURL ? msg.author.displayAvatarURL({ size: 64, extension: 'png' }) : '';
    const dateFormatted = new Date(msg.createdTimestamp).toLocaleString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' UTC';

    let badges = '';
    if (isBot) badges += '<span class="badge badge-bot">BOT</span>';
    if (isClaimer) badges += '<span class="badge badge-staff">STAFF</span>';
    if (isCreator) badges += '<span class="badge badge-op">CREATOR</span>';

    // Attachments
    let attachmentsHtml = '';
    if (msg.attachments && msg.attachments.size > 0) {
      const attItems = [...msg.attachments.values()].map(att => {
        const isImage = att.contentType && att.contentType.startsWith('image/');
        if (isImage) {
          return `
            <div class="attachment-item">
              <a href="${att.url}" target="_blank"><img class="attachment-img" src="${att.url}" alt="${escapeHtml(att.name)}" /></a>
              <div class="attachment-name">${escapeHtml(att.name)} (${(att.size / 1024).toFixed(1)} KB)</div>
            </div>
          `;
        }
        return `
          <div class="attachment-item">
            📎 <a href="${att.url}" target="_blank">${escapeHtml(att.name)}</a> (${(att.size / 1024).toFixed(1)} KB)
          </div>
        `;
      }).join('');
      attachmentsHtml = `<div class="attachments-wrap">${attItems}</div>`;
    }

    // Embeds
    let embedsHtml = '';
    if (msg.embeds && msg.embeds.length > 0) {
      embedsHtml = msg.embeds.map(emb => {
        const colorHex = emb.color ? `#${emb.color.toString(16).padStart(6, '0')}` : '#5865f2';
        return `
          <div class="embed-box" style="border-left-color: ${colorHex};">
            ${emb.title ? `<div class="embed-title">${escapeHtml(emb.title)}</div>` : ''}
            ${emb.description ? `<div class="embed-desc">${renderMarkdown(emb.description, null, guild)}</div>` : ''}
            ${(emb.fields || []).map(f => `
              <div class="embed-field">
                <div class="embed-field-name">${escapeHtml(f.name)}</div>
                <div class="embed-field-val">${renderMarkdown(f.value, null, guild)}</div>
              </div>
            `).join('')}
          </div>
        `;
      }).join('');
    }

    return `
      <div class="message" id="msg-${msg.id}">
        <div class="msg-avatar-wrap">
          ${avatarUrl 
            ? `<img class="avatar-img" src="${avatarUrl}" alt="${escapeHtml(msg.author.username)}" />` 
            : `<div class="avatar-fallback">${escapeHtml(msg.author.username[0].toUpperCase())}</div>`
          }
        </div>
        <div class="msg-body">
          <div class="msg-header">
            <span class="author-name">${escapeHtml(msg.author.tag || msg.author.username)}</span>
            ${badges}
            <span class="msg-timestamp">${dateFormatted}</span>
          </div>
          <div class="msg-content">
            ${renderMarkdown(msg.content, null, guild) || (attachmentsHtml || embedsHtml ? '' : '<em>[No text content]</em>')}
          </div>
          ${attachmentsHtml}
          ${embedsHtml}
        </div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket #${escapeHtml(ticket.ticketNum)} Transcript - Dream Nodes</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #1e1f22;
      color: #dbdee1;
      font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 15px;
      line-height: 1.4;
      padding: 24px;
    }
    a { color: #00a8fc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: #2b2d31;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      border: 1px solid #35373c;
    }
    .header {
      background: linear-gradient(135deg, #111214 0%, #1e1f22 100%);
      padding: 24px 32px;
      border-bottom: 2px solid #35373c;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: -0.5px;
    }
    .ticket-badge {
      background: #5865f2;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 16px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      background: rgba(0,0,0,0.25);
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #35373c;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .meta-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #949ba4;
      letter-spacing: 0.5px;
    }
    .meta-value {
      font-size: 14px;
      font-weight: 600;
      color: #f2f3f5;
    }
    .intake-card {
      background: #232428;
      border-left: 4px solid #5865f2;
      margin: 20px 32px;
      padding: 16px 20px;
      border-radius: 4px 8px 8px 4px;
    }
    .intake-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      color: #949ba4;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .intake-row {
      margin-bottom: 8px;
    }
    .intake-row:last-child {
      margin-bottom: 0;
    }
    .intake-label {
      font-size: 13px;
      font-weight: 600;
      color: #b5bac1;
    }
    .intake-val {
      font-size: 14px;
      color: #f2f3f5;
      background: rgba(0,0,0,0.2);
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 2px;
    }
    .messages-container {
      padding: 24px 32px;
    }
    .message {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .message:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .msg-avatar-wrap {
      flex-shrink: 0;
    }
    .avatar-img {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
    }
    .avatar-fallback {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #5865f2;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
    }
    .msg-body {
      flex: 1;
      min-width: 0;
    }
    .msg-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      flex-wrap: wrap;
    }
    .author-name {
      font-weight: 600;
      color: #f2f3f5;
      font-size: 15px;
    }
    .badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-bot {
      background: #5865f2;
      color: #fff;
    }
    .badge-staff {
      background: #faa61a;
      color: #000;
    }
    .badge-op {
      background: #43b581;
      color: #fff;
    }
    .msg-timestamp {
      font-size: 12px;
      color: #949ba4;
    }
    .msg-content {
      color: #dbdee1;
      word-break: break-word;
      font-size: 14.5px;
    }
    .quote {
      border-left: 4px solid #4e5058;
      padding-left: 12px;
      margin: 6px 0;
      color: #949ba4;
    }
    .mention {
      background: rgba(88, 101, 242, 0.3);
      color: #c9cdfb;
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 500;
    }
    .inline-code {
      background: #1e1f22;
      padding: 2px 5px;
      border-radius: 4px;
      font-family: Consolas, monospace;
      font-size: 13px;
      color: #f2f3f5;
    }
    .code-block {
      background: #1e1f22;
      padding: 12px;
      border-radius: 6px;
      margin: 8px 0;
      overflow-x: auto;
      font-family: Consolas, monospace;
      font-size: 13px;
      color: #f2f3f5;
      border: 1px solid #35373c;
    }
    .attachments-wrap {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .attachment-img {
      max-width: 450px;
      max-height: 350px;
      border-radius: 8px;
      border: 1px solid #35373c;
    }
    .attachment-name {
      font-size: 12px;
      color: #949ba4;
      margin-top: 2px;
    }
    .embed-box {
      background: #232428;
      border-left: 4px solid #5865f2;
      padding: 12px 16px;
      border-radius: 4px;
      margin-top: 8px;
      max-width: 600px;
    }
    .embed-title {
      font-weight: 700;
      color: #f2f3f5;
      font-size: 14px;
      margin-bottom: 6px;
    }
    .embed-desc {
      font-size: 13.5px;
      color: #dbdee1;
      margin-bottom: 8px;
    }
    .embed-field {
      margin-bottom: 6px;
    }
    .embed-field-name {
      font-weight: 600;
      color: #b5bac1;
      font-size: 12px;
    }
    .embed-field-val {
      font-size: 13px;
      color: #dbdee1;
    }
    .footer {
      background: #111214;
      padding: 16px 32px;
      text-align: center;
      color: #949ba4;
      font-size: 12px;
      border-top: 1px solid #35373c;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-top">
        <div class="brand-title">
          <span>🎫 Dream Nodes Support</span>
          <span class="ticket-badge">Ticket #${escapeHtml(ticket.ticketNum)}</span>
        </div>
      </div>
      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Department</span>
          <span class="meta-value">${escapeHtml(ticket.categoryName || 'Support')}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Opened By</span>
          <span class="meta-value">${escapeHtml(ticket.userTag || ticket.userId)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Claimed By</span>
          <span class="meta-value">${escapeHtml(ticket.claimedTag || 'Unclaimed')}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Total Messages</span>
          <span class="meta-value">${sortedMessages.length}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Created At</span>
          <span class="meta-value">${openTime}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Closed At</span>
          <span class="meta-value">${closeTime}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Total Duration</span>
          <span class="meta-value">${durationStr}</span>
        </div>
      </div>
    </div>

    ${intakeRows ? `
      <div class="intake-card">
        <div class="intake-title">📋 Intake Questionnaire Information Submitted</div>
        ${intakeRows}
      </div>
    ` : ''}

    <div class="messages-container">
      ${messageHtmls || '<div style="color: #949ba4; text-align: center; padding: 20px;">No messages recorded in this ticket channel.</div>'}
    </div>

    <div class="footer">
      Dream Nodes Official Support Desk • Exported on ${closeTime} • All conversation records confidential
    </div>
  </div>
</body>
</html>`;
}

module.exports = {
  generateHtmlTranscript,
  formatDuration
};
