// export const serverUrl = 'http://localhost:4000'
export const serverUrl = 'https://myrecipeserver.herokuapp.com'

export const inputValidation = (dishTitle, dishDescription, categories, ingredients, steps, preparation, portions) => {
    if (!dishTitle) {return 'Please enter the dish title'}
    if (!dishDescription) {return 'Please enter the dish description'}
    if (!categories.length) {return 'Please select at least one category'}
    if (!ingredients.length && !ingredients[0]) {return 'Please enter the ingredients'}
    if (steps.length === 1 && !steps[0]) {return 'Please enter at least one cooking step'}
    if (!preparation) {return 'Please enter the preparation time'}
    if (!portions) {return 'Please enter the number of portions'}
}