const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to parse JSON requests

const cors = require('cors');
app.use(cors());
const URI ="mongodb+srv://ibsam:mongoDB1@cluster0.sdpjjkx.mongodb.net/van_life_database?retryWrites=true&w=majority&appName=Cluster0"

let userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
});
let userModel = mongoose.model('users', userSchema);

mongoose.connect(URI)
    .then(() => { console.log("database connected") })
    .catch((err) => { console.log(err) });

const vans = [
    { id: 1, name: "Modest Explorer", price: 60, description: "The Modest Explorer is a van designed to get you out of the house and into nature. This beauty is equipped with solar panels, a composting toilet, a water tank and kitchenette. The idea is that you can pack up your home and escape for a weekend or even longer!", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/modest-explorer.png", type: "simple", hostId: "123",btnstyle:"w-fit capitalize inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-500 rounded-lg hover:bg-orange-300 focus:ring-4 focus:outline-none focus:bg-orange-400 dark:bg-orange-400 dark:hover:bg-blue-700 dark:focus:ring-blue-800"},
    { id: 2, name: "Beach Bum", price: 80, description: "Beach Bum is a van inspired by surfers and travelers. It was created to be a portable home away from home, but with some cool features in it you won't find in an ordinary camper.", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/beach-bum.png", type: "rugged", hostId: "123",btnstyle:"w-fit capitalize inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-900 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:bg-green-800 dark:bg-green-800 dark:hover:bg-green-800 dark:focus:ring-blue-900" },
    { id: 3, name: "Reliable Red", price: 100, description: "Reliable Red is a van that was made for travelling. The inside is comfortable and cozy, with plenty of space to stretch out in. There's a small kitchen, so you can cook if you need to. You'll feel like home as soon as you step out of it.", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/reliable-red.png", type: "luxury", hostId: "456",btnstyle:"w-fit capitalize inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-black focus:ring-4 focus:outline-none focus:bg-black dark:bg-black dark:hover:bg-black dark:focus:ring-gray-600" },
    { id: 4, name: "Dreamfinder", price: 65, description: "Dreamfinder is the perfect van to travel in and experience. With a ceiling height of 2.1m, you can stand up in this van and there is great head room. The floor is a beautiful glass-reinforced plastic (GRP) which is easy to clean and very hard wearing. A large rear window and large side windows make it really light inside and keep it well ventilated.", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/dreamfinder.png", type: "simple", btnstyle:"w-fit capitalize inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-500 rounded-lg hover:bg-orange-300 focus:ring-4 focus:outline-none focus:bg-orange-400 dark:bg-orange-400 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    { id: 4, name: "Dreamfinder", price: 65, description: "Dreamfinder is the perfect van to travel in and experience. With a ceiling height of 2.1m, you can stand up in this van and there is great head room. The floor is a beautiful glass-reinforced plastic (GRP) which is easy to clean and very hard wearing. A large rear window and large side windows make it really light inside and keep it well ventilated.", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/dreamfinder.png", type: "simple", hostId: "789",btnstyle:"w-fit capitalize inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-black focus:ring-4 focus:outline-none focus:bg-black dark:bg-black dark:hover:bg-black dark:focus:ring-gray-600" },
    { id: 5, name: "The Cruiser", price: 120, description: "The Cruiser is a van for those who love to travel in comfort and luxury. With its many windows, spacious interior and ample storage space, the Cruiser offers a beautiful view wherever you go.", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/the-cruiser.png", type: "luxury", hostId: "789" },
    { id: 6, name: "Green Wonder", price: 70, description: "With this van, you can take your travel life to the next level. The Green Wonder is a sustainable vehicle that's perfect for people who are looking for a stylish, eco-friendly mode of transport that can go anywhere.", imageUrl: "https://assets.scrimba.com/advanced-react/react-router/green-wonder.png", type: "rugged", hostId: "123",btnstyle:"w-fit capitalize inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-900 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:bg-green-800 dark:bg-green-800 dark:hover:bg-green-800 dark:focus:ring-blue-900" }
];

app.get('/api/vans', (req, res) => {
    res.send(vans);
});

app.post("/user", async (req, res) => {
    const  {email}  = req.body;

    try {
        // Check if the email already exists in the database
        const existingUser = await userModel.findOne({ email });

        // If email already exists, return error
        if (existingUser) {
            return res.status(400).json({ status: false, message: "Email already exists" });
        }

        // If email doesn't exist, save the user data
        const newUser = new userModel(req.body);
        await newUser.save();

        res.status(201).json({ status: true, message: "User saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server err" });
    }
});


app.post("/check", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find a user with the provided email
        const user = await userModel.findOne({ email });

        // If no user found, return error
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(401).json({ status: false, message: "Incorrect password" });
        }

        // If email and password match, user is signed in
        console.log("User signed in");
        res.status(200).json({ status: true, message: "User signed in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});




app.get('/api/vans/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const van = vans.find(van => van.id === id);
    if (!van) {
        res.status(404).json({ error: 'Van not found' });
    } else {
        res.send(van);
    }
});


app.get('/api/host/vans', (req, res) => {
    const hostVans = vans.filter(van => van.hostId === '123');
    res.send(hostVans);
});

app.get('/api/host/vans/:id', (req, res) => {
    const id = req.params.id;
    const van = vans.find(van => van.id == id && van.hostId == '123');
    if (!van) {
        res.status(404).json({ error: 'Van not found' });
    } else {
        res.send(van);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
