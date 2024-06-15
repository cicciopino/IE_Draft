// Funzione per ottenere i giochi unici dai dati dei giocatori
const getUniqueGames = () => {
  const games = new Set(players.map(player => player.Game));
  return Array.from(games);
};

// Popola le opzioni del select per i giochi come checkbox
const populateGameOptions = () => {
  const gameOptionsDiv = document.getElementById('gameOptions');
  const uniqueGames = getUniqueGames();

  uniqueGames.forEach(game => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = game;
    checkbox.value = game;
    checkbox.name = 'game';

    const label = document.createElement('label');
    label.textContent = game;
    label.setAttribute('for', game);

    gameOptionsDiv.appendChild(checkbox);
    gameOptionsDiv.appendChild(label);
    gameOptionsDiv.appendChild(document.createElement('br'));
  });
};
// Chiamata per popolare le opzioni del select dei giochi e posizioni all'avvio della pagina
populateGameOptions();

// Popola le opzioni delle posizioni come checkbox
const populatePositionOptions = () => {
  const positionCheckboxes = document.querySelectorAll('input[name=position]');
  positionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterPlayers);
  });
};

// Funzione per filtrare i dati in base a criteri specifici
const filterPlayers = () => {
  const checkboxes = document.querySelectorAll('input[name=position]:checked');
  const gamesCheckboxes = document.querySelectorAll('input[name=game]:checked');
  const positions = Array.from(checkboxes).map(checkbox => checkbox.value);
  const games = Array.from(gamesCheckboxes).map(checkbox => checkbox.value);

  const criteria = {
    Position: positions,
    Game: games
  };

  const filteredPlayers = players.filter(player => {
    return Object.keys(criteria).every(key => {
      if (criteria[key].length === 0) {
        return true; // Se nessun filtro è selezionato, mostra tutti i giocatori
      } else {
        return criteria[key].includes(player[key]);
      }
    });
  });

  displayResults(filteredPlayers);
};

// Funzione per visualizzare i risultati sulla pagina
const displayResults = (filteredPlayers) => {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''; // Pulisce i risultati precedenti

  if (filteredPlayers.length === 0) {
    resultDiv.innerHTML = '<p>No players found.</p>';
    return;
  }
  const playersContainer = document.createElement('div');
  playersContainer.id = 'playersContainer'; // Aggiungi un ID per il contenitore dei giocatori
  playersContainer.className = 'players-container'; // Nuova classe per i giocatori
  resultDiv.appendChild(playersContainer);

  filteredPlayers.forEach(player => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.innerHTML = `
      <h3>${player.EnglishName} (${player.JapaneseName})</h3>
      <img src="${player.Sprite}" alt="${player.EnglishName}">
      <p>Position:
      <img src="../images/positions/${player.Position}.png"></p>
      <p>Game: ${player.Game}</p>
      <p>Team: ${player.EnglishTeam}</p>
    `;
    playersContainer.appendChild(playerDiv);
  });

  // Inizializza SortableJS per il trascinamento
  new Sortable(playersContainer, {
    group: 'shared', // Gruppo per permettere il trascinamento tra i giocatori
    animation: 150, // Durata dell'animazione in millisecondi
    ghostClass: 'ghost', // Classe per l'elemento fantasma durante il trascinamento
    dragClass: 'drag' // Classe per lo stile del giocatore trascinato
  });
};

// Funzione per resettare i filtri
const resetFilters = () => {
  const positionCheckboxes = document.querySelectorAll('input[name=position]:checked');
  positionCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  const gameCheckboxes = document.querySelectorAll('input[name=game]:checked');
  gameCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  filterPlayers(); // Esegui il filtraggio dopo aver resettato i filtri
};

// Funzione per mostrare casualmente cinque giocatori tra quelli filtrati
const showRandomPlayers = () => {
  const checkboxes = document.querySelectorAll('input[name=position]:checked');
  const gamesCheckboxes = document.querySelectorAll('input[name=game]:checked');
  const positions = Array.from(checkboxes).map(checkbox => checkbox.value);
  const games = Array.from(gamesCheckboxes).map(checkbox => checkbox.value);

  const criteria = {
    Position: positions,
    Game: games
  };

  const filteredPlayers = players.filter(player => {
    return Object.keys(criteria).every(key => {
      if (criteria[key].length === 0) {
        return true; // Se nessun filtro è selezionato, mostra tutti i giocatori
      } else {
        return criteria[key].includes(player[key]);
      }
    });
  });

// Mostra casualmente cinque giocatori
const randomPlayers = [];
while (randomPlayers.length < 5 && filteredPlayers.length > 0) {
  const randomIndex = Math.floor(Math.random() * filteredPlayers.length);
  randomPlayers.push(filteredPlayers.splice(randomIndex, 1)[0]);
}

// Mostra gli slot sotto i bottoni
const bottomSlots = document.querySelectorAll('.slots-bottom .slot');
bottomSlots.forEach((slot, index) => {
  //slot.innerHTML = `Empty Slot ${index + 1}`;
  slot.innerHTML = "<img src= ../images/undefined.png>";
});

// Mostra i giocatori casuali
const playersContainer = document.getElementById('playersContainer');
playersContainer.innerHTML = ''; // Pulisce i giocatori precedenti

randomPlayers.forEach((player, index) => {
  const playerDiv = document.createElement('div');
  playerDiv.className = 'player';
  playerDiv.innerHTML = `
    <h3>${player.EnglishName} (${player.JapaneseName})</h3>
    <img src="${player.Sprite}" alt="${player.EnglishName}">
  `;
  /* Per mostrare anche posizione e gioco
  <p>Position: ${player.Position}</p>
  <p>Game: ${player.Game}</p>
  */

  playersContainer.appendChild(playerDiv);
});

// Inizializza SortableJS per il trascinamento
new Sortable(playersContainer, {
  group: 'shared', // Gruppo per permettere il trascinamento tra i giocatori
  animation: 150, // Durata dell'animazione in millisecondi
  ghostClass: 'ghost', // Classe per l'elemento fantasma durante il trascinamento
  dragClass: 'drag' // Classe per lo stile del giocatore trascinato
});

// Inizializza SortableJS per il trascinamento negli slot sotto i bottoni
const bottomSlotsInit = document.querySelectorAll('.slots-bottom .slot');
bottomSlotsInit.forEach(slot => {
  new Sortable(slot, {
    group: 'shared',
    animation: 150,
    ghostClass: 'ghost',
    dragClass: 'drag',
    onAdd: function (event) {
      // Rimuove il testo "Empty Slot" e aggiunge il giocatore trascinato
      slot.innerHTML = ''; // Pulisce il contenuto dello slot
      slot.appendChild(event.item); // Aggiunge il giocatore trascinato
    }
  });
});
};
