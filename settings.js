// =========================================
// Ian AI Trader Pro
// Settings Module
// =========================================

// -----------------------------------------
// Open Settings
// -----------------------------------------

function openSettings() {

    const savedAppId =
        localStorage.getItem("derivAppId") || "";

    const savedToken =
        localStorage.getItem("derivToken") || "";


    document.getElementById("app").innerHTML = `

        <div class="header">

            ⚙️ Settings

        </div>


        <div class="container">


            <!-- Application Information -->

            <div class="card">

                <h2>
                    🤖 Ian AI Trader Pro
                </h2>

                <p>
                    Version ${APP.version}
                </p>

                <p>
                    Configure your Deriv connection
                    below.
                </p>

            </div>


            <!-- Deriv App ID -->

            <div class="card">

                <h3>
                    🆔 Deriv App ID
                </h3>

                <p>
                    Enter the App ID from your
                    Deriv developer application.
                </p>

                <input
                    id="appId"
                    type="text"
                    placeholder="Enter your Deriv App ID"
                    value="${savedAppId}"
                    autocomplete="off"
                >

            </div>


            <!-- Deriv API Token -->

            <div class="card">

                <h3>
                    🔑 Deriv API Token
                </h3>

                <p>
                    Enter the API token you created
                    for this application.
                </p>

                <input
                    id="apiToken"
                    type="password"
                    placeholder="Enter your Deriv API Token"
                    value="${savedToken}"
                    autocomplete="off"
                >

            </div>


            <!-- Save -->

            <div class="card">

                <h3>
                    💾 Connection Settings
                </h3>

                <button onclick="saveSettings()">

                    💾 Save Settings

                </button>

            </div>


            <!-- Security Information -->

            <div class="card">

                <h3>
                    🔐 Security
                </h3>

                <p>
                    Your App ID and API token are
                    stored locally on this device.
                </p>

                <p>
                    Do not share your API token
                    with anyone.
                </p>

            </div>


            <!-- About -->

            <div class="card">

                <h3>
                    ℹ️ About
                </h3>

                <p>
                    Ian AI Trader Pro is an
                    educational market-analysis
                    platform designed to analyse
                    live Deriv synthetic-index data.
                </p>

                <p>
                    DeepScan will provide
                    statistical information and
                    explanations rather than
                    guaranteed predictions.
                </p>

            </div>


            <button onclick="showHome()">

                ⬅ Back to Dashboard

            </button>


            <div class="footer-space"></div>


        </div>

    `;

}


// =========================================
// Save Settings
// =========================================

function saveSettings() {

    const appIdInput =
        document.getElementById("appId");

    const tokenInput =
        document.getElementById("apiToken");


    if (!appIdInput || !tokenInput) {

        alert(
            "Settings form could not be loaded."
        );

        return;

    }


    const appId =
        appIdInput.value.trim();

    const token =
        tokenInput.value.trim();


    // -------------------------------------
    // Validate App ID
    // -------------------------------------

    if (appId === "") {

        alert(
            "Please enter your Deriv App ID."
        );

        appIdInput.focus();

        return;

    }


    // -------------------------------------
    // Validate API Token
    // -------------------------------------

    if (token === "") {

        alert(
            "Please enter your Deriv API Token."
        );

        tokenInput.focus();

        return;

    }


    // -------------------------------------
    // Save Locally
    // -------------------------------------

    localStorage.setItem(
        "derivAppId",
        appId
    );

    localStorage.setItem(
        "derivToken",
        token
    );


    alert(
        "Deriv settings saved successfully."
    );


    showHome();

}