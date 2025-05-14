// Sample mock player stats
// const mockPlayers = [
//     {
//         name: "Carlos Correa",
//         position: "SS",
//         stats: {
//             rbi: 80, obp: 0.34, stolenBases: 5, doubles: 30, triples: 1, homeRuns: 20,
//             errors: 10, assists: 340, putOuts: 120, doublePlays: 60, games: 140
//         }
//     },
//     {
//         name: "Dansby Swanson",
//         position: "SS",
//         stats: {
//             rbi: 85, obp: 0.33, stolenBases: 10, doubles: 25, triples: 3, homeRuns: 22,
//             errors: 5, assists: 370, putOuts: 130, doublePlays: 70, games: 145
//         }
//     }
// ];

async function fetchTeamRoster(teamId = 147) {
    const res = await fetch(`https://statsapi.mlb.com/api/v1/teams/${teamId}/roster`);
    const data = await res.json();
    return data.roster.map(player => ({
        id: player.person.id,
        name: player.person.fullName,
        position: player.position.abbreviation
    }));
}
async function fetchPlayerStats(playerId) {
    const url = `https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=stats(group=[hitting,fielding],type=season)`;
    const res = await fetch(url);
    const data = await res.json();

    const stats = data.people[0].stats || [];

    const hittingStats = stats.find(s => s.group.displayName === "hitting")?.splits[0]?.stat || {};
    const fieldingStats = stats.find(s => s.group.displayName === "fielding")?.splits[0]?.stat || {};

    return { hittingStats, fieldingStats };
}

async function rankPlayers() {
    const selectedPosition = document.getElementById("position-select").value;
    const results = document.getElementById("results");
    results.innerHTML = "Loading...";

    const teamRoster = await fetchTeamRoster(147); // Yankees

    const players = teamRoster.filter(p => p.position === selectedPosition);

    const ranked = [];

    for (const player of players) {
        const { hittingStats, fieldingStats } = await fetchPlayerStats(player.id);

        const runs = runsValue(hittingStats);
        const antiRuns = antiRunsFielder(fieldingStats, player.position);
        const total = runs + antiRuns;

        ranked.push({ name: player.name, runs, antiRuns, total });
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

// Combine and rank
function rankPlayers() {
    const selectedPosition = document.getElementById("position-select").value;
    const results = document.getElementById("results");
    results.innerHTML = "";

    const filtered = mockPlayers.filter(p => p.position === selectedPosition);
    const ranked = filtered.map(player => {
        const runs = runsValue(player.stats);
        const antiRuns = antiRunsFielder(player.stats, player.position);
        const total = runs + antiRuns;

        return { name: player.name, runs, antiRuns, total };
    }).sort((a, b) => b.total - a.total);

    ranked.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "player";
        div.innerHTML = `<strong>#${i + 1} ${p.name}</strong><br>
      Runs: ${p.runs.toFixed(2)} | Anti-Runs: ${p.antiRuns.toFixed(2)} | Total: ${p.total.toFixed(2)}`;
        results.appendChild(div);
    });
}