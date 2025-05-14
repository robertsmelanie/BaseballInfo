function calculateAntiRunsFielder(stats, position) {
    const errors = stats.errors || 0;
    const assists = stats.assists || 0;
    const putOuts = stats.putOuts || 0;
    const doublePlays = stats.doublePlays || 0;
    const games = stats.games || 1;

    // Defensive stats per game (normalization)
    const assistsPerGame = assists / games;
    const putOutsPerGame = putOuts / games;
    const doublePlaysPerGame = doublePlays / games;
    const errorRate = errors / games;

    // Weights
    const ASSIST_WEIGHT = 2;
    const PO_WEIGHT = 1;
    const DP_WEIGHT = 3;
    const ERROR_PENALTY = -5;

    // Base defensive value
    let value =
        (assistsPerGame * ASSIST_WEIGHT) +
        (putOutsPerGame * PO_WEIGHT) +
        (doublePlaysPerGame * DP_WEIGHT) +
        (errorRate * ERROR_PENALTY);

    // Positional adjustment
    const positionAdjustment = {
        "C": 8,
        "SS": 6,
        "2B": 5,
        "CF": 4,
        "3B": 3,
        "RF": 2,
        "LF": 2,
        "1B": 1,
        "DH": 0
    };

    value += positionAdjustment[position] || 0;

    return value;
}