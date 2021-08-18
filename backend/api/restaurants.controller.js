import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next) {

        /*Default page and results per page is 20 and 0 */
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20 
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        /*Crate empty filter, if query is passed then load it in filter*/
        let filters = {}
        if(req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants} = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        })
    
        let response ={
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }
        res.json(response)
    }

    static async apiGetRestaurantsById(req,res, next) {
        try {
            let id = req.params.id || {}
            let restaurant = await RestaurantsDAO.getRestaurantsById(id)
            if(!restaurant) {
                res.RestaurantsController(404).json({ error: "not found"})
                return
            }
            res.json(restaurant)
        } catch (e) {
            console.log(`api, ${e}`)
            res.RestaurantsController(500).json({ error: e})
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines()
            res.json(cuisines)
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e})
        }
    }
}