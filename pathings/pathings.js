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

        // ===== BOTÓN DE ENLACE DIRECTO A U.GG (JUNGLA) =====
        const container = document.getElementById("moba-widget-container");
        container.innerHTML = ''; // Limpiar

        const link = document.createElement('a');
        // ***** AQUÍ ESTÁ EL CAMBIO: se ha añadido "/jungle" al final *****
        link.href = `https://u.gg/lol/champions/${champ.id.toLowerCase()}/build/jungle`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `Ver build de ${champ.name} en U.GG`;
        link.style.display = 'inline-block';
        link.style.padding = '12px 24px';
        link.style.backgroundColor = '#1a1a2e';
        link.style.color = '#fff';
        link.style.textDecoration = 'none';
        link.style.borderRadius = '8px';
        link.style.fontWeight = 'bold';
        link.style.transition = 'background-color 0.3s';
        link.style.border = '2px solid #e2b714';
        link.style.fontFamily = 'Arial, sans-serif';

        link.onmouseover = () => { link.style.backgroundColor = '#2a2a4e'; };
        link.onmouseout = () => { link.style.backgroundColor = '#1a1a2e'; };

        container.appendChild(link);

        // Cargar el video del clear
        document.getElementById("champ-video").src = champ.video;

        // Mostrar el pathing
        document.getElementById("champ-pathing").textContent = champ.pathing;
    })
    .catch(err => {
        document.body.innerHTML = "<h1>Error cargando datos del campeón</h1>";
        console.error(err);
    });