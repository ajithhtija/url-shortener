async function fetchList() {
  const res = await fetch('/api/url');
  const data = await res.json();
  const ul = document.getElementById('list');
  ul.innerHTML = '';
  data.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '/' + item.shortId;
    a.textContent = window.location.origin + '/' + item.shortId;
    a.target = '_blank';
    li.appendChild(a);
    
    // Add QR code button
    const qrBtn = document.createElement('button');
    qrBtn.textContent = 'QR Code';
    qrBtn.className = 'qr-btn';
    qrBtn.onclick = async () => {
      const qrRes = await fetch(`/api/url/qr/${item.shortId}`);
      const qrData = await qrRes.json();
      showQRCodeModal(qrData.qrCode, item.shortId);
    };
    li.appendChild(qrBtn);
    
    // Add view clicks button
    const clicksBtn = document.createElement('button');
    clicksBtn.textContent = 'Clicks';
    clicksBtn.className = 'info-btn';
    clicksBtn.onclick = () => {
      alert(`Total Clicks: ${item.clicks}`);
    };
    li.appendChild(clicksBtn);
    
    // Add view original URL button
    const urlBtn = document.createElement('button');
    urlBtn.textContent = 'Original';
    urlBtn.className = 'info-btn';
    urlBtn.onclick = () => {
      alert(`Original URL:\n\n${item.originalUrl}`);
    };
    li.appendChild(urlBtn);
    
    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.className = 'copy-btn';
    copyBtn.onclick = async () => {
      const shortUrl = window.location.origin + '/' + item.shortId;
      await navigator.clipboard.writeText(shortUrl);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    };
    li.appendChild(copyBtn);
    
    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = async () => {
      if (confirm('Delete this URL?')) {
        await fetch(`/api/url/${item._id}`, { method: 'DELETE' });
        fetchList();
      }
    };
    li.appendChild(deleteBtn);
    ul.appendChild(li);
  });
}

function showQRCodeModal(qrCodeDataUrl, shortId) {
  const modal = document.createElement('div');
  modal.className = 'qr-modal';
  modal.innerHTML = `
    <div class="qr-modal-content">
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h3>QR Code for ${shortId}</h3>
      <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-image" />
      <a href="${qrCodeDataUrl}" download="qrcode-${shortId}.png" class="download-link">Download QR Code</a>
    </div>
  `;
  document.body.appendChild(modal);
}

function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

document.getElementById('shorten-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const originalUrl = document.getElementById('originalUrl').value;
  const customId = document.getElementById('customId').value || undefined;
  const out = document.getElementById('result');
  
  // Validate URL
  if (!isValidUrl(originalUrl)) {
    out.textContent = '❌ Invalid URL! Please enter a valid URL (e.g., https://example.com)';
    out.style.color = '#cc0000';
    return;
  }
  
  const res = await fetch('/api/url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl, customId })
  });
  const data = await res.json();
  if (res.ok) {
    out.innerHTML = `✅ <a href="/${data.shortId}">${window.location.origin}/${data.shortId}</a>`;
    out.style.color = '#00aa00';
    fetchList();
  } else {
    out.textContent = '❌ ' + (data.message || 'Error');
    out.style.color = '#cc0000';
  }
});

fetchList();
