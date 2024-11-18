// Importing libraries
const express  = require('express');
const mongoose =  require('mongoose');
const app =  express();
const cors  = require('cors');
require ('dotenv').config()
const port = process.env.PORT  || 5000;

// parse options
app.use(express.json());
app.use(cors({
    origin: ['https://school-web-test-front.onrender.com', 'http://localhost:5000'],
    credentials: true, 
}));

// Routes
const postRoutes = require("./src/routes/post.route");
const announcementRoutes = require("./src/routes/announcements.route")
const commentRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route");
const casroute = require("./src/routes/caspost.route")
const casresponseroute = require("./src/routes/casResponse.route")
app.use("/api/posts", postRoutes); 
app.use("/api/announcements", announcementRoutes); 
app.use("/api/comments", commentRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/cas",casroute);
app.use("/api/response", casresponseroute);

async function main(){
    await mongoose.connect('mongodb+srv://blizdia69:mNThT8mc0gQDKalj@web-cluster.46qri.mongodb.net/?retryWrites=true&w=majority&appName=web-cluster'); //TOCHANGE MONGODB LINK
}

main().then(() => console.log("MongoDb Connected Successfully.")).catch(err => console.log(err)); 


app.get('/', (req, res) => {
    res.send('Hello Worldd!');
});

app.listen (port, () => {
    console.log(`Server is running on port ${port}`)
});


// user : blizdia69
// pass : mNThT8mc0gQDKalj
