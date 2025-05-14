// Sample mock player stats
const mockPlayers = [
    {
        name: "Carlos Correa",
        position: "SS",
        stats: {
            rbi: 80, obp: 0.34, stolenBases: 5, doubles: 30, triples: 1, homeRuns: 20,
            errors: 10, assists: 340, putOuts: 120, doublePlays: 60, games: 140
        }
    },
    {
        name: "Dansby Swanson",
        position: "SS",
        stats: {
            rbi: 85, obp: 0.33, stolenBases: 10, doubles: 25, triples: 3, homeRuns: 22,
            errors: 5, assists: 370, putOuts: 130, doublePlays: 70, games: 145
        }
    }
];

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