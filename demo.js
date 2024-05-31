process.env.PWD = process.cwd()
const port=801;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
const file1 = require('./demo1');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const ejs = require('ejs');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379, });

  redisClient.connect().catch(console.error);
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'eren139', 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 
    }
  }));

  const uri = 'mongodb://0.0.0.0:27017/';
  const client = new MongoClient(uri, {  });
  let db;
  

  client.connect()
    .then(() => {
      db = client.db('insta');
      console.log('Connected successfully to MongoDB');
      app.listen(port, () => {
        console.log(`App is running on port ${port}`);
      });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
  
 
const args = process.argv.slice(2);
let l;
let parsedList;
let jsonList;
let v;
let profile_path="profile.png";
const multer = require('multer');
const path = require('path');
const { Console } = require('console');
    console.log(`Arguments : ${args}`);
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, '/home/sudharsan/projects/gui-webchat/public/profile/');
      },
      filename: function (req, file, cb) {
          cb(null, req.body.email.split('.')[0]+'.png');
          profile_path="/profile/"+req.body.email.split('.')[0]+".png";

      }
  });
  
  const upload = multer({ storage: storage });
  let id;
  app.use(express.static('/home/sudharsan/projects/gui-webchat/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));

//==============================[ Starter ]==============================================

app.use((req, res, next) => {
 
  if((req.url=="/")||(req.url=="/sign_up")||(req.url=="/l")||(req.url=="/login_backend"))
  {
    next();
  }
  else{
         if(req.session.data)
         {
          next();
          console.log('Requested url :'+req.url);
         }    
          
  }
  
});

//================================[ sign-up ]==============================================

app.get('/sign_up', (req, res) => {

  res.render(__dirname + '/public/sign_up.ejs');
});


app.post('/l',upload.single('image'),async(req,res) =>{

   req.body.profile=profile_path;
   req.body.followers=0;
   req.body.following=0;
  try{
    const collection = db.collection('login'); 
    const result = await collection.insertOne(req.body);
    console.log('Document inserted successfully:', result.insertedId);
    // for profile details
    var profile_details={
      name:result.insertedId.toString(),
      post:[],
      followers:[],
      following:[]
    };
    const collection1=db.collection('profile');
    const result1= await collection1.insertOne(profile_details);
    if(result1){
      res.redirect('/');

    };
} 
catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).send('Internal Server Error');
}

 
  });

//==================================[ login ]===================================================

app.get('/',(req,res)=>{

  res.render(__dirname+'/public/login.ejs');

});

app.post("/login_backend",async(req,res)=>{
  req.session.data=req.body;

  console.log(req.body);


  try{
    const collection = db.collection('login'); 
    const result = await collection.findOne({email:req.body.email,name:req.body.name,password:req.body.password});
    if(result)
    {
      id=result._id.toString();

      profile_path=result.profile;
      console.log(req.body.email+" logged-in");
      res.redirect('/home');
    }
    
} 
catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).send('Internal Server Error');
}

});

//================================[ home ]====================================================

app.get("/home",async(req,res)=>{


  try{
    const collection = db.collection('login'); 
    const result = await collection.find({}).toArray();

    const collection1 = db.collection('post'); 
    const result1 = await collection1.find({}).toArray();
    
    if(result1)
    {
      res.render(__dirname+'/public/home.ejs',{result1,result});

    }
    
} 
catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).send('Internal Server Error');
}


});

//================================[ like_count_increase_endpoint ]=========================================
app.use(bodyParser.json());

app.post('/like',async(req,res)=>{

  var user_name=req.session.data.name;
  var like_increment=req.body.img_name;
  const collection=db.collection('post');
  const result=await collection.updateOne({post_name:like_increment},{$inc :{likes:1 },$push: { people: user_name }});
  if(result){
  console.log(req.body);
  }


});

//==================================[ post_comment ]=====================================================

app.post('/comment',async(req,res)=>{

  console.log(req.body);
  console.log(req.session.data.name+'one person commented');
  let comment_data={
                    name:req.session.data.name,
                    data:req.body.data
                  };
  var collection=db.collection('post');
  var result=collection.updateOne({post_name:req.body.post},{$push:{comments:comment_data}});
  if(result)
  {
    console.log("One person commented to "+req.body.post);
  }
});

