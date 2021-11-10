import React, {useEffect, useState} from 'react';
import {serverUrl} from "../../constants";
import {FiLoader} from 'react-icons/fi'

const Filters = ({recipes, setIsFiltered, isFiltered, setFilteredRecipes, setRecipes, filteredRecipes}) => {
    const [allRecipesArr, setAllRecipesArr] = useState([])
    const [categories, setCategories] = useState([])
    const [level, setLevel] = useState([])
    const [rating, setRating] = useState([])
    const [categoriesRequest,setCategoriesRequest] = useState('')
    const [levelRequest,setLevelRequest] = useState('')
    const [ratingRequest,setRatingRequest] = useState(0)
    const [nameRequest, setNameRequest] = useState('')
    const [mostFavoritedModeOn, setMostFavoritedModeOn] = useState(false)

    useEffect(() => {
        if(!isFiltered) {
            const allRecipes = []
            recipes.forEach(page => page.forEach(recipe => allRecipes.push(recipe)))
            setAllRecipesArr(allRecipes)
            let categories = []
            allRecipes.forEach(recipe => recipe.categories.forEach(category => categories.push(category)))
            let levels = allRecipes.map(recipe => recipe.howhard)
            let ratings = allRecipes.map(recipe => recipe.rating)
            const categoriesSet = new Set(categories)
            const levelsSet = new Set(levels)
            const ratingsSet = new Set(ratings)
            categories = Array.from(categoriesSet)
            levels = Array.from(levelsSet)
            ratings = Array.from(ratingsSet)
            ratings.sort()
            setCategories(categories)
            setLevel(levels)
            setRating(ratings)
        }
    }, [recipes])

    const calculateRating = (rating) => {
        if(!rating) return '☆☆☆☆☆'
        if(Math.round(rating) === 0) return '☆☆☆☆☆'
        if(Math.round(rating) === 1) return '★☆☆☆☆'
        if(Math.round(rating) === 2) return '★★☆☆☆'
        if(Math.round(rating) === 3) return '★★★☆☆'
        if(Math.round(rating) === 4) return '★★★★☆'
        if(Math.round(rating) === 5) return '★★★★★'
    }

    const resetHandler = () => {
        setNameRequest('')
        setLevelRequest('')
        setCategoriesRequest('')
        setRatingRequest(0)
        const defaults = document.getElementsByTagName('option')
        for(let option of defaults){if(!option.value) option.selected = true}
    }

    const mostFavoredHandler = () => {
        if(!isFiltered) {
            const mostFavoredFirstArr = allRecipesArr.map(recipe => {
                if (!recipe.favorites) {
                    recipe.favorites = []
                    return recipe
                } else return recipe
            }).sort((a, b) => b.favorites.length - a.favorites.length)
            const numberOfItemsPerPage = 6
            const paginatedArr = []
            const numberOfIterations = Math.ceil(mostFavoredFirstArr.length / numberOfItemsPerPage)
            for (let i = 0; i < numberOfIterations; i++) {
                let temp = []
                for (let k = 0; k < numberOfItemsPerPage; k++) {
                    if (mostFavoredFirstArr[k]) temp.push(mostFavoredFirstArr[k])
                }
                paginatedArr.push(temp)
                mostFavoredFirstArr.splice(0, numberOfItemsPerPage)
            }
            setRecipes(paginatedArr)
            setMostFavoritedModeOn(true)
        } else {
            const mostFavoredFirstArr = filteredRecipes.map(recipe => {
                if (!recipe.favorites) {
                    recipe.favorites = []
                    return recipe
                } else return recipe
            }).sort((a, b) => b.favorites.length - a.favorites.length)
            setFilteredRecipes(mostFavoredFirstArr)
            setMostFavoritedModeOn(true)
        }
    }

    const regularOrderHandler = async () => {
        if (!isFiltered) {
            await fetch(`${serverUrl}/recipe/getRecipesWithPagination`, {method: 'get'})
                .then(response => response.json()).then(result => {
                    setRecipes(result.pagination)
                    setMostFavoritedModeOn(false)
                })
                .catch(e => {
                    if (e) console.log(e)
                })
        } else {
            const regularOrder = filteredRecipes.sort((a, b) => new Date(b.created) - new Date(a.created))
            setFilteredRecipes([...regularOrder])
            setMostFavoritedModeOn(false)
        }
    }

    const searchHandler = async () => {
        if(!nameRequest && !levelRequest && !ratingRequest && !categoriesRequest) {
            resetHandler()
            setIsFiltered(false)
            return
        }
        let filteredRecipes = allRecipesArr
        if(nameRequest) filteredRecipes = filteredRecipes.filter(recipe => recipe.dish_name.toLowerCase().trim() === nameRequest.toLowerCase().trim())
        if(levelRequest) filteredRecipes = filteredRecipes.filter(recipe => recipe.howhard === levelRequest)
        if(ratingRequest) filteredRecipes = filteredRecipes.filter(recipe => recipe.rating === +ratingRequest)
        if(categoriesRequest) filteredRecipes = filteredRecipes.filter(recipe => recipe.categories.includes(categoriesRequest))
        setIsFiltered(true)
        setFilteredRecipes(filteredRecipes)
    }

    return (
        <div className='viewAllRecipesFiltersContainer'>
            <div><label><b>Search: </b><input value={nameRequest} onChange={(e) => setNameRequest(e.target.value)} type='text' placeholder='search'/></label></div>
            <div><label><b>Level: </b><select onChange={(e) => setLevelRequest(e.target.value)}>
                <option value=''>Any</option>
                {!level.length ? <FiLoader/> : level.map((level, index) => <option key={index} value={level}>{level}</option>)}
            </select></label></div>
            <div><label><b>Categories:</b> <select onChange={(e) => setCategoriesRequest(e.target.value)}>
                <option value=''>Any</option>
                {!categories.length ? <FiLoader/> : categories.map((category, index) => <option key={index} value={category}>{category}</option>)}
            </select></label></div>
            <div><label><b>Rating:</b> <select onChange={(e) => setRatingRequest(e.target.value)}>
                <option value=''>Any</option>
                {!rating.length ? <FiLoader/> : rating.map((rating, index) => <option key={index} value={rating}>{calculateRating(rating)}</option>)}
            </select></label></div>
            <div><label><p/><button onClick={searchHandler}>Search</button></label></div>
            <div><label><p/><button onClick={resetHandler}>Reset filters</button></label></div>
            <div><label><p/><button onClick={() => {
                resetHandler()
                setIsFiltered(false)
            }}>Back to all recipes</button></label></div>
            <div><label><p/>
                {!mostFavoritedModeOn ? <button onClick={mostFavoredHandler}>Most favorited first</button> : <button onClick={regularOrderHandler}>Regular order</button>}
            </label></div>
        </div>
    );
};

export default Filters;