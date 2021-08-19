import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let restaurants //reference to database

export default class RestaurantsDAO{
    
    /*As soon as server starts we get reference to restaurant DB */
    static async injectDB(conn) {
        if(restaurants) {
            return
        }
        try{
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch(e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e} `,
            )
        }
    }

    /*We call this when we need to get all list of restaurants */
    static async getRestaurants({
        
        /*Made up options */
        filters = null,
        page= 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if(filters) {
            if("name" in filters) {
                query = {$text: { $search: filters["name"]}}
            } else if ("cuisine" in filters) {
                query = {"cuisine": {$eq: filters["cuisine"]}}
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": {$eq: filters["zipcode"]}}
            }
        }

        let cursor

        try {
            /*Find all restaurants with query past in */
            cursor = await restaurants
                .find(query)
        } catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return {restaurantsList:[], totalNumRestaurants: 0}
        }

        /* limit restaurants per page, and display page number */
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)
    
        try{
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants =  await restaurants.countDocuments(query)
        
            return { restaurantsList, totalNumRestaurants}
        } catch(e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { restaurantsList: [], totalNumRestaurants: 0}
        }
    }

    static async getRestaurantsById(id) {
        try{
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                    {
                        $lookup: {
                            from: "reviews",
                            let: {
                                id: "$_id",
                            },
                            pipeline: [
                                {
                                    $match:{
                                        $expr: {
                                            $eq: ["$restaurant_id", "$$id"],
                                        },
                                    },
                                },
                                {
                                    $sort: {
                                        date: -1,
                                    },
                                },
                            ],
                            as: "reviews"
                        },
                    },
                    {
                        $addFields: {
                            reviews: "$reviews",
                        },
                    },
            ]

          return await restaurants.aggregate(pipeline).next()
        } catch(e) {
            console.error(`Something went wrong in getRestaurantByID: ${e}`)
            throw e
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
}