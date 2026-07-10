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
// CARGAR JSON
// =====================================

fetch("data/champions.json")

    .then(response => response.json())

    .then(data => {

        champions = data;

        renderChampions();

    })

    .catch(error => {

        console.error(error);

    });


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