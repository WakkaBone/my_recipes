require('dotenv')
const jwt = require('jsonwebtoken')
const Pool = require('pg').Pool
const pool = new Pool({user: process.env.PG_USER, host: process.env.PG_HOST, database: process.env.PG_DATABASE, password: process.env.PG_PASSWORD, port: process.env.PG_PORT});
const cloudinary = require('cloudinary').v2;
cloudinary.config({cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET})

const newRecipe = async (req, res) => {
try {
    const {dishTitle, dishDescription, dishLevel, preparation, ingredients, steps, image, token, categories, portions} = req.body
    const id = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    const command = `insert into recipes(dish_name, dish_description, howhard, ingredients, steps, created, preparation_time, image, author_email, categories, portions) values
    ('${dishTitle}', '${dishDescription}', '${dishLevel}', '{${ingredients.map(ing => ''+ing)}}', '{${steps.map(step => ''+step)}}', to_timestamp(${new Date()/1000.0}), '${preparation}', '${image}', '${id.email}', '{${categories.map(category => ''+category)}}', ${portions})`
    await pool.query(command, (err) => err ? res.json({error: err}) : res.json({message: 'Recipe added'}))
} catch (e) {
    if(e) res.json({error: e})
}
}

const getRecipes = async (req, res) => {
    const command = `select * from recipes`
    await pool.query(command, (err, result) => err ? res.json({error: err}) : res.json({recipes: result.rows}))
}

const getAllRecipesWithPagination = async (req, res) => {
    const command = `select * from recipes`
    await pool.query(command, (err, result) => {
        if(err) res.json({error: err})
        else {
            const postsOnPage = 6
            const allRecipes = [...result.rows]
            const pages = Math.ceil(allRecipes.length/postsOnPage)
            let pagination = []
            for(let i = 0 ; i < pages ; i++){
                let temp = []
                for(let j = 0 ; j < postsOnPage ; j++){temp.push(allRecipes[j])}
                pagination.push(temp)
                allRecipes.splice(0, postsOnPage)
            }
            pagination = pagination.map(page => page.filter(recipe => recipe))
            res.json({pagination})
        }
    })
}

const getChefs = async (req, res) => {
    const command = `select * from users`
    await pool.query(command, (err, result) => err ? res.json({error: err}) : res.json({chefs: result.rows}))
}

const uploadImage = async (req, res) => {
    const img = req.files.image
    const DatauriParser = require('datauri/parser');
    const parser = new DatauriParser();
    const content = parser.format('.png', img.data)
    await cloudinary.uploader.upload(content.content, {resource_type: 'image'}).then(response => res.json({imageData: response, message: 'Image uploaded'})).catch(e => {if(e) console.log(e)})
}

const getMyRecipes = async (req, res) => {
    try {
        const {token} = req.body
        if(!token) {
            res.json({error: 'You have to log in'})
            return
        }
        const id = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const command = `select * from recipes where author_email = '${id.email}'`
        await pool.query(command, (err, result) => {err ? res.json({error: err}) : res.json({recipes: result.rows})})
    }
catch (e) {
    if(e) res.json({error: e})
}
}

const getOneRecipe = async (req, res) => {
    try {
        const {dishName} = req.body
        const command = `select * from recipes where dish_name = '${dishName}'`
        await pool.query(command, (err, result) => {return err ? res.json({error: err}) : res.json({recipe: result.rows})})
    } catch (e) {
        if(e) res.json({error: e})
    }
}

const checkFavorites = async (req, res) => {
    try {
        const {recipe, token} = req.body
        const id = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        await pool.query(`select * from recipes where dish_name = '${recipe}'`, async (err, result) => {
            if(err) {res.json({error: err})} else {
                let favorites = result.rows[0].favorites
                if(!favorites) favorites = []
                else favorites = [...favorites]
                if(favorites.includes(id.email)) {res.json({message: 'Already added'})
                } else res.json({message: 'Not added yet'})
            }
        })
    } catch (e) {if (e) res.json({error: e})}
}

const addToFavorites = async (req, res) => {
    try {
        const {recipe, token} = req.body
        const id = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        await pool.query(`select * from recipes where dish_name = '${recipe}'`, async (err, result) => {
            if(err) {res.json({error: err})} else {
                let favorites = result.rows[0].favorites
                if(!favorites) favorites = []
                else favorites = [...favorites]
                if(favorites.includes(id.email)) {
                    res.json({message: 'Already added'})
                    return
                } favorites.push(id.email)
                await pool.query(`update recipes set favorites = '{${favorites.map(fav => ''+fav)}}' where dish_name = '${recipe}'`, (err, result) => {
                    return err ? res.json({error: err}) : res.json({message: 'Added to favorites'})
                })
            }
        })
    } catch (e) {if (e) res.json({error: e})}
}

const deleteFromFavorites = async (req, res) => {
    try {
        const {token, recipe} = req.body
        const id = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const command = `select * from recipes where dish_name = '${recipe}'`
        await pool.query(command, async (err, result) => {
            if(err) res.json({error: err})
            else {
                const favorites = [...result.rows[0].favorites]
                favorites.splice(favorites.indexOf(id.email), 1)
                const command = `update recipes set favorites = '{${favorites.map(fav => ''+fav)}}' where dish_name = '${recipe}'`
                await pool.query(command, (err, result) => {
                    if(err) res.json({error: err})
                    else res.json({message: 'Deleted from favorites'})
                })
            }
        })
    } catch (e) {
        if(e) res.json({error: e})
    }
}

const getFavorites = async (req, res) => {
    try {
        const {token} = req.body
        const id = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const command = `select * from recipes where '${id.email}' = any(favorites)`
        await pool.query(command, (err, result) => {
            err ? res.json({error: err}) : res.json({recipes: result.rows})
        })
    } catch (e) {
        if(e) console.log(e)
    }
}

const checkRating = async (req, res) => {
    try {
        const {token, recipe} = req.body
        const id = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const command = `select * from recipes where dish_name = '${recipe}'`
        await pool.query(command, (err, result) => {
            if(err) res.json({error: err})
            else {
                const likes = result.rows[0].likes
                if(likes && likes.includes(id.email)) res.json({message: 'Already rated', rating: result.rows[0].rating})
                else res.json({message: 'Has not been rated yet'})
            }
        })
    } catch (e) {
        if(e) res.json({error: e})
    }
}

const rateRecipe = async (req, res) => {
    try {
        const {rate, token, recipe} = req.body
        const id = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        const command = `select * from recipes where dish_name = '${recipe}'`
        await pool.query(command, async (err, result) => {
            if(err) res.json({error: err})
            else {
                const likes = result.rows[0].likes
                if(likes && likes.includes(id.email)) {res.json({message: 'Already rated'})
                } else {
                    const command1 = `update recipes set likes = array_append(likes, '${id.email}') where dish_name = '${recipe}'`
                    const command2 = `update recipes set rating = (rating+${+rate})/array_length(likes, 1) where dish_name = '${recipe}'`
                    await pool.query(command1, async (err) => {
                        if(err) res.json({error: err})
                        else {
                            await pool.query(command2, (err) => {
                                if(err) res.json({error: err})
                                else res.json({message: 'Rating changed'})
                            })
                        }
                    })
                }
            }
        })
    } catch (e) {
        if(e) res.json({error: e})
    }
}

module.exports = {newRecipe, getRecipes, uploadImage, getMyRecipes, getChefs, getOneRecipe, addToFavorites, deleteFromFavorites, rateRecipe, checkRating, checkFavorites, getFavorites, getAllRecipesWithPagination}