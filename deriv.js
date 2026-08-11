// =========================================
// Ian AI Trader Pro
// Deriv WebSocket Module
// =========================================

// -----------------------------------------
// Connect to Deriv
// -----------------------------------------

function connectDeriv() {

    const appId =
        localStorage.getItem("derivAppId");

    const token =
        localStorage.getItem("derivToken");


    // -------------------------------------
    // Check Settings
    // -------------------------------------

    if (!appId) {

        alert(
            "Deriv App ID is missing.\n\n" +
            "Please open Settings and enter it."
        );

        openSettings();

        return;

    }


    if (!token) {

        alert(
            "Deriv API Token is missing.\n\n" +
            "Please open Settings and enter it."
        );

        openSettings();

        return;

    }


    // -------------------------------------
    // Close Existing Connection
    // -------------------------------------

    if (ws) {

        try {

            ws.close();

        } catch (error) {

            console.log(
                "Previous connection could not be closed.",
                error
            );

        }

    }


    // Clear previous market data.

    clearTickHistory();


    updateConnection(
        "Connecting..."
    );


    showHome();


    // -------------------------------------
    // Create WebSocket
    // -------------------------------------

    const socketUrl =
        "wss://ws.derivws.com/websockets/v3?app_id=" +
        encodeURIComponent(appId);


    try {

        ws = new WebSocket(
            socketUrl
        );

    } catch (error) {

        console.error(
            "WebSocket creation error:",
            error
        );

        updateConnection(
            "Offline"
        );

        showHome();

        alert(
            "Unable to create the Deriv connection."
        );

        return;

    }


    // -------------------------------------
    // Connection Open
    // -------------------------------------

    ws.onopen = function() {

        console.log(
            "Connected to Deriv WebSocket."
        );


        updateConnection(
            "Authenticating..."
        );


        showHome();


        // Authorize account.

        ws.send(
            JSON.stringify({

                authorize: token

            })
        );

    };


    // -------------------------------------
    // Incoming Messages
    // -------------------------------------

    ws.onmessage = function(event) {

        let data;


        try {

            data =
                JSON.parse(event.data);

        } catch (error) {

            console.error(
                "Invalid Deriv message:",
                error
            );

            return;

        }


        console.log(
            "Deriv:",
            data
        );


        // ---------------------------------
        // API Error
        // ---------------------------------

        if (data.error) {

            console.error(
                "Deriv API Error:",
                data.error
            );


            updateConnection(
                "Offline"
            );


            derivConnected = false;


            showHome();


            alert(
                "Deriv error:\n\n" +
                data.error.message
            );


            return;

        }


        // ---------------------------------
        // Authorization
        // ---------------------------------

        if (
            data.msg_type ===
            "authorize"
        ) {

            derivConnected = true;


            loginId =
                data.authorize.loginid ||
                "";


            updateConnection(
                "Online"
            );


            updateBalance(

                data.authorize.balance,

                data.authorize.currency

            );


            // Request live balance.

            ws.send(
                JSON.stringify({

                    balance: 1,

                    subscribe: 1

                })
            );


            // Subscribe to selected market.

            const savedSymbol =
                localStorage.getItem(
                    "marketSymbol"
                );


            if (savedSymbol) {

                subscribeTicks(
                    savedSymbol
                );

            }


            showHome();


            alert(
                "Connected to Deriv successfully.\n\n" +
                "Account: " +
                loginId
            );


            return;

        }


        // ---------------------------------
        // Balance Updates
        // ---------------------------------

        if (
            data.msg_type ===
            "balance"
        ) {

            if (data.balance) {

                updateBalance(

                    data.balance.balance,

                    data.balance.currency

                );

            }


            showHome();

            return;

        }


        // ---------------------------------
        // Live Tick
        // ---------------------------------

        if (
            data.msg_type ===
            "tick"
        ) {

            processTick(
                data.tick
            );

            return;

        }

    };


    // -------------------------------------
    // WebSocket Error
    // -------------------------------------

    ws.onerror = function(error) {

        console.error(
            "Deriv WebSocket error:",
            error
        );


        derivConnected = false;


        updateConnection(
            "Offline"
        );


        showHome();


        alert(
            "Deriv connection failed.\n\n" +
            "Please check your App ID, API token, " +
            "internet connection and Deriv app settings."
        );

    };


    // -------------------------------------
    // WebSocket Closed
    // -------------------------------------

    ws.onclose = function() {

        console.log(
            "Deriv WebSocket closed."
        );


        derivConnected = false;


        updateConnection(
            "Offline"
        );


        ws = null;


        showHome();

    };

}


// =========================================
// Subscribe To Live Ticks
// =========================================

function subscribeTicks(symbol) {

    if (!ws) {

        console.log(
            "No active Deriv connection."
        );

        return;

    }


    if (
        ws.readyState !==
        WebSocket.OPEN
    ) {

        console.log(
            "WebSocket is not ready."
        );

        return;

    }


    if (!symbol) {

        console.log(
            "No market symbol selected."
        );

        return;

    }


    console.log(
        "Subscribing to:",
        symbol
    );


    ws.send(
        JSON.stringify({

            ticks: symbol,

            subscribe: 1

        })
    );

}


// =========================================
// Process Live Tick
// =========================================

function processTick(tick) {

    if (!tick) {

        return;

    }


    // Store the raw quote.

    const quote =
        Number(tick.quote);


    if (!Number.isFinite(quote)) {

        return;

    }


    lastTick = quote;


    // -------------------------------------
    // Extract Last Digit
    // -------------------------------------

    const quoteString =
        String(tick.quote);


    const digits =
        quoteString.replace(
            /[^0-9]/g,
            ""
        );


    if (digits.length > 0) {

        lastDigit =
            Number(
                digits.charAt(
                    digits.length - 1
                )
            );

    }


    // -------------------------------------
    // Store Tick For DeepScan
    // -------------------------------------

    addTick({

        quote: quote,

        digit: lastDigit,

        epoch:
            Number(tick.epoch) || Date.now(),

        symbol:
            tick.symbol || selectedSymbol

    });


    console.log(
        "Tick:",
        quote,
        "Digit:",
        lastDigit,
        "Total:",
        tickHistory.length
    );


    // Refresh dashboard occasionally.

    if (
        tickHistory.length === 1 ||
        tickHistory.length % 10 === 0
    ) {

        showHome();

    }

}


// =========================================
// Disconnect From Deriv
// =========================================

function disconnectDeriv() {

    if (!ws) {

        updateConnection(
            "Offline"
        );

        showHome();

        return;

    }


    try {

        ws.close();

    } catch (error) {

        console.error(
            "Disconnect error:",
            error
        );

    }


    ws = null;

    derivConnected = false;

    updateConnection(
        "Offline"
    );

    clearTickHistory();

    showHome();

}