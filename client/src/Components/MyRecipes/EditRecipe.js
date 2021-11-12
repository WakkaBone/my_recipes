import React, {useState, useEffect, useCallback, Fragment} from 'react';
import {inputValidation, serverUrl} from "../../constants";
import {FiLoader} from 'react-icons/fi'
import CategoriesTable from "../CategoriesTable";

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

    const beforeUnload = useCallback((e) => {e.returnValue = 'Are you sure you want to leave?'}, [])

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

    const updateRecipeHandler = async () => {
        const validation = inputValidation(dishTitle, dishDescription, categories, ingredients, steps, preparation, portions)
        if(validation) {
            setErrorMessage(validation)
            return
        }
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/recipe/updateRecipe`, {
            method: 'put', body: JSON.stringify({
                token, recipe: recipe.dish_name.trim(),
                recipeNewTitle: dishTitle.trim(),
                recipeNewDescription: dishDescription.trim(),
                recipeNewLevel: dishLevel,
                recipeNewCategories: categories,
                recipeNewIngredients: ingredients.map(ing => ing.trim()).filter(ing => ing),
                recipeNewPreparationTime: preparation,
                recipeNewSteps: steps.map(step => step.trim()).filter(step => step),
                recipeNewPortions: portions
            }), headers: {'Content-Type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                if(result.error && result.error.detail) {
                    alert(result.error.detail+'. Please, choose another name.')
                    return
                }
                if(result.error && result.error.name === 'TokenExpiredError') {
                    alert('Token expired, log in again')
                    localStorage.removeItem('recipe_token')
                    window.removeEventListener('beforeunload', beforeUnload, true)
                    window.location.reload()
                }
                else {
                    window.removeEventListener('beforeunload', beforeUnload, true)
                    window.location.reload()
                }
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

    useEffect(() => {
        window.addEventListener('beforeunload', beforeUnload, true)
        getRecipe()
    }, [])
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
                    <CategoriesTable setCategories={setCategories}/>

                    <h3>Ingredients:</h3>
                    <textarea style={{width: '100%'}} onChange={(e) => {
                        const ingredients = e.target.value.split(',').map(ingredient => ingredient.trim())
                        setIngredients(ingredients)
                    }}>{recipe.ingredients.toString()}</textarea>

                    <h3>Cooking steps:</h3>
                    {steps.map((step, index) => {
                        return <textarea key={index} value={steps[index]} style={{width: '100%'}} onChange={(e) => {
                            setSteps(value => {
                                const newArr = [...value]
                                newArr[index] = e.target.value
                                return newArr
                            })
                        }} placeholder={'step ' + (index + 1)}/>
                    })}
                    <div>
                        <button onClick={() => setSteps(value => [...value, ''])}>Add a new step</button>
                        <button onClick={() => setSteps(value => {
                            const newArr = [...value]
                            newArr.pop()
                            return newArr
                        })}>Delete last step</button>
                    </div><p/>
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