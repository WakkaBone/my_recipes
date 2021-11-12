import React from 'react';

const CategoriesTable = ({setCategories}) => {
    const checkboxChangeHandler = () => {
        const categories = []
        const checkboxes = document.getElementsByClassName('checkbox')
        for(let box of checkboxes){if(box.checked) categories.push(box.value)}
        setCategories([...categories])
    }
    return (
            <table style={{width: '100%'}}>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Main course <input onChange={checkboxChangeHandler} className='checkbox' value='main course' type='checkbox'/></label></td><td><label>Second course and snacks <input onChange={checkboxChangeHandler} className='checkbox' value='second course and snacks' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Salad <input onChange={checkboxChangeHandler} className='checkbox' value='salad' type='checkbox'/></label></td><td><label>Soup <input onChange={checkboxChangeHandler} className='checkbox' value='soup' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Meat and chicken <input onChange={checkboxChangeHandler} className='checkbox' value='meat and chicken' type='checkbox'/></label></td><td><label>Fish and seafood <input onChange={checkboxChangeHandler} className='checkbox' value='fish and seafood' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Vegetables <input onChange={checkboxChangeHandler} className='checkbox' value='vegetables' type='checkbox'/></label></td><td><label>Fruits <input onChange={checkboxChangeHandler} className='checkbox' value='fruits' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Dairy <input onChange={checkboxChangeHandler} className='checkbox' value='dairy' type='checkbox'/></label></td><td><label>Dessert <input onChange={checkboxChangeHandler} className='checkbox' value='dessert' type='checkbox'/></label></td></tr>
                <tr><td style={{padding: '0 10px 0 0'}}><label>Vegan <input onChange={checkboxChangeHandler} className='checkbox' value='vegan' type='checkbox'/></label></td><td><label>Drink <input onChange={checkboxChangeHandler} className='checkbox' value='drink' type='checkbox'/></label></td></tr>
            </table>
    );
};

export default CategoriesTable;