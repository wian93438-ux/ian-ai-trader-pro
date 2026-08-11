// =========================================
// Ian AI Trader Pro
// DeepScan Analysis Engine
// =========================================

// -----------------------------------------
// DeepScan Main Function
// -----------------------------------------

function deepScan() {

    if (!selectedMarket || !selectedSymbol) {

        alert(
            "Please select a market first.\n\n" +
            "Go to Market Center and choose a market."
        );

        showMarkets();

        return;
    }


    if (tickHistory.length < 20) {

        alert(
            "Not enough live data yet.\n\n" +
            "DeepScan needs at least 20 ticks.\n\n" +
            "Currently collected: " +
            tickHistory.length +
            " ticks."
        );

        return;
    }


    const analysis =
        analyzeMarketData();


    renderScanReport(analysis);

}


// =========================================
// Analyze Market Data
// =========================================

function analyzeMarketData() {

    const ticks =
        tickHistory.slice();


    // -------------------------------------
    // Digit Frequency
    // -------------------------------------

    const digitCounts = {

        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0

    };


    ticks.forEach(function(tick) {

        if (
            Number.isInteger(tick.digit) &&
            tick.digit >= 0 &&
            tick.digit <= 9
        ) {

            digitCounts[tick.digit]++;

        }

    });


    // -------------------------------------
    // Sort Digits
    // -------------------------------------

    const sortedDigits =
        Object.keys(digitCounts)
            .map(function(digit) {

                return {

                    digit: Number(digit),

                    count:
                        digitCounts[digit]

                };

            })
            .sort(function(a, b) {

                return b.count - a.count;

            });


    const hotDigits =
        sortedDigits.slice(0, 3);


    const coldDigits =
        sortedDigits
            .slice()
            .sort(function(a, b) {

                return a.count - b.count;

            })
            .slice(0, 3);


    // -------------------------------------
    // Current Digit Streak
    // -------------------------------------

    let currentStreakDigit = null;

    let currentStreak = 0;


    if (ticks.length > 0) {

        currentStreakDigit =
            ticks[ticks.length - 1].digit;


        for (
            let i = ticks.length - 1;
            i >= 0;
            i--
        ) {

            if (
                ticks[i].digit ===
                currentStreakDigit
            ) {

                currentStreak++;

            } else {

                break;

            }

        }

    }


    // -------------------------------------
    // Longest Digit Streak
    // -------------------------------------

    let longestStreak = 0;

    let longestStreakDigit = null;

    let runningStreak = 0;

    let previousDigit = null;


    ticks.forEach(function(tick) {

        if (
            tick.digit ===
            previousDigit
        ) {

            runningStreak++;

        } else {

            runningStreak = 1;

        }


        if (
            runningStreak >
            longestStreak
        ) {

            longestStreak =
                runningStreak;

            longestStreakDigit =
                tick.digit;

        }


        previousDigit =
            tick.digit;

    });


    // -------------------------------------
    // Price Movement
    // -------------------------------------

    let rising = 0;

    let falling = 0;

    let unchanged = 0;


    for (
        let i = 1;
        i < ticks.length;
        i++
    ) {

        const previous =
            Number(ticks[i - 1].quote);

        const current =
            Number(ticks[i].quote);


        if (current > previous) {

            rising++;

        } else if (current < previous) {

            falling++;

        } else {

            unchanged++;

        }

    }


    const movementCount =
        rising +
        falling +
        unchanged;


    // -------------------------------------
    // Trend
    // -------------------------------------

    let trend = "Sideways ↔️";

    let trendScore = 50;


    if (movementCount > 0) {

        const risingPercent =
            (rising / movementCount) * 100;

        const fallingPercent =
            (falling / movementCount) * 100;


        if (risingPercent >= 55) {

            trend =
                "Bullish 📈";

            trendScore =
                risingPercent;

        } else if (fallingPercent >= 55) {

            trend =
                "Bearish 📉";

            trendScore =
                fallingPercent;

        } else {

            trend =
                "Sideways ↔️";

            trendScore = 50;

        }

    }


    // -------------------------------------
    // Momentum
    // -------------------------------------

    let momentum =
        "Low";

    const recentWindow =
        ticks.slice(-20);


    let recentUp = 0;

    let recentDown = 0;


    for (
        let i = 1;
        i < recentWindow.length;
        i++
    ) {

        const previous =
            Number(
                recentWindow[i - 1].quote
            );

        const current =
            Number(
                recentWindow[i].quote
            );


        if (current > previous) {

            recentUp++;

        } else if (current < previous) {

            recentDown++;

        }

    }


    const recentMovement =
        recentUp + recentDown;


    if (recentMovement > 0) {

        const dominantMovement =
            Math.max(
                recentUp,
                recentDown
            );


        const momentumPercent =
            (dominantMovement /
            recentMovement) * 100;


        if (momentumPercent >= 70) {

            momentum =
                "Strong ⚡";

        } else if (momentumPercent >= 58) {

            momentum =
                "Medium";

        } else {

            momentum =
                "Low";

        }

    }


    // -------------------------------------
    // Digit Distribution Score
    // -------------------------------------

    const totalDigitTicks =
        sortedDigits.reduce(
            function(total, item) {

                return total + item.count;

            },
            0
        );


    let digitDistributionScore =
        50;


    if (totalDigitTicks > 0) {

        const highestFrequency =
            hotDigits[0].count /
            totalDigitTicks;


        const expectedFrequency =
            1 / 10;


        const deviation =
            Math.abs(
                highestFrequency -
                expectedFrequency
            );


        digitDistributionScore =
            Math.min(
                100,
                50 +
                (deviation * 500)
            );

    }


    // -------------------------------------
    // Overall Confidence
    // -------------------------------------
    //
    // This is an analysis score.
    // It is NOT a probability of winning
    // a trade and does not predict the next
    // tick.
    // -------------------------------------

    let confidence =
        (
            trendScore * 0.40
        ) +
        (
            digitDistributionScore * 0.30
        ) +
        (
            (
                momentum === "Strong ⚡"
                    ? 85
                    : momentum === "Medium"
                        ? 65
                        : 45
            ) * 0.30
        );


    confidence =
        Math.round(
            Math.max(
                0,
                Math.min(
                    100,
                    confidence
                )
            )
        );


    // -------------------------------------
    // Analysis Strength
    // -------------------------------------

    let strength =
        "Moderate";


    if (confidence >= 80) {

        strength =
            "High";

    } else if (confidence < 60) {

        strength =
            "Low";

    }


    // -------------------------------------
    // Build Explanation
    // -------------------------------------

    const explanation = [];


    explanation.push(
        "Analysed " +
        ticks.length +
        " live ticks."
    );


    if (trend === "Bullish 📈") {

        explanation.push(
            "Recent price movement shows " +
            "a bullish directional bias."
        );

    } else if (
        trend === "Bearish 📉"
    ) {

        explanation.push(
            "Recent price movement shows " +
            "a bearish directional bias."
        );

    } else {

        explanation.push(
            "Recent price movement is relatively " +
            "balanced."
        );

    }


    explanation.push(
        "The most frequent recent digits are " +
        hotDigits
            .map(function(item) {

                return item.digit;

            })
            .join(", ") +
        "."
    );


    explanation.push(
        "The least frequent digits in the " +
        "sample are " +
        coldDigits
            .map(function(item) {

                return item.digit;

            })
            .join(", ") +
        "."
    );


    if (currentStreak >= 3) {

        explanation.push(
            "The latest digit has appeared " +
            currentStreak +
            " times consecutively."
        );

    } else {

        explanation.push(
            "No unusually long current digit " +
            "streak was detected."
        );

    }


    explanation.push(
        "The confidence score combines " +
        "directional movement, digit " +
        "distribution and recent momentum."
    );


    // -------------------------------------
    // Save Analysis To Global State
    // -------------------------------------

    updateAI(
        confidence,
        trend,
        momentum
    );


    return {

        ticksAnalyzed:
            ticks.length,

        confidence:
            confidence,

        trend:
            trend,

        momentum:
            momentum,

        strength:
            strength,

        hotDigits:
            hotDigits,

        coldDigits:
            coldDigits,

        currentStreakDigit:
            currentStreakDigit,

        currentStreak:
            currentStreak,

        longestStreakDigit:
            longestStreakDigit,

        longestStreak:
            longestStreak,

        rising:
            rising,

        falling:
            falling,

        digitCounts:
            digitCounts,

        explanation:
            explanation

    };

}


