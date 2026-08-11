// =========================================
// Ian AI Trader Pro
// Markets Module
// =========================================

// -----------------------------------------
// Supported Deriv Synthetic Markets
// -----------------------------------------

const marketList = [

    // Volatility Indices

    {
        name: "Volatility 10 Index",
        symbol: "R_10"
    },

    {
        name: "Volatility 25 Index",
        symbol: "R_25"
    },

    {
        name: "Volatility 50 Index",
        symbol: "R_50"
    },

    {
        name: "Volatility 75 Index",
        symbol: "R_75"
    },

    {
        name: "Volatility 100 Index",
        symbol: "R_100"
    },

    // 1 Second Volatility Indices

    {
        name: "Volatility 10 (1s)",
        symbol: "1HZ10V"
    },

    {
        name: "Volatility 25 (1s)",
        symbol: "1HZ25V"
    },

    {
        name: "Volatility 50 (1s)",
        symbol: "1HZ50V"
    },

    {
        name: "Volatility 75 (1s)",
        symbol: "1HZ75V"
    },

    {
        name: "Volatility 100 (1s)",
        symbol: "1HZ100V"
    },

    // Boom Indices

    {
        name: "Boom 300 Index",
        symbol: "BOOM300"
    },

    {
        name: "Boom 500 Index",
        symbol: "BOOM500"
    },

    {
        name: "Boom 1000 Index",
        symbol: "BOOM1000"
    },

    // Crash Indices

    {
        name: "Crash 300 Index",
        symbol: "CRASH300"
    },

    {
        name: "Crash 500 Index",
        symbol: "CRASH500"
    },

    {
        name: "Crash 1000 Index",
        symbol: "CRASH1000"
    },

    // Step Index

    {
        name: "Step Index",
        symbol: "STEP"
    }

];


// =========================================
// Display Markets
// =========================================

function showMarkets() {

    let marketButtons = "";

    marketList.forEach(function(market) {

        marketButtons += `

            <button
                onclick="
                    selectMarket(
                        '${market.name}',
                        '${market.symbol}'
                    )
                "
            >

                📊 ${market.name}

            </button>

        `;

    });


    document.getElementById("app").innerHTML = `

        <div class="header">

            📊 Market Center

        </div>


        <div class="container">


            <div class="card">

                <h2>
                    Select Market
                </h2>

                <p>
                    Choose the synthetic market
                    Ian AI Trader Pro should analyse.
                </p>

            </div>


            ${marketButtons}


            <button onclick="showHome()">

                ⬅ Back to Dashboard

            </button>


            <div class="footer-space"></div>

        </div>

    `;

}


// =========================================
// Select Market
// =========================================

function selectMarket(name, symbol) {

    updateMarket(
        name,
        symbol
    );


    alert(
        "Market Selected\n\n" +
        name +
        "\n\nSymbol: " +
        symbol
    );


    showHome();

}