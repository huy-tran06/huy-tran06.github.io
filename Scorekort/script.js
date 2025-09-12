
//Start Page
const welcomePage = document.querySelector("#welcome");
const gamePage = document.querySelector("#game");
const newGameBtn = document.querySelector("#newGameBtn");

newGameBtn.addEventListener("click", () => {
    welcomePage.classList.add("hidden");
    gamePage.classList.remove("hidden");
});


//Game Setup Page
const playerInputsDiv = document.querySelector("#playerInputs");
const addPlayerBtn = document.querySelector("#addPlayerBtn");
const startGameBtn = document.querySelector("#startGameBtn");
const holeScreen = document.querySelector("#holeScreen");


let players = [];

function createPlayerInput(){
    const row = document.createElement("div");
    row.classList.add("player-input");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Namn";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "X"
    removeBtn.classList.add("remove-player");

    removeBtn.addEventListener("click", () => {
        row.remove();
    })

    row.appendChild(input);
    row.appendChild(removeBtn);
    playerInputsDiv.appendChild(row);
}

function createDefaultPlayers() {
    for (let i = 0; i < 3; i++) {
        createPlayerInput();
    }
}
createDefaultPlayers();

addPlayerBtn.addEventListener("click", createPlayerInput);


//Starting Game

let holes = [];
let currentHole = 0;

async function loadHoles() {
    try {
        const res = await fetch("info.json");
        const data = await res.json();
        holes = data.court;

        players = [];
        const inputs = document.querySelectorAll("#playerInputs input");
        inputs.forEach((input, index) => {
            if (input.value.trim() !== "") {
                players.push({
                id: "id_" + (index + 1),
                name: input.value.trim(),
                scores: Array(holes.length).fill(null)
                });
            }  
        })
        console.log(players);
        startGame(); //Line 87
    }

    catch (error){
        console.error("Kunde inte ladda in spelet", error)
    }
}

startGameBtn.addEventListener("click", () => {
    loadHoles(); //Line 59
})

function startGame() {
    currentHole = 0;
    showHole(); //Look below
}


//Hole Page

function showHole() {
    if (!players || players.length === 0) {
        alert("Lägg till spelare för att spela.")
        return;
    }

    const hole = holes[currentHole];
    document.querySelector("#holeTitle").textContent = "Hål: " + hole.id;
    document.querySelector("#holeDesc").textContent = hole.info;
    document.querySelector("#holePar").textContent = "Par: " + hole.par;

    const playerScoresDiv = document.querySelector("#playerScores");
    playerScoresDiv.innerHTML = "";

    players.forEach((player, index) => {
        const row = document.createElement("div");
        row.classList.add("player-score-row");

        const nameElement = document.createElement("p");
        nameElement.textContent = player.name;

        const controlBox = document.createElement("div");
        controlBox.classList.add("score-controls");

        const decreaseBtn = document.createElement("button");
        decreaseBtn.type = "button";
        decreaseBtn.textContent = "−";
        decreaseBtn.classList.add("decrease-btn");
        decreaseBtn.addEventListener("click", () => {
            let value = parseInt(input.value) || 0;
            if (value >= 1) value--;
            input.value = value;
            players[index].scores[currentHole] = value;
        });

        
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.value = player.scores[currentHole] || 0;
        nameElement.appendChild(input)

        const increaseBtn = document.createElement("button");
        increaseBtn.type = "button";
        increaseBtn.textContent = "+";
        increaseBtn.classList.add("increase-btn");
        increaseBtn.addEventListener("click", () => {
            let value = parseInt(input.value) || 0;
            value++;
            input.value = value;
            players[index].scores[currentHole] = value;
        })

        controlBox.appendChild(decreaseBtn);
        controlBox.appendChild(input);
        controlBox.appendChild(increaseBtn);

        nameElement.appendChild(controlBox);
        row.appendChild(nameElement);
        playerScoresDiv.appendChild(row);
    })

    welcomePage.classList.add("hidden");
    gamePage.classList.add("hidden");
    newPlayerPage.classList.add("hidden");
    holeScreen.classList.remove("hidden");
    
}

const nextHoleBtn = document.querySelector("#nextHoleBtn");
const previousHoleBtn = document.querySelector("#previousHoleBtn");


nextHoleBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll("#playerScores input");
    inputs.forEach((input, index) => {
        const value = parseInt(input.value);
        if (input.value !== "" && value > 0) {
            players[index].scores[currentHole] = value;
        }
    })

    console.log(players);

    if (currentHole == holes.length - 1){
        currentHole = 0;
    }
    else{
        currentHole++;
    }
    showHole();

    resultsSection.classList.add("hidden");
    showResultsBtn.classList.remove("hidden");
    
})

previousHoleBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll("#playerScores input");
    inputs.forEach((input, index) => {
        const value = parseInt(input.value);
        if (input.value !== "" && value > 0) {
            players[index].scores[currentHole] = value;
        }
    })

    console.log(players);
    
    if (currentHole == 0){
        currentHole = 17;
    }
    else{
        currentHole--;
    }
    showHole();

    resultsSection.classList.add("hidden");
    showResultsBtn.classList.remove("hidden");
})


const showResultsBtn = document.querySelector("#showResultsBtn");
const resultsSection = document.querySelector("#results");
const resultsList = document.querySelector("#resultsList");
const winnerP = document.querySelector("#winner");
const closeResultsBtn = document.querySelector("#closeResultsBtn");

