const teamContainer = document.getElementById("teamContainer");

async function loadTeam() {
    try {
        const response = await fetch("/api/team");
        const team = await response.json();

        displayTeam(team);
        updateSummary(team);

    } catch (error) {
        console.error("Error loading team:", error);
        teamContainer.innerHTML = "<p>Unable to load team data.</p>";
    }
}

function displayTeam(team) {
    teamContainer.innerHTML = "";

    team.forEach(member => {
        const card = document.createElement("div");
        card.className = "team-card";

        const statusClass =
            member.status === "Available"
                ? "status-available"
                : member.status === "Busy"
                ? "status-busy"
                : "status-away";

        card.innerHTML = `
            <div class="member-info">
                <div>
                    <div class="member-name">${member.name}</div>
                    <div class="member-role">${member.role}</div>
                </div>

                <span class="status-badge ${statusClass}">
                    ${member.status}
                </span>
            </div>

            <div class="status-buttons">
                <button onclick="updateStatus(${member.id}, 'Available')">
                    Available
                </button>

                <button onclick="updateStatus(${member.id}, 'Busy')">
                    Busy
                </button>

                <button onclick="updateStatus(${member.id}, 'Away')">
                    Away
                </button>
            </div>
        `;

        teamContainer.appendChild(card);
    });
}

function updateSummary(team) {
    document.getElementById("totalMembers").textContent = team.length;

    document.getElementById("availableCount").textContent =
        team.filter(member => member.status === "Available").length;

    document.getElementById("busyCount").textContent =
        team.filter(member => member.status === "Busy").length;

    document.getElementById("awayCount").textContent =
        team.filter(member => member.status === "Away").length;
}

async function updateStatus(id, status) {
    try {
        await fetch(`/api/team/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: status })
        });

        loadTeam();

    } catch (error) {
        console.error("Error updating status:", error);
    }
}

// Load team when page opens
loadTeam();

// Auto-refresh every 5 seconds
setInterval(loadTeam, 5000);