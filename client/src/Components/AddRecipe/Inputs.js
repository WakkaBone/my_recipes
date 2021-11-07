import React, {useRef, useState} from 'react';
import {serverUrl} from "../../constants";

const Inputs = ({dishTitle, setDishTitle, setDishDescription, setPreparation, setDishLevel, setIngredients, steps, setSteps, addStepHandler, deleteStepHandler, setRecipeHandler, setImage, setCategories, portions, setPortions, errorMessage}) => {
    const imgRef = useRef()
    const [loader, setLoader] = useState('')

    const checkboxChangeHandler = () => {
        const categories = []
        const checkboxes = document.getElementsByClassName('checkbox')
        for(let box of checkboxes){if(box.checked) categories.push(box.value)}
        setCategories([...categories])
    }

    return (
        <div className='newRecipeInputs'>
            <h1>Create a new recipe</h1>
            <label>Dish title: <input type='text' onChange={(e) => setDishTitle(e.target.value)} value={dishTitle}
                                          placeholder='Dish title'/></label>
            <textarea style={{marginBottom: '7px'}} placeholder='Dish description' onChange={(e) => {setDishDescription(e.target.value)}}/>

            <label>Preparation time: <input onChange={(e) => setPreparation(e.target.value)} type='time'
                                               placeholder='Preparation time'/></label>
            <label>Number of portions: <input value={portions} onChange={(e) => setPortions(e.target.value)} type='number' min='1' max='10'/></label>
            <label>Level: <select onChange={(e) => setDishLevel(e.target.value)}>
                <option value='Easy'>Easy</option>
                <option value='Medium'>Medium</option>
                <option value='Hard'>Hard</option>
            </select></label>
            <h3>Categories:</h3>
            <table>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Main course <input onChange={checkboxChangeHandler} className='checkbox' value='main course' type='checkbox'/></label></td><td><label>Second course and snacks <input onChange={checkboxChangeHandler} className='checkbox' value='second course and snacks' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Salad <input onChange={checkboxChangeHandler} className='checkbox' value='salad' type='checkbox'/></label></td><td><label>Soup <input onChange={checkboxChangeHandler} className='checkbox' value='soup' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Meat and chicken <input onChange={checkboxChangeHandler} className='checkbox' value='meat and chicken' type='checkbox'/></label></td><td><label>Fish and seafood <input onChange={checkboxChangeHandler} className='checkbox' value='fish and seafood' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Vegetables <input onChange={checkboxChangeHandler} className='checkbox' value='vegetables' type='checkbox'/></label></td><td><label>Fruits <input onChange={checkboxChangeHandler} className='checkbox' value='fruits' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Vegan <input onChange={checkboxChangeHandler} className='checkbox' value='vegan' type='checkbox'/></label></td><td><label>Drink <input onChange={checkboxChangeHandler} className='checkbox' value='drink' type='checkbox'/></label></td></tr>
            </table>
            <h3>Ingredients:</h3>
            <textarea onChange={(e) => {
                const ingredients = e.target.value.split(',').map(ingredient => ingredient.trim())
                setIngredients(ingredients)
            }}>List ingredients, separated by commas</textarea>
            <h3>Cooking steps:</h3>
            {steps.map((step, index) => {
                if (index === 0) return <p><input onChange={(e) => {
                    setSteps(value => {
                        value[index] = e.target.value
                        return value
                    })
                }} type='text' placeholder={'step ' + (index + 1)}/>
                    <button onClick={addStepHandler}>Add next step</button>
                </p>
                return <p><input type='text' onChange={(e) => {
                    setSteps(value => {
                        value[index] = e.target.value
                        return value
                    })
                }} placeholder={'step ' + (index + 1)}/>
                    <button onClick={addStepHandler}>Add a new step</button>
                    <button onClick={() => deleteStepHandler(index)}>Delete step</button>
                </p>
            })}

            <label>Upload an image of the dish <input onChange={async () => {
                setLoader('Image is loading')
                const formData = new FormData()
                formData.append('image', imgRef.current.files[0])
                await fetch(`${serverUrl}/recipe/uploadImage`, {method: 'post', body: formData})
                    .then(response => response.json()).then(result => {
                        setImage(result.imageData.secure_url)
                        setLoader('Image loaded')
                    })
                    .catch(err => {if(err) console.log(err)})
            }} ref={imgRef} type='file'/> {loader}</label>

            <button onClick={() => {setRecipeHandler()}}>Submit</button>
            <b style={{color: 'red'}}>{errorMessage}</b>
         </div>
    );
};

export default Inputs;