// Obtener ID del campeón desde la URL
const params = new URLSearchParams(window.location.search);
const champId = params.get("id");

// Cargar JSON
fetch("../data/champions-pathings.json")
    .then(res => res.json())
    .then(data => {
        const champ = data.find(c => c.id === champId);

        if (!champ) {
            document.body.innerHTML = "<h1>Campeón no encontrado</h1>";
            return;
        }

        // Rellenar datos básicos
        document.getElementById("champ-name").textContent = champ.name;
        document.getElementById("champ-style").textContent = "Estilo: " + champ.style;
        document.getElementById("champ-icon").src = champ.icon;

        // Inyectar widget de Mobalytics
        const widgetData = {
            champion: champ.id.toLowerCase(),
            layout: "full",
            role: "jungle"
        };
        const widgetHTML = `
            <div data-moba-widget="build">
                <script type="application/json">
                    ${JSON.stringify(widgetData)}
                <\/script>
            </div>
        `;
        document.getElementById("moba-widget-container").innerHTML = widgetHTML;

        // Cargar el script de Mobalytics si no está presente
        if (!document.querySelector('script[src*="builds-widget"]')) {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/gh/joneslloyd/builds-widget@v0.2.4-alpha/dist/index.bundle.js";
            script.async = true; // o false, pero async es mejor
            document.head.appendChild(script);
        } else {
            // Si ya está cargado, podríamos intentar re-inicializar
            // Pero el script probablemente ya procesó el DOM y no lo hará de nuevo
            // Podríamos forzar un evento o recargar la página, pero mejor no
            // En este caso, como la página se recarga, no debería pasar
        }

        // Vídeo
        document.getElementById("champ-video").src = champ.video;

        // Pathing
        document.getElementById("champ-pathing").textContent = champ.pathing;
    })
    .catch(err => {
        document.body.innerHTML = "<h1>Error cargando datos del campeón</h1>";
        console.error(err);
    });