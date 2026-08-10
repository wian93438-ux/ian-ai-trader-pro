// =========================================
// Ian AI Trader Pro
// Login Module
// =========================================

function showLogin() {

    document.getElementById("app").innerHTML = `

        <div class="login">

            <h1>🤖 Ian AI Trader Pro</h1>

            <p>
                Professional Deriv Market Analysis
            </p>

            <input
                id="username"
                type="text"
                placeholder="Username"
                autocomplete="username"
            >

            <input
                id="password"
                type="password"
                placeholder="Password"
                autocomplete="current-password"
            >

            <button onclick="login()">
                🔓 LOGIN
            </button>

            <p style="
                margin-top:20px;
                margin-bottom:0;
                font-size:13px;
                color:#64748b;
            ">
                Version ${APP.version}
            </p>

        </div>

    `;

    // Allow the Enter key to submit the login.
    const passwordInput =
        document.getElementById("password");

    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {

                    login();

                }

            }
        );

    }

}


// =========================================
// Login
// =========================================

function login() {

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    if (!usernameInput || !passwordInput) {

        return;

    }

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;

    if (username === "") {

        alert("Please enter your username.");

        usernameInput.focus();

        return;

    }

    if (password === "") {

        alert("Please enter your password.");

        passwordInput.focus();

        return;

    }


    // -------------------------------------
    // Personal Login
    // -------------------------------------
    //
    // This is only the local application
    // login. It is NOT your Deriv password.
    //
    // We will improve the security system
    // later.
    // -------------------------------------

    if (
        username === "Ian" &&
        password === "12345"
    ) {

        showHome();

    } else {

        alert(
            "Incorrect username or password."
        );

        passwordInput.value = "";

        passwordInput.focus();

    }

}