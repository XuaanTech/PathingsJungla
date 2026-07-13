// =====================================
// OBTENER ID DEL CONCEPTO DESDE LA URL
// =====================================
// Ejemplo: /conceptos/fullclear -> "fullclear"
const pathSegments = window.location.pathname.split('/');
const conceptoId = pathSegments[pathSegments.length - 1];

// Si no hay ID, salimos (no debería ocurrir)
if (!conceptoId) {
  console.warn('No se encontró ID en la URL');
}

// =====================================
// CARGAR JSON DE CONCEPTOS
// =====================================
// Desde /conceptos/fullclear, subimos dos niveles para llegar a /data
fetch('../../data/conceptos.json')
    .then(res => {
      if (!res.ok) throw new Error('Error al cargar conceptos.json');
      return res.json();
    })
    .then(data => {
        // Buscar el concepto por ID
        const concepto = data.find(c => c.id === conceptoId);

        if (!concepto) {
            console.error('Concepto no encontrado:', conceptoId);
            return;
        }

        // =====================================
        // ACTUALIZAR EL DOM CON LOS DATOS FRESCOS
        // =====================================
        // Nombre
        const nameEl = document.getElementById("concepto-name");
        if (nameEl) nameEl.textContent = concepto.name;

        // Descripción corta
        const shortEl = document.getElementById("concepto-short");
        if (shortEl) shortEl.textContent = concepto.shortDesc;

        // Icono
        const iconEl = document.getElementById("concepto-icon");
        if (iconEl) {
            if (concepto.icon && concepto.icon.trim() !== "") {
                iconEl.src = concepto.icon.trim(); 
                iconEl.style.display = "block";
            } else {
                iconEl.style.display = "none";
            }
        }

        // Video
        const videoSection = document.getElementById("video-section");
        const videoIframe = document.getElementById("concepto-video");
        if (videoSection && videoIframe) {
            if (concepto.video && concepto.video.trim() !== "") {
                videoIframe.src = concepto.video;
                videoSection.style.display = "block";
            } else {
                videoSection.style.display = "none";
            }
        }

        // Descripción larga
        const descEl = document.getElementById("concepto-descripcion");
        if (descEl) {
            descEl.textContent = concepto.description || concepto.shortDesc;
        }

        // (Opcional) Actualizar título y meta description
        document.title = `${concepto.name} - Conceptos de Jungla | Pathings Jungla`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && concepto.description) {
            metaDesc.content = concepto.description.substring(0, 150) + '...';
        }

        console.log(`✅ Concepto "${concepto.name}" cargado correctamente.`);
    })
    .catch(err => {
        console.error("Error cargando conceptos.json:", err);
        // No mostramos error en pantalla para no romper la experiencia si el JSON no está disponible
    });