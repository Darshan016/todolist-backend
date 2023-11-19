const express = require('express');
const app=express()
const port=3000
const mongoose=require('mongoose')
app.set('view engine','ejs')
app.use(express.json())
mongoose.connect('mongodb://localhost/todo-list',{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection

db.on('error',console.error.bind(console,'mongodb server connection'))
db.once('open',function (){
    console.log('connected to db')
})
 
const taskSchema=new mongoose.Schema({
    description : String,
})

const Task=mongoose.model('Task',taskSchema)

app.get('/', async(req,res)=>{
    try{
        const tasks=await Task.find()
        res.render('index',{tasks})
    } catch (err){
        console.error(err)
        res.status(500).send('internal server error')
    }
})

app.post('/add', async(req,res)=>{
    const description=req.body.task
    try{
        await Task.create({description})
        res.redirect('/')
    } catch(err){
        console.error(err)
        res.status(500).send('internal server error')
    }
})

app.listen(port,()=>{
    console.log(`server is listening on ${port}`)
})