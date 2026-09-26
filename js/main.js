// =========================================
// GAMING TOURNAMENT PORTAL
// Main JavaScript
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".redirect-form").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (form.hasAttribute("data-registration-form")) {
                const name = form.elements.name.value.trim();
                const email = form.elements.email.value.trim().toLowerCase();
                const role = form.elements.role.value;
                const accounts = JSON.parse(localStorage.getItem("gameArenaAccounts") || "[]");
                if (accounts.some((account) => account.email === email)) {
                    window.alert("An account with this email already exists. Please log in instead.");
                    return;
                }
                accounts.push({ name, email, role });
                localStorage.setItem("gameArenaAccounts", JSON.stringify(accounts));
                const destination = role === "admin" ? "admin.html" : "user.html";
                localStorage.setItem("gameArenaName", name);
                localStorage.setItem("gameArenaRole", role);
                localStorage.setItem("gameArenaEmail", email);
                document.querySelector(".auth-container").innerHTML = `
                    <section class="registration-success" role="status">
                        <div class="success-mark" aria-hidden="true">✓</div>
                        <p class="eyebrow">ACCOUNT CREATED</p>
                        <h1>Registered successfully!</h1>
                        <p>Welcome to GameArena, <strong></strong>.</p>
                        <a class="auth-button success-link" href="${destination}">Open ${role === "admin" ? "admin" : "player"} dashboard</a>
                    </section>`;
                document.querySelector(".registration-success strong").textContent = name;
                return;
            }
            const role = form.elements.role?.value;
            const email = form.elements.email?.value.trim().toLowerCase();
            const accounts = JSON.parse(localStorage.getItem("gameArenaAccounts") || "[]");
            const account = accounts.find((savedAccount) => savedAccount.email === email && savedAccount.role === role);
            if (!account) {
                window.alert("No account was found for this email and role. Please register first.");
                return;
            }
            localStorage.setItem("gameArenaName", account.name);
            localStorage.setItem("gameArenaRole", account.role);
            localStorage.setItem("gameArenaEmail", account.email);
            window.location.href = role === "admin" ? "admin.html" : "user.html";
        });
    });

    const playerName = document.querySelector("[data-player-name]");
    if (playerName) playerName.textContent = localStorage.getItem("gameArenaName") || "Player";

    const gamesPlayed = document.querySelector("[data-games-played]");
    if (gamesPlayed) gamesPlayed.textContent = localStorage.getItem("gameArenaGamesPlayed") || "0";

    const tournamentForm = document.querySelector("[data-tournament-form]");
    const tournamentList = document.querySelector("[data-tournament-list]");
    const renderTournaments = () => {
        if (!tournamentList) return;
        const tournaments = JSON.parse(localStorage.getItem("gameArenaTournaments") || "[]");
        tournamentList.innerHTML = "";
        if (tournaments.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-state";
            empty.textContent = "No tournaments have been added yet.";
            tournamentList.append(empty);
        }
        tournaments.forEach((tournament, index) => {
            const item = document.createElement("article");
            item.className = "dashboard-item";
            const details = document.createElement("div");
            const title = document.createElement("strong");
            title.textContent = tournament.name;
            const meta = document.createElement("p");
            meta.textContent = `${tournament.game} · ${tournament.date}`;
            details.append(title, meta);
            item.append(details);
            if (tournamentForm) {
                const remove = document.createElement("button");
                remove.className = "small-button";
                remove.type = "button";
                remove.textContent = "Remove";
                remove.addEventListener("click", () => {
                    tournaments.splice(index, 1);
                    localStorage.setItem("gameArenaTournaments", JSON.stringify(tournaments));
                    renderTournaments();
                });
                item.append(remove);
            }
            tournamentList.append(item);
        });
        document.querySelectorAll("[data-tournament-count]").forEach((count) => {
            count.textContent = tournaments.length;
        });
    };
    renderTournaments();

    if (tournamentForm) {
        tournamentForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(tournamentForm);
            const tournaments = JSON.parse(localStorage.getItem("gameArenaTournaments") || "[]");
            tournaments.push({ name: formData.get("tournament"), game: formData.get("game"), date: formData.get("date") });
            localStorage.setItem("gameArenaTournaments", JSON.stringify(tournaments));
            tournamentForm.reset();
            renderTournaments();
        });
    }

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (!menuToggle || !navMenu) {
        console.error("Mobile navigation elements not found.");
        return;
    }

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("mobile-active");

        const isOpen = navMenu.classList.contains("mobile-active");

        menuToggle.textContent = isOpen ? "✕" : "☰";

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    // Close menu when a navigation link is clicked
    document.querySelectorAll(".nav-link").forEach((link) => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("mobile-active");

            menuToggle.textContent = "☰";

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

});
