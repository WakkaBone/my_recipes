import React, {useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom'
import {serverUrl} from "../../constants";
import OneRecipe from "../ViewRecipe/OneRecipe";

const FavoritesIndex = () => {
    const [favorites, setFavorites] = useState([])

    const getFavorites = async () => {
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/recipe/getFavorites`, {method: 'post', body: JSON.stringify({token}), headers: {'Content-Type': 'application/json'}})
            .then(response => response.json()).then(result => {
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Your token expired, you need to log in again')
                    localStorage.removeItem('recipe_token')
                    window.location.reload()
                }
                setFavorites(result.recipes)
            })
            .catch(err => {if(err) console.log(err)})
    }

    useEffect(() => {getFavorites()}, [])

    if(!localStorage.getItem('recipe_token')) return <Navigate to='/'/>
    else return (<div>
        <h1 style={{display: 'inline-block'}} className='onePagePagination'>My favorites</h1>
        {favorites.length ? <div className='onePageRecipesContainer'>{favorites.length && favorites.map(recipe => <OneRecipe getFavorites={getFavorites} recipe={recipe}/>)}</div> : <h3 className='onePagePagination'>You do not have any favorites</h3>}
    </div>)
}

export default FavoritesIndex;