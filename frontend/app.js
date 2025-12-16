// Frontend behavior: send contact form to backend /api/contact
const form = document.getElementById('contactForm');
const status = document.getElementById('status');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Enviando...';
  const payload = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      status.textContent = 'Mensaje enviado correctamente.';
      form.reset();
    } else {
      status.textContent = data.error || 'Error al enviar.';
    }
  } catch (err) {
    status.textContent = 'Error de conexión: ' + err.message;
  }
});
