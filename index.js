const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const crypto = require("crypto");

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
        const foodsCollection = client.db("assessment").collection("foods");
        const ordersCollection = client.db("assessment").collection("orders");

        app.get("/customers", async (req, res) => {
            try {
                const page = parseInt(req.query.page);
                const pageSize = parseInt(req.query.pagesize);
                const mode = req.query.mode;
                const sort = req.query.sort;
                const sortCriteria = {};
                sortCriteria[sort] = mode;
                const result = customerCollection
                    .find({})
                    .sort(sortCriteria)
                    .skip(page * pageSize)
                    .limit(pageSize);

                const customers = await result.toArray();
                res.status(200).send(customers);
            } catch (error) {
                res.status(400).send({ message: "bad request" });
            }
        });

        app.get("/allCustomers", async (req, res) => {
            const result = customerCollection.find({});
            const customers = await result.toArray();
            res.status(200).send(customers);
        });

        //
        ///
        ////
        /////
        //////
        ///////
        ////////
        /////////
        //////////
        ///////////
        ////////////
        /////////////
        //////////////

        app.get("/foods", async (req, res) => {
            const result = foodsCollection.find({});
            const foods = await result.toArray();
            res.status(200).send(foods);
        });
        app.post("/order", async (req, res) => {
            const doc = req.body;
            const result = await ordersCollection.insertOne(doc);
            res.send(result);
        });

        app.get("/myOrders", async (req, res) => {
            const result = ordersCollection.find({}).sort({ _id: -1 });
            const orders = await result.toArray();
            res.status(200).send(orders);
        });

        app.put("/myOrders/:id", async (req, res) => {
            const orderId = req.params.id;
            const filter = { _id: ObjectId(orderId) };
            const options = { upsert: true };
            const transactionId = crypto.randomBytes(20).toString("hex");
            const updateDoc = {
                $set: {
                    paid: true,
                    transactionId: transactionId,
                    status: "processing",
                },
            };
            const result = await ordersCollection.updateOne(
                filter,
                updateDoc,
                options
            );

            res.send(result);
        });

        //
        ///
        ////
        /////
        //////
        ///////
        ////////
        /////////
        //////////
        ///////////
        ////////////
        /////////////
        //////////////
        ///////////////

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
