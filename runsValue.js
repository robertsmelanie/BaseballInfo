function runsValue(stats) {
    const RBI = stats.rbi || 0;
    const OBP = stats.obp || 0;
    const SB = stats.stolenBases || 0;
    const XBH = (stats.doubles || 0) + (stats.triples || 0) + (stats.homeRuns || 0);

    const OBP_WEIGHT = 10;
    const SB_WEIGHT = 2;
    const XBH_WEIGHT = 3;

    return RBI + (OBP * OBP_WEIGHT) + (SB * SB_WEIGHT) + (XBH * XBH_WEIGHT);
}
