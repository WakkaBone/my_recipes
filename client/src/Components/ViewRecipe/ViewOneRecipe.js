import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {IoIosTimer} from 'react-icons/io'
import {MdOutlineFoodBank} from 'react-icons/md'
import {GiCook} from 'react-icons/gi'
import {FcLikePlaceholder as NotLiked, FcLike as Liked} from 'react-icons/fc'
import {MdOutlineStarPurple500 as FilledStar} from 'react-icons/md'
import {MdOutlineStarOutline as EmptyStar} from 'react-icons/md'
import defaultImage from '../../img/food-svgrepo-com.svg'
import {serverUrl} from "../../constants";

const ViewOneRecipe = () => {
    const params = useParams()
    const [recipe, setRecipe] = useState({})
    const [height, setHeight] = useState('')
    const [isInFavorites, setIsInFavorites] = useState(false)
    const [canRate, setCanRate] = useState(true)
    const contentBlock = useRef()
    const rating = [EmptyStar, EmptyStar, EmptyStar, EmptyStar, EmptyStar]

    const checkRating = async () => {
        const token = localStorage.getItem('recipe_token')
        await fetch('http://localhost:4000/recipe/checkRating', {method: 'post', body: JSON.stringify({token, recipe: params.dish}), headers: {'Content-Type': 'application/json'}})
            .then(response => response.json()).then(result => {
                console.log(result)
                if(result.message === 'Already rated') {setCanRate(false)}
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Your token expired, you need to log in again')
                    localStorage.removeItem('recipe_token')
                } else {
                    const rating = result.rating
                    const stars = document.getElementsByClassName('ratingStar')
                    for(let i = 0 ; i < rating ; i++){stars[i].style.color = 'gold'}}
            })
            .catch(e => {if(e) console.log(e)})
    }

    const rateRecipeHandler = async (index) => {
        const rate = index + 1
        const token = localStorage.getItem('recipe_token')
        await fetch('http://localhost:4000/recipe/rateRecipe', {
            method: 'put',
            body: JSON.stringify({rate, token, recipe: recipe.dish_name}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                if(result.message === 'Rating changed') setCanRate(false)
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Your token expired, you need to log in again')
                    localStorage.removeItem('recipe_token')
                }
            })
            .catch(err => {
                if (err) console.log(err)
            })
    }

    const getRecipe = async () => {
        await fetch(`${serverUrl}/recipe/getOneRecipe`, {
            method: 'post',
            body: JSON.stringify({dishName: params.dish}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                if (!result.recipe[0]) {
                    alert('This dish was not found in our database')
                    window.location.href = '/'
                    return
                }
                setRecipe(result.recipe[0])
                setHeight(contentBlock.current.clientHeight - 100)
            })
            .catch(err => {
                if (err) console.log(err)
            })
    }

    const checkFavorites = async () => {
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/recipe/checkFavorites`, {
            method: 'post',
            body: JSON.stringify({token, recipe: params.dish}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Your token expired, you need to log in again')
                    localStorage.removeItem('recipe_token')
                }
                if (result.message === 'Already added') setIsInFavorites(true)
                else setIsInFavorites(false)
            })
            .catch(err => {
                if (err) console.log(err)
            })
    }

    const addToFavoritesHandler = async () => {
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/recipe/addToFavorites`, {
            method: 'post',
            body: JSON.stringify({token, recipe: recipe.dish_name}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Your token expired, you need to log in again')
                    localStorage.removeItem('recipe_token')
                }
                if (result.message === 'Added to favorites') {
                    setIsInFavorites(true)
                    getRecipe()
                }
            })
            .catch(err => {
                if (err) console.log(err)
            })
    }

    const deleteFromFavoritesHandler = async () => {
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/recipe/deleteFromFavorites`, {
            method: 'delete',
            body: JSON.stringify({token, recipe: recipe.dish_name}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Your token expired, you need to log in again')
                    localStorage.removeItem('recipe_token')
                }
                if (result.message === 'Deleted from favorites') {
                    setIsInFavorites(false)
                    getRecipe()
                }
            })
            .catch(err => {
                if (err) console.log(err)
            })
    }

    useEffect(() => {
        getRecipe()
        checkFavorites()
        checkRating()
    }, [])

    const trimTime = (time) => time.split('')[0] == 0 ? time.split('')[1] : time

    return (!recipe.dish_name ? 'Loading...' :
            <div className='viewOneRecipeContainer'>
                <div ref={contentBlock} className='viewOneRecipeContentContainer'>
                    <div><h1>{recipe.dish_name}</h1></div>
                    <div><span><i>{recipe.dish_description}</i></span></div>
                    <div className='viewOneRecipeLevelAndTime'>
                        <div>Level: {recipe.howhard}</div>
                        <div><IoIosTimer/> Preparation:
                            ~ {recipe.preparation_time.split(':')[0] !== '00' && trimTime(recipe.preparation_time.split(':')[0]) + ' hour(s)'} {recipe.preparation_time.split(':')[1] !== '00' && trimTime(recipe.preparation_time.split(':')[1]) + ' minutes'}
                        </div>
                        <div><MdOutlineFoodBank/> Portions: {recipe.portions}</div>
                        <div><GiCook/> Author: {recipe.author_email}</div>
                    </div>
                    <div className='viewOneRecipeIngredientsAndCategoriesContainer'>
                        <div className='viewOneRecipeCategories'><b>Categories:</b>
                            <ul>{recipe.categories.map((category, index) => <li key={index}>{category}</li>)}</ul>
                        </div>
                        <div className='viewOneRecipeIngredients'><b>Ingredients:</b>
                            <ul>{recipe.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}</ul>
                        </div>
                    </div>
                    <div className='viewOneRecipeSteps'><h3>Steps:</h3>
                        <ul>{recipe.steps.map((step, index) => <li key={index}><b>Step {index + 1}</b>: <p>{step}</p>
                        </li>)}</ul>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {localStorage.getItem('recipe_token') && rating.map((star, index) => <Fragment
                            key={index}><EmptyStar className='ratingStar'
                            style={{fontSize: '2em'}}
                                                   onMouseOver={(e) => {
                                                       if (canRate) {
                                                           const stars = document.getElementsByClassName('ratingStar')
                                                           for (let i = 0; i <= index; i++) {
                                                               stars[i].style.color = 'gold'
                                                           }
                                                       }
                                                   }
                                                   }
                                                    onMouseLeave={(e) => {
                                                        if(canRate){
                                                            const stars = document.getElementsByClassName('ratingStar')
                                                            for(let i = 0 ; i < index+1 ; i++){stars[i].style.color = 'black'}
                                                        }
                                                    }}
                            onClick={() => canRate && rateRecipeHandler(index)}
                        /></Fragment>)}
                        <span style={{
                            fontSize: '1.5em',
                            marginLeft: '2%'
                        }}>{recipe.favorites ? recipe.favorites.length + ' chef(s) added to favorites' : 'No one added to favorites yet'} </span>

                        {localStorage.getItem('recipe_token') &&
                        isInFavorites ? <Liked
                                onMouseOver={(e) => {e.target.style.cursor = 'pointer'}}
                                onClick={deleteFromFavoritesHandler}
                                style={{fontSize: '2em', marginLeft: '2%', marginRight: '2%'}}/> :
                            <NotLiked
                                onMouseOver={(e) => {e.target.style.cursor = 'pointer'}}
                                onClick={addToFavoritesHandler}
                                style={{fontSize: '2em', marginLeft: '2%', marginRight: '2%'}}/>}
                        <button>Download recipe in PDF</button>
                    </div>
                </div>

                <div className='viewOneRecipeImageContainer' style={{
                    backgroundImage: `url(${recipe.image === 'null' ? defaultImage : recipe.image})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    margin: '2%',
                    border: '1px solid black',
                    maxHeight: height + 'px'
                }}/>

            </div>
    );
};

export default ViewOneRecipe;