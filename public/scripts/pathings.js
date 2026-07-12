document.addEventListener('DOMContentLoaded', () => {
  // Obtener el ID del campeón desde la URL
  const path = window.location.pathname; // ej: /pathing/Aatrox
  const champId = path.split('/').pop();

  const container = document.getElementById('moba-widget-container');
  if (!container) return; // Si no existe, salimos

  const link = document.createElement('a');
  link.href = `https://u.gg/lol/champions/${champId.toLowerCase()}/build/jungle`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = `Ver build de ${champId} en U.GG`;
  // ... estilos del botón ...
  container.appendChild(link);
});