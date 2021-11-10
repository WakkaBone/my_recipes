import React, {Fragment, useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import {serverUrl} from "../../constants";
import OneRecipe from "../ViewRecipe/OneRecipe";
import EditRecipe from "./EditRecipe";

const MyRecipesIndex = () => {
    const [myRecipes, setMyRecipes] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [editedRecipe, setEditedRecipe] = useState('')

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

    if(!localStorage.getItem('recipe_token')) return <Navigate to='/'/>
    else return (<div>
        {isEdit ? <EditRecipe setIsEdit={setIsEdit} editedRecipe={editedRecipe}/> :

            <Fragment>
                <h1 style={{display: 'inline-block'}} className='onePagePagination'>My recipes</h1>
                {myRecipes.length ?
                    <div className='onePageRecipesContainer'>{myRecipes.length && myRecipes.map(recipe =>
                        <OneRecipe setIsEdit={setIsEdit} setEditedRecipe={setEditedRecipe}
                                   recipe={recipe}/>)}</div> : <h3 className='onePagePagination'>You haven't added any recipes yet</h3>}
            </Fragment>
        }
    </div>);
};

export default MyRecipesIndex;