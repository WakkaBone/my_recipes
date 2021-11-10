import React, {useEffect, useState, Fragment} from 'react';
import {serverUrl} from "../../constants";
import OneRecipe from "./OneRecipe";
import Filters from "./Filters";
import {FiLoader} from 'react-icons/fi'

const ViewRecipeIndex = () => {
const [recipes, setRecipes] = useState([])
const [activePage, setActivePage] = useState(0)
const [isFiltered, setIsFiltered] = useState(false)
const [filteredRecipes, setFilteredRecipes] = useState([])

    const getRecipes = async () => {
        await fetch(`${serverUrl}/recipe/getRecipesWithPagination`, {method: 'get'})
            .then(response => response.json()).then(result => {setRecipes(result.pagination)})
            .catch(e => {if(e) console.log(e)})
    }

    useEffect(() => {getRecipes()}, [])

    const addPagination = () => {
        let res = []
        for (let i = 1; i <= recipes.length; i++) {res.push(i)}
        return res
    }

    return (
        <div>
            <h1 style={{display: 'inline-block'}} className='onePagePagination'>View all recipes</h1>
            <Filters recipes={recipes} setRecipes={setRecipes} setIsFiltered={setIsFiltered} isFiltered={isFiltered} filteredRecipes={filteredRecipes} setFilteredRecipes={setFilteredRecipes}/>
            {!isFiltered &&
            <Fragment>
            <div className='onePageRecipesContainer'>{!recipes.length ? <FiLoader/> : recipes.length && recipes[activePage].map((recipe, index) => <OneRecipe key={index} recipe={recipe}/>)}</div>
            <div className='pagination'>{!recipes.length ? <FiLoader/> : addPagination().map((number, index) => <div className='onePagePagination' key={index}><span className='paginationSpan' onClick={() => {setActivePage(index)}}>{number}</span></div>)}</div>
            </Fragment>
            }
            {isFiltered && <div className='onePageRecipesContainer'>{!filteredRecipes.length ? <h3 style={{color: 'red'}} className='onePagePagination'>Nothing was found</h3> : filteredRecipes.length && filteredRecipes.map((recipe, index) => <OneRecipe key={index} recipe={recipe}/>)}</div>}
        </div>
    );
};

export default ViewRecipeIndex;