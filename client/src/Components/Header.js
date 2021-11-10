import React, {Fragment, useState} from 'react';
import {GiHamburgerMenu} from 'react-icons/gi'

const Header = ({setModalActive, setModalContent}) => {
    const [burgerOpen, setBurgerOpen] = useState(false)
    return (
        <header>
            <div onClick={() => window.location.href = '/'} className='logo'><img className='headerLogo' src='https://cdn.worldvectorlogo.com/logos/my-recipes.svg' alt='logo'/></div>
            <nav>
                <p><a href='/'>Home</a></p>
                <p><a href='/allRecipes'>View recipes</a></p>
                {localStorage.getItem('recipe_token') && <p><a href='/myRecipes'>My recipes</a></p>}
                {localStorage.getItem('recipe_token') && <p><a href='/favorites'>Favorites</a></p>}
                {localStorage.getItem('recipe_token') && <p><a href='/addRecipe'>Create a recipe</a></p>}
            </nav>

            <div className='mobileNavigation'>
                <button onClick={() => setBurgerOpen(value => !value)}><GiHamburgerMenu style={{fontSize: '1.5em'}}/>
                    {burgerOpen &&
                    <Fragment><p/>
                    <p><a href='/'>Home</a></p>
                    <p><a href='/allRecipes'>View recipes</a></p>
                    {localStorage.getItem('recipe_token') && <p><a href='/myRecipes'>My recipes</a></p>}
                    {localStorage.getItem('recipe_token') && <p><a href='/favorites'>Favorites</a></p>}
                    {localStorage.getItem('recipe_token') && <p><a href='/addRecipe'>Create a recipe</a></p>}
                    </Fragment>}
                </button>
            </div>

            <div className='headerAuth'>
                {!localStorage.getItem('recipe_token') && <div><button onClick={() => {
                    setModalContent('signUp')
                    setModalActive(true)
                }}>Sign up
                </button></div>}
                {!localStorage.getItem('recipe_token') && <div><button onClick={() => {
                    setModalContent('signIn')
                    setModalActive(true)
                }}>Sign in
                </button></div>}
                {localStorage.getItem('recipe_token') && <div><button onClick={() => {
                    setModalContent('signOut')
                    setModalActive(true)
                }}>Sign out
                </button></div>}
            </div>
        </header>
    );
};

export default Header;