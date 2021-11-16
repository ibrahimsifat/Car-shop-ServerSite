const express=require('express')
const app=express()
const port=process.env.PORT || 5000;
require('dotenv').config()
const cors=require('cors')
const ObjectId=require('mongodb').ObjectId

// middleware

app.use(cors())
app.use(express.json())

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1clhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);
async function run(){

    try{
 
    await client.connect();
    const database = client.db("Car-Shop");
    const OrderCollection = database.collection("Order");
    const ServicesCollection = database.collection("Services");
    const userCollection=database.collection('users')
    const reviewCollection=database.collection('reviews')
// GET service 
app.get('/services',async(req,res)=>{
    const cursor=ServicesCollection.find({})
    const orders=await cursor.toArray()
    res.send(orders)
})

// GET order
app.get('/orders',async(req,res)=>{
    const email = req.query.email;
    let query={}
    if (email) {
         query = { email: email };
    }
    const cursor=OrderCollection.find(query)
    const orders=await cursor.toArray()
    res.send(orders)
})
// GET review data 
app.get('/review',async(req,res)=>{
    const cursor=reviewCollection.find({})
    const review=await cursor.toArray()
    res.send(review)
})

// POST order booking
app.post('/order',async (req,res)=>{
    const order=req.body
    const result= await OrderCollection.insertOne(order)    
    res.json(result)
})

//post user data
app.post('/users',async(req,res)=>{
    const user=req.body
    const result=await userCollection.insertOne(user)
    res.json(result)
})

//post review data
app.post('/review',async(req,res)=>{
    const user=req.body
    const result=await reviewCollection.insertOne(user)
    res.json(result)
})
//post service add  data
app.post('/services',async(req,res)=>{
    const service=req.body
    console.log(service);
    const result=await ServicesCollection.insertOne(service)
    res.json(result)
})

// user googleLogin upsert or update user details
app.put('/users',async(req,res)=>{
    const user=req.body
    const filter={email:user.email}
    const option={upsert:true}
    const updateDoc={$set:user}
    const result= await userCollection.updateOne(filter,updateDoc,option)
    res.json(result)
}) 
//make a admin with email

app.put('/users/admin',async(req,res)=>{
    const user=req.body
    const filter={email:user.email}
    const updateDoc={$set:{role:'admin'}}
    const result= await userCollection.updateOne(filter,updateDoc)
    res.json(result)
}) 


//Get api with id
app.get('/users/:email',async(req,res)=>{
  const email=req.params.email
  console.log(email);
  const query={email:email}
  const user=await userCollection.findOne(query)
  let isAdmin=false
  if(user?.role==='admin'){
      isAdmin=true;
  }
  res.send({admin:isAdmin})
})

      // DELETE  service with id
      app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await ServicesCollection.deleteOne(query);
        res.json(result);
    })
    
    
    // DELETE an order with id
      app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await OrderCollection.deleteOne(query);
        res.json(result);
    })



    }



    finally{

    }

}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('running d sdfsdg ')
})











app.listen(port,(req,res)=>{
    console.log('running prot',port);
})