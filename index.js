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

        const customerCollection = client
            .db("assessment")
            .collection("customers");

        app.get("/customers", async (req, res) => {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pagesize);
            let result;
            if (page >= 0 && pageSize) {
                result = customerCollection
                    .find({})
                    .skip(page * pageSize)
                    .limit(pageSize);
            } else {
                result = customerCollection.find({});
            }

            const customers = await result.toArray();
            res.status(200).send(customers);
        });

        app.get("/customerCount", async (req, res) => {
            const query = {};
            const count = await customerCollection.countDocuments(query);
            res.send({ count });
        });
    } finally {
    }
}
app.get("/", (req, res) => {
    res.send("hello");
});
app.listen(port, () => {
    console.log("server is running at port,", port);
});

run().catch(console.dir);
