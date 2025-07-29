import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import {clerkWebHooks} from './controllers/webHooks.js'

//initialize Express

const app = express();

// Connect to DB

await connectDB();

//middleware
app.use(cors());
app.use(express.json());


//Routes
app.get('/', (req, res) => {
    res.send('API working')
})
app.post('/clerk' , express.json(), clerkWebHooks) 




//PORT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

