import React, {useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom'
import {serverUrl} from "../../constants";

const FavoritesIndex = () => {
    const [favorites, setFavorites] = useState([])

    const getFavorites = async () => {
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/recipe/getFavorites`, {method: 'post', body: JSON.stringify({token}), headers: {'Content-Type': 'application/json'}})
            .then(response => response.json()).then(result => {
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Your token expired, you need to log in again')
                    localStorage.removeItem('recipe_token')
                }
                setFavorites(result.recipes)
            })
            .catch(err => {if(err) console.log(err)})
    }

    useEffect(() => {getFavorites()}, [])

    //TODO DESIGN

    if(!localStorage.getItem('recipe_token')) return <Navigate to='/'/>
    else return (<div>
        <h1>My favorites</h1>
        {favorites.length && favorites.map(recipe => <p>{recipe.dish_name}</p>)}
    </div>)
}

export default FavoritesIndex;