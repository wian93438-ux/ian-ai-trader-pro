// =========================================
// Ian AI Trader Pro
// Main Application Controller
// =========================================

// -----------------------------------------
// Application Information
// -----------------------------------------

const APP = {
    name: "Ian AI Trader Pro",
    version: "3.0",
    owner: "Ian"
};

// -----------------------------------------
// Global Application State
// -----------------------------------------

let selectedMarket = "";
let selectedSymbol = "";

let connectionStatus = "Offline";
let balance = "--";
let currency = "--";

let aiConfidence = 0;
let currentTrend = "--";
let currentMomentum = "--";

// Deriv connection state
let derivConnected = false;
let ws = null;
let loginId = "";

// Live tick state
let lastTick = null;
let lastDigit = null;

// Tick history will eventually be used
// by the DeepScan analysis engine.
let tickHistory = [];

// -----------------------------------------
// State Update Functions
// -----------------------------------------

function updateConnection(status) {

    connectionStatus = status;

}

function updateBalance(amount, curr) {

    balance = amount;
    currency = curr;

}

function updateMarket(name, symbol) {

    selectedMarket = name;
    selectedSymbol = symbol;

    localStorage.setItem(
        "marketName",
        name
    );

    localStorage.setItem(
        "marketSymbol",
        symbol
    );

}

function updateAI(confidence, trend, momentum) {

    aiConfidence = confidence;
    currentTrend = trend;
    currentMomentum = momentum;

}

// -----------------------------------------
// Reset Analysis
// -----------------------------------------

function resetAnalysis() {

    aiConfidence = 0;

    currentTrend = "--";

    currentMomentum = "--";

}

// -----------------------------------------
// Load Saved Market
// -----------------------------------------

function loadSavedMarket() {

    const savedName =
        localStorage.getItem("marketName");

    const savedSymbol =
        localStorage.getItem("marketSymbol");

    if (savedName && savedSymbol) {

        selectedMarket = savedName;
        selectedSymbol = savedSymbol;

    }

}

// -----------------------------------------
// Add Tick To History
// -----------------------------------------

function addTick(tick) {

    tickHistory.push(tick);

    // Keep only the latest 1000 ticks.
    if (tickHistory.length > 1000) {

        tickHistory.shift();

    }

}

// -----------------------------------------
// Clear Tick History
// -----------------------------------------

function clearTickHistory() {

    tickHistory = [];

    lastTick = null;
    lastDigit = null;

}

// -----------------------------------------
// Logout
// -----------------------------------------

function logout() {

    if (ws) {

        try {

            ws.close();

        } catch (error) {

            console.log(
                "WebSocket close error:",
                error
            );

        }

    }

    ws = null;

    derivConnected = false;

    loginId = "";

    connectionStatus = "Offline";

    balance = "--";
    currency = "--";

    clearTickHistory();

    resetAnalysis();

    showLogin();

}

// -----------------------------------------
// Application Startup
// -----------------------------------------

window.onload = function () {

    loadSavedMarket();

    showLogin();

};