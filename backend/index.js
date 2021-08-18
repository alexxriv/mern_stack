import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

dotenv.config()

const MongoClient = mongodb.MongoClient


const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
        {
            maxPoolSize: 50,
            wtimeoutMS: 2500,
            useNewUrlParser: true
        }
    )
    . catch(err => {
        console.log(err.stack)
        process.exit(1)
    })
    .then(async client => {

        /*Get initial reference to restaurants colletiom */
        await RestaurantsDAO.injectDB(client)

        /*Get reference to reviews sollection */
        await ReviewsDAO.injectDB(client)

        app.listen(port, () =>{
            console.log(`listening on port ${port}`)
        })
    }) 