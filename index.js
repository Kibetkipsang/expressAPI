import { PrismaClient } from '@prisma/client';
import express from 'express';

const client = new PrismaClient();
const app = express();
app.use(express.json);

// get all users 

app.get("/users", async (request, response) => {
    try {
        const users = await client.user.findMany()
        if (users.length === 0){
            return res.status(404).json({
                message: "No users found"
            })
        }
        response.status(200).json(users);
    }catch(err){
        console.log(err)
        response.status(500).json({message: "Something went wrong"})
    }
})


app.get("/users/:id", async (req, res) => {
    try{
        const {id} = req.params
        const user = await client.user.findUnique({
            where: {
                id: id
            }
        });
        if(!user){
            res.status(500).json({
                message: "user not found"
            })
        }

        console.log(user)
        res.status(200).json(user)
    }catch(err){}
})

app.post("/users", async (req, res) => {
    try {
        const {firstName, lastName, email} = req.body;
        if(!firstName || !lastName || !email){
            return res.status(400).json({
                message: "All fields are required!"
            })
        }
        const user = await client.user.create({
            data: {
                firstName,
                lastName,
                email
            }
        }) 
        console.log(user);
        console.log(req.body)
        res.status(201).json({message: "Users created successfully", user})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Something went wrong"})
    }
})

app.patch("/users/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const {firstName, lastName, email} = req.body;
        
        const user =client.user.findunique({
            where: {id: id}
        })
        if (!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const newUser = await client.user.update({
            where: {id:id},
            data:{
                firstName,
                lastName,
                email
            }
        })
        console.log(newUser);
        res.status(200).json({message: `user updated successfully (${id})`, newUser})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Something went wrong"})
    }
})

app.delete("/users/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const deletedUser = await client.user.delete({
            where: {id: id}
        });
        if (!deletedUser){
            return res.status(404).json({
                message: "User not found"
            })
        }
        console.log(deletedUser)
        res.status(200).json({message: `User deleted successfully (${id})`, id})
    }catch(err){
        res.status(500).json({message: "Something went wrong"})
    }
})

const port = 5000;
app.listen(port, ()=>{
    console.log(`server is running on port ${port}...`)
})