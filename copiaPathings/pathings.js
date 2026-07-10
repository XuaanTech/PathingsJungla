// Obtener ID del campeón desde la URL
const params = new URLSearchParams(window.location.search);
const champId = params.get("id");

// Cargar el JSON con los datos de los campeones
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

        // Inyectar iframe de U.GG (alternativa fiable)
        const container = document.getElementById("moba-widget-container");
        container.innerHTML = ''; // Limpiar

        const iframe = document.createElement('iframe');
        iframe.src = `https://u.gg/lol/champions/${champ.id.toLowerCase()}/build?view=overview`;
        iframe.width = '100%';
        iframe.height = '600';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.allow = 'encrypted-media'; // Opcional
        container.appendChild(iframe);

        // Cargar el video del clear
        document.getElementById("champ-video").src = champ.video;

        // Mostrar el pathing
        document.getElementById("champ-pathing").textContent = champ.pathing;
    })
    .catch(err => {
        document.body.innerHTML = "<h1>Error cargando datos del campeón</h1>";
        console.error(err);
    });