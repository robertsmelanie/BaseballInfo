function antiRunsPitcher(stats) {
    const IP = stats.inningsPitched || 0;
    const ERA = stats.era || 5.00;  // Default high ERA
    const WHIP = stats.whip || 1.5;
    const K9 = stats.strikeoutsPer9Inn || 6;

    const ERA_WEIGHT = 1;
    const WHIP_WEIGHT = 10;
    const K_WEIGHT = 0.5;

    const leagueERA = 4.00;

    return ((leagueERA - ERA) * IP * ERA_WEIGHT) + ((1 - WHIP) * WHIP_WEIGHT) + (K9 * K_WEIGHT);
}
