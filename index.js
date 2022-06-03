const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yrhsd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        console.log("db connected");

        const customerCollection = client
            .db("assessment")
            .collection("customers");
    } finally {
    }
}
app.get("/", (req, res) => {
    res.send("hello");
});
app.listen(port, () => {
    console.log("server is runnnin at port,", port);
});

run().catch(console.dir);
