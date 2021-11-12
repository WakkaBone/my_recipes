import React, {useRef, useState} from 'react';
import {serverUrl} from "../../constants";
import CategoriesTable from "../CategoriesTable";

const Inputs = ({dishTitle, setDishTitle, setDishDescription, setPreparation, setDishLevel, setIngredients, steps, setSteps, setRecipeHandler, setImage, setCategories, portions, setPortions, errorMessage}) => {
    const imgRef = useRef()
    const [loader, setLoader] = useState('')

    const uploadHandler = async () => {
        setLoader('Image is loading')
        const formData = new FormData()
        formData.append('image', imgRef.current.files[0])
        await fetch(`${serverUrl}/recipe/uploadImage`, {method: 'post', body: formData})
            .then(response => response.json()).then(result => {
                setImage(result.imageData.secure_url)
                setLoader('Image loaded')
            })
            .catch(err => {if(err) console.log(err)})
    }

    return (
        <div className='newRecipeInputs'>
            <h1>Create a new recipe</h1>
            <label>Dish title: <input type='text' onChange={(e) => setDishTitle(e.target.value)} value={dishTitle}
                                          placeholder='Dish title'/></label>
            <textarea style={{marginBottom: '7px', width: '100%'}} placeholder='Dish description' onChange={(e) => {setDishDescription(e.target.value)}}/>

            <label>Preparation time: <input onChange={(e) => setPreparation(e.target.value)} type='time'
                                               placeholder='Preparation time'/></label>
            <label>Number of portions: <input value={portions} onChange={(e) => setPortions(e.target.value)} type='number' min='1' max='10'/></label>
            <label>Level: <select onChange={(e) => setDishLevel(e.target.value)}>
                <option value='Easy'>Easy</option>
                <option value='Medium'>Medium</option>
                <option value='Hard'>Hard</option>
            </select></label>
            <h3>Categories:</h3>
            <CategoriesTable setCategories={setCategories}/>

            <h3>Ingredients:</h3>
            <textarea style={{width: '100%'}} onChange={(e) => {
                const ingredients = e.target.value.split(',').map(ingredient => ingredient.trim())
                setIngredients(ingredients)
            }}>List ingredients, separated by commas</textarea>
            <h3>Cooking steps:</h3>
            {steps.map((step, index) => {
                return <textarea key={index} style={{width: '100%'}} onChange={(e) => {
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

            <label>Upload an image of the dish <input onChange={uploadHandler} ref={imgRef} type='file'/> {loader}</label>

            <button onClick={setRecipeHandler}>Submit</button>
            <b style={{color: 'red'}}>{errorMessage}</b>
         </div>
    );
};

export default Inputs;