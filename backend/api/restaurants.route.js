import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"


const router = express.Router()

/* Return method apiGetRestaurants from RestuanrantsCtrl file*/
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)

/* Get list of reviews for specific restaurant and list of cuisines (for user to select cuisine from dropdown*/
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantsById)
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines)

/* Different requests  */
router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router