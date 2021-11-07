import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import {serverUrl} from "../../constants";

const MyRecipesIndex = () => {
    const [myRecipes, setMyRecipes] = useState([])
    const getMyRecipes = async () => {
        await fetch(`${serverUrl}/recipe/getMyRecipes`, {method: 'post', body: JSON.stringify({token: localStorage.getItem('recipe_token')}), headers: {'Content-Type': 'application/json'}})
            .then(response => response.json()).then(result => {
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Token expired, log in again')
                    localStorage.removeItem('recipe_token')
                    window.location.reload()
                } else setMyRecipes(result.recipes)
            })
            .catch(err => {if(err) console.log(err)})
    }

    useEffect(()=> {getMyRecipes()}, [])
    //TODO EDIT RECIPES
    //TODO DESIGN

    if(!localStorage.getItem('recipe_token')) return <Navigate to='/'/>
    else return (<div>
        <h1>My recipes</h1>
        {myRecipes.length ? myRecipes.map(recipe => <p>{recipe.dish_name}</p>) : <span>You haven't added any recipes yet</span>}
    </div>);
};

export default MyRecipesIndex;