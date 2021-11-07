import React, {useEffect, useState} from 'react';
import OneRandomRecipe from "./OneRandomRecipe";
import {serverUrl} from "../../constants";

const MainPage = () => {
const [recipes, setRecipes] = useState([])
const [chefs, setChefs] = useState([])

    useEffect(() => {
        getRecipes()
        getChefs()
    }, [])

    const getRecipes = async () => {
        await fetch(`${serverUrl}/recipe/getRecipes`, {method: 'get'})
            .then(response => response.json()).then(result => setRecipes(result.recipes))
            .catch(err => {if(err) console.log(err)})
    }

    const getChefs = async () => {
        await fetch(`${serverUrl}/recipe/getChefs`, {method: 'get'})
            .then(response => response.json()).then(result => setChefs(result.chefs))
            .catch(err => {if(err) console.log(err)})
    }

    return (
        <main>
            <div className='mainImageContainer'/>
            <div className='mainContentContainer'>
                <div className='mainSlogan'><h2>Feel like cooking something delicious today?</h2></div>
                <div className='mainButtons'>
                    <div><button><a href='/allRecipes'>View all recipes</a></button></div>
                    {localStorage.getItem('recipe_token') && <div><button><a href='/addRecipe'>Create a recipe</a></button></div>}
                </div>
                <div className='mainRandomRecipes'>
                    {recipes.length ? recipes.sort(() => .5 - Math.random()).map((recipe, index) => {
                        if(index < 3) return <OneRandomRecipe key={index} recipe={recipe}/>
                    }) : 'Loading...'}
                </div>
                <div className='mainStatistics'>
                    <span><b>Total chefs registered</b>: {chefs.length ? chefs.length : 'Loading...'}</span>
                    <span><b>Total recipes submitted:</b> {recipes.length ? recipes.length : 'Loading...'}</span>
                </div>
            </div>
        </main>
    );
};

export default MainPage;