function renderResults() {
    resultsList.innerHTML = "";

    // Filter valid players
    const validPlayers = players.filter(player => 
        player.scores.some(score => score > 0) &&
        player.scores.every(score => score === null || score > 0)
    );

    validPlayers.sort((a, b) => {
        const totalA = a.scores.reduce((sum, s) => sum + s, 0);
        const totalB = b.scores.reduce((sum, s) => sum + s, 0); 
        return totalA - totalB;
    })

    validPlayers.forEach(player => {
        const total = player.scores.reduce((a, b) => a + b, 0);

        const validP = document.createElement("p");
        validP.textContent = player.name + ": " + total;
        resultsList.appendChild(validP);
    });

    // Filter invalid players
    const invalidPlayers = players.filter(player => 
        !(player.scores.some(score => score > 0) &&
        player.scores.every(score => score === null || score > 0)
        )
    );

    if (invalidPlayers.length > 0){

        const invalidHeader = document.createElement("h2");
        const invalidDesc = document.createElement("p");

        invalidHeader.textContent = "Diskvalificerade spelare";
        invalidDesc.textContent = "Följande spelare behöver spela genom alla hål för att få resultat:";
        invalidDesc.classList.add("invalidText");

        resultsList.appendChild(invalidHeader);
        resultsList.appendChild(invalidDesc);

        invalidPlayers.forEach(player => {

            const invalidP = document.createElement("p");
            invalidP.textContent = player.name;
            resultsList.appendChild(invalidP);
            
        })
    }
}

// Result button
showResultsBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll("#playerScores input");
        inputs.forEach((input, index) => {
            const value = parseInt(input.value);
            if (input.value !== "" && value >= 0) {
                players[index].scores[currentHole] = value;
            }
    })
    console.log(players);
    renderResults();
    resultsSection.classList.remove("hidden");
    showResultsBtn.classList.add("hidden");
})

closeResultsBtn.addEventListener("click", () => {
    resultsSection.classList.add("hidden");
    showResultsBtn.classList.remove("hidden");
})


// Save & Load
const saveBtn = document.querySelector("#saveBtn");
const loadBtn = document.querySelector("#loadBtn");

saveBtn.addEventListener("click", () => {
    if (!players || players.length === 0) {
        alert("Inga spel sparades.")
        return;
    }

    localStorage.setItem("minigolfGame", JSON.stringify(players));
    alert("Sparat!");
})

loadBtn.addEventListener("click", () => {
    const saved = localStorage.getItem("minigolfGame");
    if (saved) {
        players = JSON.parse(saved);

        if (players.length === 0) {
            alert("Inga spelare hittades i det sparade spelet.")
            return;
        }

        currentHole = 0;

        welcomePage.classList.add("hidden");
        holeScreen.classList.remove("hidden");
        
        loadHoles();
    }
    else {
        alert("Inga spel hittades.");
    }

});


// Bottom Bar

const homeBtn = document.querySelector("#homeBtn");
const newPlayerPageBtn = document.querySelector("#newPlayerPageBtn");
const themeToggle = document.querySelector("#themeToggle");
const holeScreenBtn = document.querySelector("#holeScreenBtn")

homeBtn.addEventListener("click", () => {
    welcomePage.classList.remove("hidden");
    gamePage.classList.add("hidden");
    holeScreen.classList.add("hidden");
    newPlayerPage.classList.add("hidden");
});


// Add New Players Page
const newPlayerPage = document.querySelector("#newPlayerPage");
const newPlayerInputsDiv = document.querySelector("#newPlayerInputs");
const addNewPlayerBtn = document.querySelector("#addNewPlayerBtn");
const continueGameBtn = document.querySelector("#continueGameBtn");


newPlayerPageBtn.addEventListener("click", () => {
    renderNewPlayers();
});

function renderNewPlayers () {
    if (!players || players.length === 0) {
        alert("Börja spela för att kunna lägga till nya spelare.")
        return;
    }

    newPlayerInputsDiv.innerHTML = "";
    players.forEach((player, index) => {
        const row = document.createElement("div");
        row.classList.add("player-input");

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Namn";
        input.value = player.name;

        input.addEventListener("input", () => {
            players[index].name = input.value;
        })

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X"
        removeBtn.classList.add("remove-player");
        removeBtn.addEventListener("click", () => {
            players.splice(index, 1);
            renderNewPlayers();
        })

        row.appendChild(input);
        row.appendChild(removeBtn);
        newPlayerInputsDiv.appendChild(row);
    })

    newPlayerPage.classList.remove("hidden");
    welcomePage.classList.add("hidden");
    holeScreen.classList.add("hidden");


}

addNewPlayerBtn.addEventListener("click", () => {
    const newId = "id_" + (players.length + 1);

    players.push({
        id: newId,
        name: "",
        scores: Array(holes.length).fill(null)
    });

    renderNewPlayers();
})

continueGameBtn.addEventListener("click", () => {
    newPlayerPage.classList.add("hidden");
    currentHole = 0;
    showHole();
})



themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeToggle.textContent = "🌙";
    } 
    else {
        themeToggle.textContent = "☀️";
    }
});

holeScreenBtn.addEventListener("click", () => {
    loadHoles();
});


