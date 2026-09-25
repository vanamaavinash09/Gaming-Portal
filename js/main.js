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
                localStorage.setItem("gameArenaName", name);
                localStorage.setItem("gameArenaRole", form.elements.role.value);
                document.querySelector(".auth-container").innerHTML = `
                    <section class="registration-success" role="status">
                        <div class="success-mark" aria-hidden="true">✓</div>
                        <p class="eyebrow">ACCOUNT CREATED</p>
                        <h1>Registered successfully!</h1>
                        <p>Welcome to GameArena, <strong></strong>.</p>
                        <a class="auth-button success-link" href="gaming-portal.html">View Portal</a>
                    </section>`;
                document.querySelector(".registration-success strong").textContent = name;
                return;
            }
            const destination = form.dataset.destination;
            const role = form.elements.role?.value;
            const enteredName = form.elements.name?.value.trim();
            const email = form.elements.email?.value.trim();
            const displayName = enteredName || (email ? email.split("@")[0] : "Player");
            localStorage.setItem("gameArenaName", displayName);
            localStorage.setItem("gameArenaRole", role || "user");
            window.location.href = destination || (role === "admin" ? "admin.html" : "user.html");
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
            const remove = document.createElement("button");
            remove.className = "small-button";
            remove.type = "button";
            remove.textContent = "Remove";
            remove.addEventListener("click", () => {
                tournaments.splice(index, 1);
                localStorage.setItem("gameArenaTournaments", JSON.stringify(tournaments));
                renderTournaments();
            });
            item.append(details, remove);
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
