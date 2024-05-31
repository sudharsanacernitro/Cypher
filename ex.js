const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });
let db;

client.connect()
  .then(() => {
    db = client.db('insta');
    console.log('Connected successfully to MongoDB');
    
    // Call the function after the connection is established
    call();
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

async function call() {
  try {
    const collection = db.collection('login'); 
    const result = await collection.find({}).project({name:1 , _id:0}).toArray();
    console.log(result);
  } catch (error) {
    console.error('Error occurred while querying data:', error);
  }
}
