document.addEventListener("DOMContentLoaded", () => {
  // Obtener datos del usuario actual desde la sesión
  fetch('/api/user-data')
    .then(r => r.json())
    .then(userData => {
      renderProfile(userData);
      renderCourses(userData);
      renderSessions(userData);
      renderPayments(userData);
    });

  function renderProfile(data) {
    const c = document.getElementById("profile");
    if (!c) return;
    
    c.innerHTML = `
      <div class="card profile-container">
        <img src="${data.avatarurl}" alt="Avatar" width="100" style="border-radius:50%;margin-right:1rem;">
        <div>
          <h2>${data.name}</h2>
          <p><strong>DNI:</strong> ${data.dni || 'N/A'}</p>
          <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
          <p><strong>Carrera:</strong> ${data.carreer || 'N/A'}</p>
          ${data.role === 'admin' ? `<p><strong>Usuarios:</strong> ${data.admin_data?.usuarios || 0}</p>` : ''}
        </div>
      </div>`;
  }

  // ... (funciones similares para renderCourses, etc. que usen 'data' en lugar del objeto global)
});