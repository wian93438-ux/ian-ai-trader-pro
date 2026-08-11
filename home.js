// =========================================
// Ian AI Trader Pro
// Home Dashboard
// =========================================

function showHome() {

    document.getElementById("app").innerHTML = `

        <div class="header">
            🤖 Ian AI Trader Pro
        </div>

        <div class="container">

            <!-- Welcome / Connection -->

            <div class="card">

                <h2>
                    Welcome ${APP.owner} 👋
                </h2>

                <p>
                    Connection:
                    <span class="${
                        connectionStatus === "Online"
                            ? "status-online"
                            : "status-offline"
                    }">
                        ${connectionStatus}
                    </span>
                </p>

            </div>


            <!-- Account -->

            <div class="card">

                <h3>💰 Trading Account</h3>

                <p>
                    Balance:
                    <b>${balance}</b>
                </p>

                <p>
                    Currency:
                    <b>${currency}</b>
                </p>

                ${
                    loginId
                        ? `<p>Account:
                            <b>${loginId}</b>
                           </p>`
                        : ""
                }

            </div>


            <!-- Selected Market -->

            <div class="card">

                <h3>📊 Selected Market</h3>

                <p>

                    ${
                        selectedMarket
                            ? `<span class="market-selected">
                                ${selectedMarket}
                               </span>`
                            : "No market selected"
                    }

                </p>

                ${
                    selectedSymbol
                        ? `<p>
                            Symbol:
                            <b>${selectedSymbol}</b>
                           </p>`
                        : ""
                }

            </div>


            <!-- AI Confidence -->

            <div class="card scan-card">

                <h3>🧠 AI Confidence</h3>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${aiConfidence}%"
                    ></div>

                </div>

                <p>
                    <b>${aiConfidence}%</b>
                </p>

            </div>


            <!-- Trend -->

            <div class="card">

                <h3>📈 Trend</h3>

                <p>
                    ${currentTrend}
                </p>

            </div>


            <!-- Momentum -->

            <div class="card">

                <h3>⚡ Momentum</h3>

                <p>
                    ${currentMomentum}
                </p>

            </div>


            <!-- Live Tick Information -->

            <div class="card">

                <h3>📡 Live Market Data</h3>

                <p>
                    Last Tick:
                    <b>
                        ${
                            lastTick !== null
                                ? lastTick
                                : "--"
                        }
                    </b>
                </p>

                <p>
                    Last Digit:
                    <b>
                        ${
                            lastDigit !== null
                                ? lastDigit
                                : "--"
                        }
                    </b>
                </p>

                <p>
                    Ticks Collected:
                    <b>${tickHistory.length}</b>
                </p>

            </div>


            <!-- Main Actions -->

            <button onclick="showMarkets()">
                📊 Select Market
            </button>

            <button onclick="connectDeriv()">
                🔗 Connect to Deriv
            </button>

            <button onclick="deepScan()">
                🧠 Deep Scan
            </button>

            <button onclick="openSettings()">
                ⚙️ Settings
            </button>

            <button onclick="logout()">
                🚪 Logout
            </button>

            <div class="footer-space"></div>

        </div>

    `;
}