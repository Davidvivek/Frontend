// mongodbExample.js

// Import MongoDB client
const { MongoClient, ObjectId } = require("mongodb");

// Read connection string from environment variable
const uri = process.env.MONGODB_URI;

// Safety check
if (!uri) {
  console.error("❌ MONGODB_URI not set. Please set your environment variable.");
  process.exit(1);
}

// Create client
const client = new MongoClient(uri);

async function run() {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");

    await client.connect();
    console.log("✅ Connected successfully!");

    // Choose database
    const db = client.db("userAppDB");

    // Choose collection
    const collection = db.collection("userProfiles");

    console.log("📦 Inserting sample documents...");

    // Create 10 sample users with timestamps
    const users = Array.from({ length: 10 }, (_, i) => ({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      createdAt: new Date(Date.now() - i * 1000000)
    }));

    // Insert data
    const result = await collection.insertMany(users);
    console.log(`✅ Inserted ${result.insertedCount} documents`);

    console.log("\n📊 Fetching 5 most recent users...");

    const recent = await collection
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log(recent);

    console.log("\n🔍 Fetching one user by _id...");

    const oneId = result.insertedIds[0];

    const oneUser = await collection.findOne({
      _id: new ObjectId(oneId)
    });

    console.log(oneUser);

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
    console.log("\n🔌 Connection closed.");
  }
}

run();