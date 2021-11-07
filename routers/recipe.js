const {Router} = require('express')
const recipeController = require('../controllers/recipe')
const bodyParser = require('body-parser')
const fileUploader = require('express-fileupload')

const recipeRouter = Router()

recipeRouter.use(bodyParser.json())
recipeRouter.use(bodyParser.urlencoded({extended: true}))
recipeRouter.use(fileUploader())

recipeRouter.post('/newRecipe', recipeController.newRecipe)
recipeRouter.post('/uploadImage', recipeController.uploadImage)
recipeRouter.get('/getRecipes', recipeController.getRecipes)
recipeRouter.get('/getRecipesWithPagination', recipeController.getAllRecipesWithPagination)
recipeRouter.post('/getOneRecipe', recipeController.getOneRecipe)
recipeRouter.post('/getMyRecipes', recipeController.getMyRecipes)
recipeRouter.get('/getChefs', recipeController.getChefs)
recipeRouter.post('/getFavorites', recipeController.getFavorites)
recipeRouter.post('/addToFavorites', recipeController.addToFavorites)
recipeRouter.delete('/deleteFromFavorites', recipeController.deleteFromFavorites)
recipeRouter.post('/checkFavorites', recipeController.checkFavorites)
recipeRouter.put('/rateRecipe', recipeController.rateRecipe)
recipeRouter.post('/checkRating', recipeController.checkRating)

module.exports = recipeRouter