import React, {useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom'
import Inputs from "./Inputs";
import Image from "./Image";
import {inputValidation, serverUrl} from "../../constants";

const AddRecipeIndex = () => {
    const [dishTitle, setDishTitle] = useState('')
    const [dishDescription, setDishDescription] = useState('')
    const [dishLevel, setDishLevel] = useState('Easy')
    const [categories, setCategories] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [preparation, setPreparation] = useState('')
    const [steps, setSteps] = useState([''])
    const [image, setImage] = useState(null)
    const [portions, setPortions] = useState(1)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {window.addEventListener('beforeunload', function (e) {e.returnValue = 'Are you sure you want to leave?'})}, [])

    const setRecipeHandler = async () => {
        const validation = inputValidation(dishTitle, dishDescription, categories, ingredients, steps, preparation, portions)
        if(validation) {
            setErrorMessage(validation)
            return
        }
        await fetch(`${serverUrl}/recipe/newRecipe`, {
            method: 'post', body: JSON.stringify({
                dishTitle: dishTitle.trim(),
                dishDescription: dishDescription.trim(),
                dishLevel,
                preparation: preparation + ':00',
                ingredients: ingredients.map(ing => ing.trim()).filter(ing => ing),
                steps: steps.map(step => step.trim()).filter(step => step),
                image,
                categories,
                portions,
                token: localStorage.getItem('recipe_token')
            }), headers: {'Content-Type': 'application/json'}
        }).then(response => response.json()).then(result => {
            if(result.error && result.error.name !== 'TokenExpiredError') {
                alert('Dish with this name already exists, please choose another name')
                return
            }
            if(result.error && result.error.name === 'TokenExpiredError') {
                alert('Token expired, log in again')
                localStorage.removeItem('recipe_token')
                window.location.reload()
            } else {
                alert('Recipe added')
                window.location.href = '/'
            }
        })
    }

    if(!localStorage.getItem('recipe_token')) return <Navigate to='/'/>
    else return (
        <div className='newRecipeMainContainer'>
        <Inputs setRecipeHandler={setRecipeHandler} dishTitle={dishTitle} setDishTitle={setDishTitle} dishDescription={dishDescription} setDishDescription={setDishDescription} dishLevel={dishLevel} setDishLevel={setDishLevel} ingredients={ingredients} setIngredients={setIngredients} preparation={preparation} setPreparation={setPreparation} steps={steps} setSteps={setSteps} setImage={setImage} image={image} setCategories={setCategories} portions={portions} setPortions={setPortions} errorMessage={errorMessage}/>
        <Image/>
        </div>
    )
}
export default AddRecipeIndex;