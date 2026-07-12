// =====================================
// VARIABLES
// =====================================

const buttons = document.querySelectorAll("#main-nav button");
const sections = document.querySelectorAll(".section");

const championList = document.getElementById("champion-list");

const searchInput = document.getElementById("search-champion");
const heroSearch = document.getElementById("hero-search");

const styleFilter = document.getElementById("filter-style");

let champions = [];


// =====================================
// NAVEGACIÓN
// =====================================

function showSection(sectionName) {

    sections.forEach(section => {

        section.classList.remove("active");

    });

    buttons.forEach(button => {

        button.classList.remove("active");

    });

    const target = document.getElementById(`section-${sectionName}`);

    if (target) {

        target.classList.add("active");

    }

    const activeButton = document.querySelector(
        `#main-nav button[data-section="${sectionName}"]`
    );

    if (activeButton) {

        activeButton.classList.add("active");

    }

    if (sectionName === "champions") {

        renderChampions();

        searchInput.focus();

    }

}

buttons.forEach(button => {

    button.addEventListener("click", () => {

        showSection(button.dataset.section);

    });

});


// =====================================
// CARGAR JSON Y GENERAR FILTROS DINÁMICOS
// =====================================

fetch("data/champions.json")

    .then(response => response.json())

    .then(data => {

        champions = data;

        // Llenar el selector de estilos con los valores del JSON
        populateStyleFilter();

        renderChampions();

    })

    .catch(error => {

        console.error(error);

    });


// =====================================
// RELLENAR EL SELECT DE ESTILOS DESDE LOS DATOS
// =====================================

function populateStyleFilter() {

    // Extraer estilos únicos y ordenarlos alfabéticamente
    const styles = [...new Set(champions.map(champion => champion.style))].sort();

    // Eliminar opciones anteriores (excepto "Todos los estilos")
    while (styleFilter.options.length > 1) {
        styleFilter.remove(1);
    }

    // Crear y añadir cada estilo como opción
    styles.forEach(style => {

        const option = document.createElement("option");

        option.value = style.toLowerCase(); // valor en minúsculas para el filtro
        option.textContent = style;         // texto original con mayúsculas

        styleFilter.appendChild(option);

    });

}


// =====================================
// RENDER CAMPEONES
// =====================================

function renderChampions() {

    championList.innerHTML = "";

    const search = searchInput.value.toLowerCase();

    const style = styleFilter.value.toLowerCase();

    const filtered = champions.filter(champion => {

        const matchesName = champion.name
            .toLowerCase()
            .includes(search);

        const matchesStyle =

            style === "" ||

            champion.style.toLowerCase() === style;

        return matchesName && matchesStyle;

    });

    if (filtered.length === 0) {

        championList.innerHTML = `

            <div class="empty-state">

                <h3>No se encontraron campeones.</h3>

                <p>Prueba otro nombre o cambia el filtro.</p>

            </div>

        `;

        return;

    }

    filtered.forEach(champion => {

        const card = document.createElement("article");

        card.className = "champion-card";

        card.innerHTML = `

            <img
                class="champion-icon"
                src="${champion.icon}"
                alt="${champion.name}"
                loading="lazy"
            >

            <h3>${champion.name}</h3>

            <p>${champion.style}</p>

        `;

        card.addEventListener("click", () => {

            window.location.href =
                `./pathings/pathings.html?id=${champion.id}`;

        });

        championList.appendChild(card);

    });

}


// =====================================
// BUSCADOR CAMPEONES
// =====================================

// =====================================
// SINCRONIZAR BUSCADORES
// =====================================

function syncSearchInputs(source, target) {
    target.value = source.value;
}

// Escuchar cambios en ambos inputs
heroSearch.addEventListener("input", () => {
    syncSearchInputs(heroSearch, searchInput);
    renderChampions();
});

searchInput.addEventListener("input", () => {
    syncSearchInputs(searchInput, heroSearch);
    renderChampions();
});

// Mantener Enter funcional en el hero
heroSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        syncSearchInputs(heroSearch, searchInput);
        showSection("champions");
        renderChampions();
    }
});


// =====================================
// FILTRO
// =====================================

styleFilter.addEventListener("change", renderChampions);


// =====================================
// HERO SEARCH
// =====================================

heroSearch.addEventListener("input", () => {

    searchInput.value = heroSearch.value;

    showSection("champions");

    renderChampions();

});

heroSearch.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        searchInput.value = heroSearch.value;

        showSection("champions");

        renderChampions();

    }

});


// =====================================
// INICIO
// =====================================

showSection("home");

// =====================================
// CARGAR Y RENDERIZAR CONCEPTOS
// =====================================

// Aseguramos que el DOM esté listo (por si main.js carga antes que el HTML)
document.addEventListener('DOMContentLoaded', () => {
    fetch("data/conceptos.json")
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById("concept-grid");
            if (!grid) return; // Si no existe el contenedor, salimos

            grid.innerHTML = ""; // Limpiamos por si había algo

            data.forEach(concepto => {
                // Crear tarjeta de concepto
                const card = document.createElement("article");
                card.className = "concept-card";
                card.innerHTML = `
                    <h3>${concepto.name}</h3>
                    <p>${concepto.shortDesc}</p>
                `;

                // Al hacer clic, ir a la página de detalle
                card.style.cursor = "pointer";
                card.addEventListener("click", () => {
                    window.location.href = `./conceptos/conceptos.html?id=${concepto.id}`;
                });

                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error cargando conceptos.json:", error);
        });
});