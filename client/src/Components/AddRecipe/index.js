import React, {useState} from 'react';
import {Navigate} from 'react-router-dom'
import Inputs from "./Inputs";
import Image from "./Image";
import {serverUrl} from "../../constants";

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

    const addStepHandler = () => {setSteps(value => [...value, ''])}
    const deleteStepHandler = (index) => {
        setSteps(value => {
            const newArr = [...value]
            newArr.splice(index, 1)
            return newArr
        })
    }

    const setRecipeHandler = async () => {
        if (!dishTitle) {
            setErrorMessage('Please enter the dish title')
            return
        }
        if (!dishDescription) {
            setErrorMessage('Please enter the dish description')
            return
        }
        if (!categories.length) {
            setErrorMessage('Please select at least one category')
            return
        }
        if (!ingredients) {
            setErrorMessage('Please enter the ingredients')
            return
        }
        if (!steps) {
            setErrorMessage('Please enter the cooking steps')
            return
        }
        if (!preparation) {
            setErrorMessage('Please enter the preparation time')
            return
        }
        if (!portions) {
            setErrorMessage('Please enter the number of portions')
            return
        }
        await fetch(`${serverUrl}/recipe/newRecipe`, {
            method: 'post', body: JSON.stringify({
                dishTitle,
                dishDescription,
                dishLevel,
                preparation: preparation + ':00',
                ingredients,
                steps,
                image,
                categories,
                portions,
                token: localStorage.getItem('recipe_token')
            }), headers: {'Content-Type': 'application/json'}
        }).then(response => response.json()).then(result => {
            if(result.error && result.error.name !== 'TokenExpiredError') {
                alert('Dish with this name already exists')
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
        <Inputs addStepHandler={addStepHandler} deleteStepHandler={deleteStepHandler} setRecipeHandler={setRecipeHandler} dishTitle={dishTitle} setDishTitle={setDishTitle} dishDescription={dishDescription} setDishDescription={setDishDescription} dishLevel={dishLevel} setDishLevel={setDishLevel} ingredients={ingredients} setIngredients={setIngredients} preparation={preparation} setPreparation={setPreparation} steps={steps} setSteps={setSteps} setImage={setImage} image={image} setCategories={setCategories} portions={portions} setPortions={setPortions} errorMessage={errorMessage}/>
        <Image/>
        </div>
    )
}
export default AddRecipeIndex;