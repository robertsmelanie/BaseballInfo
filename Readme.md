I was inspired by the movie moneyball to see what kind of a system I could make.
I had AI help me with the math.
Here are the formulas implemented in this function:
1. Defensive Stats per Game (Normalization):
- Assists Per Game: gamesassists
- Put Outs Per Game: gamesputOuts
- Double Plays Per Game: gamesdoublePlays
- Error Rate: gameserrors
2. Base Defensive Value Calculation:
The base defensive value (value before positional adjustment) is calculated using a weighted sum of the per-game defensive statistics and the error rate:
value=(assistsPerGame×ASSIST_WEIGHT)+(putOutsPerGame×PO_WEIGHT)+(doublePlaysPerGame×DP_WEIGHT)+(errorRate×ERROR_PENALTY)
Substituting the weight values:
value=(assistsPerGame×2)+(putOutsPerGame×1)+(doublePlaysPerGame×3)+(errorRate×−5)
3. Positional Adjustment:
A positional adjustment is then added to the base value based on the fielder's position. The positionAdjustment object defines these values:
- Catcher (C): +8
- Shortstop (SS): +6
- Second Base (2B): +5
- Center Field (CF): +4
- Third Base (3B): +3
- Right Field (RF): +2
- Left Field (LF): +2
- First Base (1B): +1
- Designated Hitter (DH): +0
The final defensive value returned by the function is:
Final_Value=value+positionAdjustment[position]
If the provided position is not found in the positionAdjustment object, a default value of 0 is added.
In summary, this function calculates a defensive metric by:
1. Normalizing defensive statistics per game.
2. Applying weights to assists, putouts, double plays, and errors (with errors having a negative weight).
3. Adding a positional adjustment factor that reflects the relative difficulty and importance of different defensive positions.
This looks like a reasonable approach to quantifying defensive value in a "Moneyball" style system by considering both the quantity and quality (through error penalty and positional adjustment) of defensive contributions. Remember that the specific weights and positional adjustments are parameters you would likely tune based on your analysis and the predictive power of this metric.

evaluate a pitcher's ability to prevent runs.
Here's a breakdown of the formulas implemented:
1. Input Statistics (with Defaults):
- Innings Pitched (IP): Taken directly from stats.inningsPitched, defaults to 0 if not provided.
- Earned Run Average (ERA): Taken directly from stats.era, defaults to a high value of 5.00 if not provided. This suggests that a missing ERA is treated as a poor performance.
- Walks plus Hits per Inning Pitched (WHIP): Taken directly from stats.whip, defaults to 1.5 if not provided. A higher WHIP is generally worse.
- Strikeouts per 9 Innings (K/9): Taken directly from stats.strikeoutsPer9Inn, defaults to 6 if not provided. A higher K/9 is generally better.
2. Weighted Calculation of "Anti-Runs" Value:
The function calculates the pitcher's "anti-runs" value using a combination of these statistics and predefined weights, along with a leagueERA for context:
AntiRuns_Value=((leagueERA−ERA)×IP×ERA_WEIGHT)+((1−WHIP)×WHIP_WEIGHT)+(K9×K_WEIGHT)
Substituting the weight values and the default leagueERA:
AntiRuns_Value=((4.00−ERA)×IP×1)+((1−WHIP)×10)+(K9×0.5)
Breaking down each term:
- ((leagueERA−ERA)×IP×ERA_WEIGHT):
	- This part compares the pitcher's ERA to the league average ERA.
	- If a pitcher's ERA is lower than the league average, this term will be positive, indicating they are preventing more runs than an average pitcher.
	- The difference is multiplied by the number of innings pitched, suggesting that the value scales with workload.
	- The ERA_WEIGHT of 1 means this difference is taken at face value per inning.
- ((1−WHIP)×WHIP_WEIGHT):
	- WHIP represents the number of baserunners allowed per inning. A lower WHIP is better.
	- Subtracting WHIP from 1 inverts the scale, so a lower WHIP results in a higher positive value for this term.
	- This value is then multiplied by the WHIP_WEIGHT of 10, indicating a significant emphasis on preventing baserunners.
- (K9×K_WEIGHT):
	- Strikeouts are a positive outcome for a pitcher as they prevent the ball from being put in play and thus eliminate the chance of runs scoring on that play.
	- K/9 is directly multiplied by the K_WEIGHT of 0.5, giving strikeouts a positive contribution to the "anti-runs" value, although with a smaller weight than WHIP.
In summary, this antiRunsPitcher function attempts to quantify a pitcher's ability to prevent runs by considering:
- Run Prevention Relative to the League: Using ERA compared to the league average, adjusted for innings pitched.
- Controlling Baserunners: Heavily weighting WHIP, where a lower WHIP contributes more positively.
- Dominance/Ability to Get Outs: Giving a positive, albeit smaller, weight to strikeouts.
This formula reflects a modern approach to evaluating pitching, looking beyond just ERA in isolation and incorporating factors like baserunner control and strikeout ability. The weights assigned to WHIP and K/9 (10 and 0.5 respectively) highlight the relative importance you've placed on these aspects of pitching in preventing runs. The use of leagueERA provides a crucial context for evaluating a pitcher's performance relative to the overall league environment.