//================================[ profile ]================================================
var img;
app.get('/profile/:id',async(req,res)=>{

  var profile_id=req.params.id;
  var you=true;
  if(profile_id=='me')
  {
    profile_id=req.session.data.email;
  }
  else{
    you=false;
  }
  try{
    const collection = db.collection('login'); 
    const result = await collection.findOne({email:profile_id});
    img=result.profile;
    console.log(result.name)
    const collection1 = db.collection('profile'); 
    const result1 = await collection1.findOne({name:result._id.toString()});
    
   const collection2=db.collection('post');
   const result2=await collection2.find({name:result.name}).toArray();
    if(result)
    {
      console.log(result2);
      res.render(__dirname+'/public/profile.ejs',{result,result1,result2,you});

    }
    
    
} 
catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).send('Internal Server Error');
}

  
  
});

//to store post images
var postname;
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/home/sudharsan/projects/gui-webchat/public/post/'); // Upload destination directory
  },
  filename: (req, file, cb) => {
    postname=Date.now()+'.png';
    console.log(postname);
    cb(null, postname); // Unique filename
  }
});
const upload1 = multer({ storage:storage1 });


app.post('/post', upload1.single('image'),async(req,res)=>{
       
      console.log(postname,req.session.data);


  try{
    console.log(id);
    const filter = {name:id.toString()};
    const update = { $push: { post: postname } };
    const collection = db.collection('profile'); 
    const result = await collection.updateOne(filter, update);

    const collection1 = db.collection('post'); 
    var post1={
      id:id,
      name:req.session.data.name,
      post_name:postname,
      profile_img:img,
      likes:0,
      people:[],
      comments:[]
    };
    const result1 = await collection1.insertOne(post1);
    if(result)
    {
      res.render(__dirname+'/public/profile.ejs',{result,result1});
      console.log(result);

    }
    
} 
catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).send('Internal Server Error');
}
});
//================================[ message ]=================================================

app.get('/messages', async(req, res) => {

  try{
    const collection = db.collection('login'); 
    const result = await collection.find({}).project({name:1 , _id:0}).toArray();
    console.log(req.session.data.name);
    parsedList=result;
    res.render(__dirname + '/public/1.ejs',{ parsedList,name:req.session.data.name,email:req.session.data.email,profile:profile_path});

  } 
catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).send('Internal Server Error');
}

});
file1.someFunction();
 

//===============================[ common-post ]==============================================
var seepost;
var postname;
app.use(bodyParser.json());

app.post('/common',async(req,res)=>{
 console.log(req.body);

 try{
  const filter = {name:req.body.key};
  const update = { $push: { followers: req.session.data.name } };
  const collection = db.collection('profile'); 
  const result = await collection.updateOne(filter, update);

  const filter1 = {name:id.toString()};
  const update1 = { $push: { following: req.body.name } };
  const result1 = await collection.updateOne(filter1, update1);
 res.json({ message: 'Data received successfully' });
} 
catch (error) {
  console.error('Error occurred while inserting data:', error);
  res.status(500).send('Internal Server Error');
}

});

app.post('/follow_request',async(req,res)=>{

  if(id==seepost)
  {
    res.send("YOUR ARE NOT ALLOWED");
  }
  else{
  try{
    const filter = {name:seepost.toString()};
    const update = { $push: { followers: req.session.data.name } };
    const collection = db.collection('profile'); 
    const result = await collection.updateOne(filter, update);

    const filter1 = {name:id.toString()};
    const update1 = { $push: { following: postname } };
    const result1 = await collection.updateOne(filter1, update1);
    res.redirect('/home');
} 
catch (error) {
    console.error('Error occurred while inserting data:', error);
    res.status(500).send('Internal Server Error');
}
  }
});



  
/*   <link href='https://fonts.googleapis.com/css?family=Cedarville Cursive' rel='stylesheet'>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"> 
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/5.0.2/css/bootstrap.min.css">
*/
