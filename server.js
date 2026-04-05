const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let collection;

async function startServer() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db("testDB");
        collection = db.collection("users");

        // API: get latest users
        app.get("/users", async (req, res) => {
            const users = await collection
                .find()
                .sort({ createdAt: -1 })
                .limit(5)
                .toArray();

            res.json(users);
        });

        // API: get user by id
        app.get("/users/:id", async (req, res) => {
            const user = await collection.findOne({
                _id: new ObjectId(req.params.id),
            });
            res.json(user);
        });

        app.listen(5000, () => {
            console.log("🚀 Server running at http://localhost:5000");
        });

    } catch (err) {
        console.error("❌ Error:", err);
    }
}

startServer();