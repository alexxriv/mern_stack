import express from "express";
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()

app.use(cors())
app.use(express.json()) //our app can read json in get request

app.use("/api/v1/restaurants", restaurants)
app.use("*", (req,res) => res.status(404).json({error: "not found"}))

export default app;