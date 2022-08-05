// https://www.youtube.com/watch?v=fbYExfeFsI0

const { MongoClient } = require("mongodb");

async function main (data) {
    const uri = "mongodb+srv://demo:node1234@cluster0.cu02fpv.mongodb.net/?retryWrites=true&w=majority"

    const client = new MongoClient(uri);

    try {
        await client.connect();
        await addSchedulingData(data);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

main().catch(console.error);

async function addSchedulingData (client, data) {
    const newData = {id_: data.id, name: data.name, sub: data.sub, notes: data.notes};
    const result = await client.db("scheduling_data").collection("userSchedules").insertOne(data);
    console.log(`${result} added.`)
}

export { main };

/* 
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

    if (result) {
        console.log(`Found a listing in the collection with the name ${nameOfListing}`);
        console.log(result);
    } else {
        console.log(`No listing found with the name ${nameOfListing}`);
    }
}

async function createMultipleListings(client, newListings) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);
    console.log(`${result.insertedCount} new listings added with the ids: `);
    console.log(result.insertedIds);
}

async function listDatabases (client) {
    const databasesList =  await client.db().admin().listDatabases();

    console.log(databasesList);
    databasesList.databases.forEach(db => console.log(`- ${db.name}`));
}

async function createListing (client, newListing) {
	const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`New listing created with id ${result.insertedId}`)
} */