import React, {Fragment} from 'react';
import {MdOutlineStarPurple500 as FilledStar} from 'react-icons/md'
import {MdOutlineStarOutline as EmptyStar} from 'react-icons/md'
import defaultImage from '../../img/food-svgrepo-com.svg'

const OneRandomRecipe = ({recipe}) => {
    const calculateRating = () => {
        if(!recipe.rating) return <Fragment><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 0) return <Fragment><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 1) return <Fragment><FilledStar/><EmptyStar/><EmptyStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 2) return <Fragment><FilledStar/><FilledStar/><EmptyStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 3) return <Fragment><FilledStar/><FilledStar/><FilledStar/><EmptyStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 4) return <Fragment><FilledStar/><FilledStar/><FilledStar/><FilledStar/><EmptyStar/></Fragment>
        if(Math.round(recipe.rating) === 5) return <Fragment><FilledStar/><FilledStar/><FilledStar/><FilledStar/><FilledStar/></Fragment>
    }

    return (
        <div className='mainOneRandomRecipeContainer'>
            <div
                className='mainOneRandomRecipeImageContainer'
                style={recipe.image !== 'null' ? {backgroundImage: `url('${recipe.image}')`, borderRadius: '50%', margin: '0'} : {backgroundImage: `url('${defaultImage}')`}}
                />
            <div className='mainOneRandomRecipeContentContainer'>
                <div><b><a href={`/recipes/${recipe.dish_name}`}>{recipe.dish_name}</a></b></div>
                <div>{recipe.howhard}</div>
                <div>{calculateRating()}</div>
                <div><button><a href={`/recipes/${recipe.dish_name}`}>View</a></button></div>
            </div>
        </div>
    );
};

export default OneRandomRecipe;