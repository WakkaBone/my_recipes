import React, {useState, useEffect, useRef, Fragment} from 'react';
import {serverUrl} from "../../constants";
import {FiLoader} from 'react-icons/fi'

const EditRecipe = ({setIsEdit, editedRecipe}) => {
    const [recipe, setRecipe] = useState({})
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

    const checkboxChangeHandler = () => {
        const categories = []
        const checkboxes = document.getElementsByClassName('checkbox')
        for(let box of checkboxes){if(box.checked) categories.push(box.value)}
        setCategories([...categories])
    }

    const getRecipe = async () => {
        await fetch(`${serverUrl}/recipe/getOneRecipe`, {
            method: 'post',
            body: JSON.stringify({dishName: editedRecipe}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                setRecipe(result.recipe[0])
                setDishTitle(result.recipe[0].dish_name)
                setDishDescription(result.recipe[0].dish_description)
                setDishLevel(result.recipe[0].howhard)
                setCategories(result.recipe[0].categories)
                setIngredients(result.recipe[0].ingredients)
                setPreparation(result.recipe[0].preparation_time)
                setSteps(result.recipe[0].steps)
                setImage(result.recipe[0].image)
                setPortions(result.recipe[0].portions)
                const checkboxes = document.getElementsByClassName('checkbox')
                for(let box of checkboxes){if(result.recipe[0].categories.includes(box.value)) box.checked = true}
            })
            .catch(err => {if (err) console.log(err)})
    }

    const addStepHandler = () => {setSteps(value => [...value, ''])}
    const deleteStepHandler = (index) => {
        setSteps(value => {
            const newArr = [...value]
            newArr.splice(index, 1)
            return newArr
        })
    }

    const updateRecipeHandler = async () => {
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
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/recipe/updateRecipe`, {
            method: 'put', body: JSON.stringify({
                token, recipe: recipe.dish_name,
                recipeNewTitle: dishTitle,
                recipeNewDescription: dishDescription,
                recipeNewLevel: dishLevel,
                recipeNewCategories: categories,
                recipeNewIngredients: ingredients,
                recipeNewPreparationTime: preparation,
                recipeNewSteps: steps,
                recipeNewPortions: portions
            }), headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                if(result.error && result.error.detail) {
                    alert(result.error.detail+'. Пожалуйста, выберите другое название.')
                    return
                }
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Token expired, log in again')
                    localStorage.removeItem('recipe_token')
                    window.location.reload()
                }
                else window.location.reload()
            })
            .catch(e => {
                if (e) console.log(e)
            })
    }

    const deleteRecipeHandler = async () => {
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/recipe/deleteRecipe`, {method: 'delete', body: JSON.stringify({token, recipe: recipe.dish_name}), headers: {'Content-Type': 'application/json'}})
            .then(response => response.json()).then(result => {
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Token expired, log in again')
                    localStorage.removeItem('recipe_token')
                    window.location.reload()
                } else window.location.reload()})
            .catch(e => {if(e) console.log(e)})
    }

    useEffect(() => {getRecipe()}, [])
    return (
        <div className='newRecipeInputs'>
            {!recipe.dish_name ? <FiLoader/> :

                <Fragment>
                    <label>Dish title: <input type='text' onChange={(e) => setDishTitle(e.target.value)} value={dishTitle}
                                              placeholder='Dish title'/></label>
                    <textarea style={{marginBottom: '7px', width: '100%'}} placeholder='Dish description' onChange={(e) => {setDishDescription(e.target.value)}}>{recipe.dish_description}</textarea>

                    <label>Preparation time: <input value={preparation} onChange={(e) => setPreparation(e.target.value)} type='time'
                                                    placeholder='Preparation time'/></label>
                    <label>Number of portions: <input value={portions} onChange={(e) => setPortions(e.target.value)} type='number' min='1' max='10'/></label>
                    <label>Level: <select onChange={(e) => setDishLevel(e.target.value)}>
                        <option selected={recipe.howhard === 'Easy' && true} value='Easy'>Easy</option>
                        <option selected={recipe.howhard === 'Medium' && true} value='Medium'>Medium</option>
                        <option selected={recipe.howhard === 'Hard' && true} value='Hard'>Hard</option>
                    </select></label>

                    <h3>Categories:</h3>
                    <table>
                        <tr><td style={{padding: '0 10px 0 0'}}><label>Main course <input onChange={checkboxChangeHandler} className='checkbox' value='main course' type='checkbox'/></label></td><td><label>Second course and snacks <input onChange={checkboxChangeHandler} className='checkbox' value='second course and snacks' type='checkbox'/></label></td></tr>
                        <tr><td style={{padding: '0 10px 0 0'}}><label>Salad <input onChange={checkboxChangeHandler} className='checkbox' value='salad' type='checkbox'/></label></td><td><label>Soup <input onChange={checkboxChangeHandler} className='checkbox' value='soup' type='checkbox'/></label></td></tr>
                        <tr><td style={{padding: '0 10px 0 0'}}><label>Meat and chicken <input onChange={checkboxChangeHandler} className='checkbox' value='meat and chicken' type='checkbox'/></label></td><td><label>Fish and seafood <input onChange={checkboxChangeHandler} className='checkbox' value='fish and seafood' type='checkbox'/></label></td></tr>
                        <tr><td style={{padding: '0 10px 0 0'}}><label>Vegetables <input onChange={checkboxChangeHandler} className='checkbox' value='vegetables' type='checkbox'/></label></td><td><label>Fruits <input onChange={checkboxChangeHandler} className='checkbox' value='fruits' type='checkbox'/></label></td></tr>
                        <tr><td style={{padding: '0 10px 0 0'}}><label>Dairy <input onChange={checkboxChangeHandler} className='checkbox' value='dairy' type='checkbox'/></label></td><td><label>Dessert <input onChange={checkboxChangeHandler} className='checkbox' value='dessert' type='checkbox'/></label></td></tr>
                        <tr><td style={{padding: '0 10px 0 0'}}><label>Vegan <input onChange={checkboxChangeHandler} className='checkbox' value='vegan' type='checkbox'/></label></td><td><label>Drink <input onChange={checkboxChangeHandler} className='checkbox' value='drink' type='checkbox'/></label></td></tr>
                    </table>

                    <h3>Ingredients:</h3>
                    <textarea style={{width: '100%'}} onChange={(e) => {
                        const ingredients = e.target.value.split(',').map(ingredient => ingredient.trim())
                        setIngredients(ingredients)
                    }}>{recipe.ingredients.toString()}</textarea>

                    <h3>Cooking steps:</h3>
                    {steps.map((step, index) => {
                        if (index === 0) return <p><input defaultValue={steps[index]} onChange={(e) => {
                            setSteps(value => {
                                value[index] = e.target.value
                                return value
                            })
                        }} type='text' placeholder={'step ' + (index + 1)}/>
                            <button onClick={addStepHandler}>Add next step</button>
                        </p>
                        return <p><input defaultValue={steps[index]} type='text' onChange={(e) => {
                            setSteps(value => {
                                value[index] = e.target.value
                                return value
                            })
                        }} placeholder={'step ' + (index + 1)}/>
                            <button onClick={addStepHandler}>Add a new step</button>
                            <button onClick={() => deleteStepHandler(index)}>Delete step</button>
                        </p>
                    })}
                </Fragment>

            }
            <div><button onClick={updateRecipeHandler}>Save changes</button>
            <button onClick={deleteRecipeHandler}>Delete recipe</button>
            <button onClick={() => {setIsEdit(false)}}>Cancel</button></div>
            <b style={{color: 'red'}}>{errorMessage}</b>
        </div>
    );
};

export default EditRecipe;