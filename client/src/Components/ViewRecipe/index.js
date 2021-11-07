import React, {useEffect, useState} from 'react';
import OneRandomRecipe from "../Main/OneRandomRecipe";
import {serverUrl} from "../../constants";

const ViewRecipeIndex = () => {
const [recipes, setRecipes] = useState([])
const [activePage, setActivePage] = useState(0)

    const getRecipes = async () => {
        await fetch(`${serverUrl}/recipe/getRecipesWithPagination`, {method: 'get'})
            .then(response => response.json()).then(result => setRecipes(result.pagination))
            .catch(e => {if(e) console.log(e)})
    }

    useEffect(() => {getRecipes()}, [])

    const addPagination = () => {
        let res = []
        for (let i = 1; i <= recipes.length; i++) {res.push(i)}
        return res
    }
//TODO ADD DESIGN
    return (
        <div>
            <h1>View recipes</h1>
            <div className='onePageRecipesContainer'>{!recipes.length ? 'Loading...' : recipes.length && recipes[activePage].map(recipe => <OneRandomRecipe recipe={recipe}/>)}</div>
            <div className='pagination'>{!recipes.length ? 'Loading...' : addPagination().map((number, index) => <div key={index}><span className='paginationSpan' onClick={() => {setActivePage(index)}}>{number}</span></div>)}</div>
        </div>
    );
};

export default ViewRecipeIndex;