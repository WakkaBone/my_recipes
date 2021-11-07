import React from 'react';

const Header = ({setModalActive, setModalContent}) => {
    return (
        <header>
            <div><img className='headerLogo' src='https://cdn.worldvectorlogo.com/logos/my-recipes.svg' alt='logo'/></div>
            <nav>
                <p><a href='/'>Home</a></p>
                <p><a href='/allRecipes'>View recipes</a></p>
                {localStorage.getItem('recipe_token') && <p><a href='/myRecipes'>My recipes</a></p>}
                {localStorage.getItem('recipe_token') && <p><a href='/favorites'>Favorites</a></p>}
                {localStorage.getItem('recipe_token') && <p><a href='/addRecipe'>Create a recipe</a></p>}
            </nav>
            <div className='headerAuth'>
                {!localStorage.getItem('recipe_token') && <button onClick={() => {
                    setModalContent('signUp')
                    setModalActive(true)
                }}>Sign up
                </button>}
                {!localStorage.getItem('recipe_token') && <button onClick={() => {
                    setModalContent('signIn')
                    setModalActive(true)
                }}>Sign in
                </button>}
                {localStorage.getItem('recipe_token') && <button onClick={() => {
                    setModalContent('signOut')
                    setModalActive(true)
                }}>Sign out
                </button>}
            </div>
        </header>
    );
};

export default Header;