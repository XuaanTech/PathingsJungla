// =====================================
// OBTENER ID DEL CONCEPTO DESDE LA URL
// =====================================
const params = new URLSearchParams(window.location.search);
const conceptoId = params.get("id");

// =====================================
// CARGAR JSON DE CONCEPTOS
// =====================================
fetch("../data/conceptos.json")
    .then(res => res.json())
    .then(data => {
        // Buscar el concepto por ID
        const concepto = data.find(c => c.id === conceptoId);

        // Si no existe, mostrar mensaje de error
        if (!concepto) {
            document.body.innerHTML = `
                <div style="text-align:center;padding:80px 20px;color:var(--text);">
                    <h1 style="color:var(--gold-light);">Concepto no encontrado</h1>
                    <p>El ID proporcionado no coincide con ningún concepto.</p>
                    <a href="../index.html" style="color:var(--gold);">Volver al inicio</a>
                </div>`;
            return;
        }

        // =====================================
        // RELLENAR DATOS EN EL HTML
        // =====================================
        // Nombre
        document.getElementById("concepto-name").textContent = concepto.name;
        // Descripción corta (badge)
        document.getElementById("concepto-short").textContent = concepto.shortDesc;

        // Icono (si existe y hay imagen)
        const iconEl = document.getElementById("concepto-icon");
        if (concepto.icon && concepto.icon.trim() !== "") {
            iconEl.src = concepto.icon;
            iconEl.style.display = "block";
        } else {
            iconEl.style.display = "none";
        }

        // =====================================
        // VIDEO (si tiene URL)
        // =====================================
        const videoSection = document.getElementById("video-section");
        const videoIframe = document.getElementById("concepto-video");
        if (concepto.video && concepto.video.trim() !== "") {
            videoIframe.src = concepto.video;
            videoSection.style.display = "block";
        } else {
            videoSection.style.display = "none";
        }

        // =====================================
        // DESCRIPCIÓN LARGA
        // =====================================
        document.getElementById("concepto-descripcion").textContent = concepto.description;

        // =====================================
        // RECURSOS ADICIONALES (opcional, de momento estático)
        // =====================================
        // Puedes personalizar esta sección más adelante
    })
    .catch(err => {
        console.error("Error cargando conceptos.json:", err);
        document.body.innerHTML = `
            <div style="text-align:center;padding:80px 20px;color:var(--text);">
                <h1 style="color:var(--gold-light);">Error</h1>
                <p>No se pudieron cargar los datos del concepto.</p>
                <a href="../index.html" style="color:var(--gold);">Volver al inicio</a>
            </div>`;
    });