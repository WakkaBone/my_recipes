import React, {Fragment} from 'react';
import defaultImage from '../../img/food-svgrepo-com.svg'
import {GiCook} from "react-icons/gi";
import {IoIosTimer} from "react-icons/io";
import {FiDelete} from 'react-icons/fi'
import {FaEdit} from 'react-icons/fa'
import {MdOutlineStarOutline as EmptyStar, MdOutlineStarPurple500 as FilledStar} from "react-icons/md";
import {serverUrl} from "../../constants";

const OneRecipe = ({recipe, getFavorites, setIsEdit, setEditedRecipe}) => {
    const calculateRating = () => {
        if(!recipe.rating) return <Fragment><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 0) return <Fragment><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 1) return <Fragment><FilledStar/><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 2) return <Fragment><FilledStar/><FilledStar/><EmptyStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 3) return <Fragment><FilledStar/><FilledStar/><FilledStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 4) return <Fragment><FilledStar/><FilledStar/><FilledStar/><FilledStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 5) return <Fragment><FilledStar/><FilledStar/><FilledStar/><FilledStar/><FilledStar/></Fragment>
    }
    const trimTime = (time) => time.split('')[0] == 0 ? time.split('')[1] : time

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
                    window.location.reload()
                }
                getFavorites()
            })
            .catch(err => {
                if (err) console.log(err)
            })
    }

    return (
        <div className='viewAllRecipesOneBlockContainer'>
            <div className='viewAllRecipesOneBlockContent'>
                <div className='viewAllRecipesOneBlockTitle'><b><a href={`/recipes/${recipe.dish_name}`}>
                    {recipe.dish_name}</a> {
                    window.location.href.split('/')[window.location.href.split('/').length-1] === 'favorites' ?
                    <FiDelete className='deleteArrow' onClick={deleteFromFavoritesHandler}/> :
                    window.location.href.split('/')[window.location.href.split('/').length-1] === 'myRecipes' ?
                    <FaEdit className='deleteArrow' onClick={() => {
                        setIsEdit(true)
                        setEditedRecipe(recipe.dish_name)
                    }}/> :
                    ''
                }
                </b></div>
                <div><i>Level:</i> {recipe.howhard}</div>
                <div><i>Rating:</i> {calculateRating()}</div>
                <div><IoIosTimer/> <i>Preparation:</i> ~ {recipe.preparation_time.split(':')[0] !== '00' && trimTime(recipe.preparation_time.split(':')[0]) + ' hour(s)'} {recipe.preparation_time.split(':')[1] !== '00' && trimTime(recipe.preparation_time.split(':')[1]) + ' minutes'}</div>
                <div><GiCook/> <i>Author:</i> {recipe.author_email}</div>
            </div>
            <div className='viewAllRecipesOneBlockImage' style={{backgroundImage: `url(${recipe.image === 'null' ? defaultImage : recipe.image})`}}/>
        </div>
    );
};

export default OneRecipe;