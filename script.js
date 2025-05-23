document.addEventListener('DOMContentLoaded', function () {
    const yearSelect = document.getElementById("year-select");
    const currentYear = new Date().getFullYear();

    const currentYearOption = document.createElement("option");
    currentYearOption.value = currentYear;
    currentYearOption.textContent = currentYear;
    yearSelect.insertBefore(currentYearOption, yearSelect.firstChild);

    yearSelect.value = currentYear; // Optional: Set current year as default
});
console.log(Date.now());
console.log(new Date().getFullYear());
console.log(new Date().toLocaleDateString());

const MLB_TEAM_IDS = [
    108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
    120, 121, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
    143, 144, 145, 146, 147, 158 // All 30 teams
];

async function getAllPlayersAtPosition(position, year) {
    let allPlayers = [];
    for (const teamId of MLB_TEAM_IDS) {
        const roster = await fetchTeamRoster(teamId);
        const playersAtPosition = roster.filter(p => p.position === position);
        allPlayers = allPlayers.concat(playersAtPosition);
    }
    return allPlayers;
}

async function fetchTeamRoster(teamId) {
    const res = await fetch(`https://statsapi.mlb.com/api/v1/teams/${teamId}/roster`);
    const data = await res.json();
    return data.roster.map(player => ({
        id: player.person.id,
        name: player.person.fullName,
        position: player.position.abbreviation,
        // runs: runs,
        // runs: player.stats,
        // antiRuns: antiRuns,
        // stats: player.stats,
        // Add any other properties you need
        // console.log(player.person.id),
        // console.log(player.person.fullName),
        // console.log(player.position.abbreviation)
    }));
   
}


async function fetchPlayerStats(playerId, year) {
    const url = `https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=stats(group=[hitting,fielding],type=season,season=${year})`;
    const res = await fetch(url);
    const data = await res.json();

    const stats = data.people[0].stats || [];

    const hittingStats = stats.find(s => s.group.displayName === "hitting")?.splits[0]?.stat || {};
    const fieldingStats = stats.find(s => s.group.displayName === "fielding")?.splits[0]?.stat || {};

    return { hittingStats, fieldingStats };
    

}

// console.log(playerId);
async function rankPlayers() {
    const selectedPosition = document.getElementById("position-select").value;
    const selectedYear = document.getElementById("year-select").value; // Get the selected year
    const results = document.getElementById("results");
    results.innerHTML = "Loading...";
    const teamId = document.getElementById("teamId").value;

    let players;
    if (teamId === "all") {
        players = await getAllPlayersAtPosition(selectedPosition, selectedYear);
    } else {
        const teamRoster = await fetchTeamRoster(teamId);
        players = teamRoster.filter(p => p.position === selectedPosition);
    }

    // const teamRoster = await fetchTeamRoster(teamId);

    // const players = teamRoster.filter(p => p.position === selectedPosition);

    const ranked = [];
  

    for (const player of players) {
        const { hittingStats, fieldingStats } = await fetchPlayerStats(player.id, selectedYear);

        const runs = runsValue(hittingStats);
        const antiRuns = antiRunsFielder(fieldingStats, player.position);
        const total = runs + antiRuns;

        ranked.push({ name: player.name, runs, antiRuns, total });

        console.log(player.name);
        console.log(runs);
        console.log(antiRuns);
        console.log(total);
        console.log(player.position);
        console.log(player.id);
        // console.log(player.stats);
        console.log(player);
        console.log(selectedYear);
        console.log(teamId);
        // console.log(player.hittingStats);
        // console.log(player.fieldingStats);
       
    }

    ranked.sort((a, b) => b.total - a.total);

    results.innerHTML = "";
    ranked.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "player";
        div.innerHTML = `<strong>#${i + 1} ${p.name}</strong><br>
        Runs: ${p.runs.toFixed(2)} | Anti-Runs: ${p.antiRuns.toFixed(2)} | Total: ${p.total.toFixed(2)}`;
        results.appendChild(div);
    });
}
console.log("Hello World");
// const playerId = 123456; // Replace with the actual player ID
document.getElementById('clear-btn').onclick = function () {
    document.getElementById('results').innerHTML = "";
};


// console.log(player)
// const playerId = player.person.id;
// const playerName = player.person.fullName;
// const playerPosition = player.position.abbreviation;
// console.log(player.person.id);
// console.log(playerId);
const year = new Date().getFullYear();
// const runs = runsValue(hittingStats);
// const antiRuns = antiRunsFielder(fieldingStats, player.position);
// const total = runs + antiRuns;
console.log(year);
// console.log(runs);
// console.log(antiRuns);
// console.log(total);