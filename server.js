const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");

const app = express();

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Home route
app.get("/", (req, res) => {
    res.send("Server running");
});

// Signup route
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        res.status(201).json({
            message: "Signup successful",
            user
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Login route
app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
});
app.post("/projects", async (req, res) => {
    try {

        const project = await Project.create({
            title: req.body.title,
            description: req.body.description,
            createdBy: req.body.createdBy
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
});
app.post("/tasks", async (req, res) => {
    try {

        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            assignedTo: req.body.assignedTo,
            project: req.body.project
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});