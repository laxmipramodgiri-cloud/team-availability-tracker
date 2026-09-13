const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const dataFile = path.join(__dirname, "team.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Get team members
app.get("/api/team", (req, res) => {
    const team = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    res.json(team);
});

// Update team member status
app.put("/api/team/:id", (req, res) => {
    const team = JSON.parse(fs.readFileSync(dataFile, "utf8"));

    const member = team.find(
        m => m.id === Number(req.params.id)
    );

    if (!member) {
        return res.status(404).json({
            message: "Team member not found"
        });
    }

    const allowedStatuses = ["Available", "Busy", "Away"];

    if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    member.status = req.body.status;

    fs.writeFileSync(
        dataFile,
        JSON.stringify(team, null, 2)
    );

    res.json(member);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});