// =========================================
// Render DeepScan Report
// =========================================

function renderScanReport(
    analysis
) {

    const hotDigitHTML =
        analysis.hotDigits
            .map(function(item) {

                return `

                    <div class="digit-box">

                        <strong>
                            ${item.digit}
                        </strong>

                        <span>
                            ${item.count} times
                        </span>

                    </div>

                `;

            })
            .join("");


    const coldDigitHTML =
        analysis.coldDigits
            .map(function(item) {

                return `

                    <div class="digit-box">

                        <strong>
                            ${item.digit}
                        </strong>

                        <span>
                            ${item.count} times
                        </span>

                    </div>

                `;

            })
            .join("");


    const explanationHTML =
        analysis.explanation
            .map(function(item) {

                return `
                    <p>✓ ${item}</p>
                `;

            })
            .join("");


    document.getElementById("app").innerHTML = `

        <div class="header">

            🧠 DeepScan AI

        </div>


        <div class="container">


            <!-- Market -->

            <div class="card">

                <h2>
                    ${selectedMarket}
                </h2>

                <p>
                    Symbol:
                    <b>${selectedSymbol}</b>
                </p>

                <p>
                    Live sample:
                    <b>
                        ${analysis.ticksAnalyzed}
                        ticks
                    </b>
                </p>

            </div>


            <!-- Confidence -->

            <div class="card scan-card">

                <h3>
                    🧠 Analysis Confidence
                </h3>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="
                            width:
                            ${analysis.confidence}%
                        "
                    ></div>

                </div>

                <p>
                    <b>
                        ${analysis.confidence}%
                    </b>
                </p>

                <p>
                    Strength:
                    <b>
                        ${analysis.strength}
                    </b>
                </p>

            </div>


            <!-- Trend -->

            <div class="card">

                <h3>
                    📈 Trend
                </h3>

                <p>
                    <b>
                        ${analysis.trend}
                    </b>
                </p>

            </div>


            <!-- Momentum -->

            <div class="card">

                <h3>
                    ⚡ Momentum
                </h3>

                <p>
                    <b>
                        ${analysis.momentum}
                    </b>
                </p>

            </div>


            <!-- Hot Digits -->

            <div class="card">

                <h3>
                    🔥 Hot Digits
                </h3>

                <div class="digit-grid">

                    ${hotDigitHTML}

                </div>

            </div>


            <!-- Cold Digits -->

            <div class="card">

                <h3>
                    ❄️ Cold Digits
                </h3>

                <div class="digit-grid">

                    ${coldDigitHTML}

                </div>

            </div>


            <!-- Streak -->

            <div class="card">

                <h3>
                    🔁 Streak Analysis
                </h3>

                <p>
                    Current digit:
                    <b>
                        ${
                            analysis.currentStreakDigit !== null
                                ? analysis.currentStreakDigit
                                : "--"
                        }
                    </b>
                </p>

                <p>
                    Current streak:
                    <b>
                        ${analysis.currentStreak}
                    </b>
                </p>

                <p>
                    Longest streak:
                    <b>
                        ${analysis.longestStreak}
                    </b>
                </p>

                <p>
                    Longest streak digit:
                    <b>
                        ${
                            analysis.longestStreakDigit !== null
                                ? analysis.longestStreakDigit
                                : "--"
                        }
                    </b>
                </p>

            </div>


            <!-- Digit Distribution -->

            <div class="card">

                <h3>
                    🔢 Digit Distribution
                </h3>

                <div class="digit-grid">

                    ${
                        Object.keys(
                            analysis.digitCounts
                        )
                        .map(function(digit) {

                            return `

                                <div class="digit-box">

                                    <strong>
                                        ${digit}
                                    </strong>

                                    <span>
                                        ${
                                            analysis
                                                .digitCounts[digit]
                                        }
                                    </span>

                                </div>

                            `;

                        })
                        .join("")
                    }

                </div>

            </div>


            <!-- Explanation -->

            <div class="card">

                <h3>
                    📋 Why did DeepScan give this result?
                </h3>

                ${explanationHTML}

            </div>


            <!-- Disclaimer -->

            <div class="card">

                <h3>
                    ⚠️ Analysis Notice
                </h3>

                <p>
                    This score is a statistical
                    analysis of the collected
                    live tick sample.
                </p>

                <p>
                    It is not a guaranteed prediction,
                    does not guarantee a winning trade,
                    and should not be treated as
                    financial advice.
                </p>

            </div>


            <button onclick="deepScan()">

                🔄 Scan Again

            </button>


            <button onclick="showHome()">

                ⬅ Back to Dashboard

            </button>


            <div class="footer-space"></div>

        </div>

    `;

}