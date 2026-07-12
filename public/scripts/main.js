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
  sections.forEach(section => section.classList.remove("active"));
  buttons.forEach(button => button.classList.remove("active"));

  const target = document.getElementById(`section-${sectionName}`);
  if (target) target.classList.add("active");

  const activeButton = document.querySelector(`#main-nav button[data-section="${sectionName}"]`);
  if (activeButton) activeButton.classList.add("active");

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
    populateStyleFilter();
    renderChampions(); // Ahora filtra las tarjetas existentes
  })
  .catch(error => {
    console.error("Error cargando champions.json:", error);
  });


// =====================================
// RELLENAR EL SELECT DE ESTILOS
// =====================================

function populateStyleFilter() {
  const styles = [...new Set(champions.map(champion => champion.style))].sort();

  // Limpiar opciones (excepto la primera)
  while (styleFilter.options.length > 1) {
    styleFilter.remove(1);
  }

  styles.forEach(style => {
    const option = document.createElement("option");
    option.value = style.toLowerCase();
    option.textContent = style;
    styleFilter.appendChild(option);
  });
}


// =====================================
// MANEJADOR DE CLIC EN TARJETAS
// =====================================

function handleCardClick(event) {
  const card = event.currentTarget;
  const id = card.dataset.id;
  if (id) {
    window.location.href = `/pathing/${id}`;
  }
}

function attachClickEvents() {
  const cards = document.querySelectorAll('#champion-list .champion-card');
  cards.forEach(card => {
    // Eliminar listeners antiguos para evitar duplicados
    card.removeEventListener('click', handleCardClick);
    card.addEventListener('click', handleCardClick);
  });
}


// =====================================
// RENDER / FILTRAR CAMPEONES (SIN REESCRIBIR EL HTML)
// =====================================

function renderChampions() {
  const search = searchInput.value.toLowerCase();
  const style = styleFilter.value.toLowerCase();

  // Si no hay tarjetas en el DOM (por si acaso), las recreamos desde los datos
  const existingCards = document.querySelectorAll('#champion-list .champion-card');
  if (existingCards.length === 0 && champions.length > 0) {
    // Reconstruir desde cero (por si el HTML no se generó)
    championList.innerHTML = "";
    champions.forEach(champion => {
      const card = createChampionCard(champion);
      championList.appendChild(card);
    });
    // Re-obtenemos las tarjetas para filtrar
    const newCards = document.querySelectorAll('#champion-list .champion-card');
    filterCards(newCards, search, style);
    attachClickEvents(); // Añadir eventos a las nuevas tarjetas
    return;
  }

  // Filtrar tarjetas existentes
  filterCards(existingCards, search, style);
  attachClickEvents(); // Añadir eventos a las tarjetas existentes (por si no los tienen)
}

function filterCards(cards, search, style) {
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.querySelector('h3')?.textContent?.toLowerCase() || '';
    const cardStyle = card.querySelector('p')?.textContent?.toLowerCase() || '';
    const matchesName = name.includes(search);
    const matchesStyle = style === '' || cardStyle === style;

    if (matchesName && matchesStyle) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Mostrar mensaje de "no encontrado" si no hay visibles
  const emptyState = document.querySelector('.empty-state');
  if (visibleCount === 0) {
    if (!emptyState) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-state';
      emptyDiv.innerHTML = `
        <h3>No se encontraron campeones.</h3>
        <p>Prueba otro nombre o cambia el filtro.</p>
      `;
      championList.appendChild(emptyDiv);
    }
  } else {
    if (emptyState) emptyState.remove();
  }
}

// Función auxiliar para crear una tarjeta (solo si es necesario reconstruir)
function createChampionCard(champion) {
  const card = document.createElement("article");
  card.className = "champion-card";
  card.dataset.id = champion.id;
  card.innerHTML = `
    <img class="champion-icon" src="${champion.icon}" alt="${champion.name}" loading="lazy">
    <h3>${champion.name}</h3>
    <p>${champion.style}</p>
  `;
  // No añadimos evento aquí, porque attachClickEvents lo hará después
  return card;
}


// =====================================
// SINCRONIZAR BUSCADORES
// =====================================

function syncSearchInputs(source, target) {
  target.value = source.value;
}

heroSearch.addEventListener("input", () => {
  syncSearchInputs(heroSearch, searchInput);
  renderChampions();
});

searchInput.addEventListener("input", () => {
  syncSearchInputs(searchInput, heroSearch);
  renderChampions();
});

heroSearch.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    syncSearchInputs(heroSearch, searchInput);
    showSection("champions");
    renderChampions();
  }
});

styleFilter.addEventListener("change", renderChampions);

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

// Añadir eventos a las tarjetas existentes nada más cargar la página
document.addEventListener('DOMContentLoaded', () => {
  attachClickEvents();
});


// =====================================
// CARGAR Y RENDERIZAR CONCEPTOS (DESDE JS)
// =====================================

document.addEventListener('DOMContentLoaded', () => {
  fetch("data/conceptos.json")
    .then(response => response.json())
    .then(data => {
      const grid = document.getElementById("concept-grid");
      if (!grid) return;

      grid.innerHTML = ""; // Limpiamos por si hay algo

      data.forEach(concepto => {
        const card = document.createElement("article");
        card.className = "concept-card";
        card.innerHTML = `
          <h3>${concepto.name}</h3>
          <p>${concepto.shortDesc}</p>
        `;
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
          window.location.href = `/conceptos/${concepto.id}`;
        });
        grid.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error cargando conceptos.json:", error);
    });
});