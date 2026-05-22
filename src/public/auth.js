function switchTab(tab) {
  document.querySelectorAll('.auth-form').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  event.target.classList.add('active');
}

async function handleSignUp(e) {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;
  const msg = document.getElementById('signup-message');

  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, confirmPassword })
  });

  const data = await res.json();
  if (res.ok) {
    msg.style.color = '#00aa00';
    msg.textContent = '✅ Signup successful! Redirecting...';
    setTimeout(() => location.reload(), 1500);
  } else {
    msg.style.color = '#cc0000';
    msg.textContent = '❌ ' + data.message;
  }
}

async function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  const msg = document.getElementById('signin-message');

  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    msg.style.color = '#00aa00';
    msg.textContent = '✅ Signin successful! Redirecting...';
    setTimeout(() => location.reload(), 1500);
  } else {
    msg.style.color = '#cc0000';
    msg.textContent = '❌ ' + data.message;
  }
}

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  location.reload();
}
