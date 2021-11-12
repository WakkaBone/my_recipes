import './App.css';
import React, {useState, useEffect} from "react";
import MainPage from "./Components/Main";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ViewRecipeIndex from "./Components/ViewRecipe";
import AddRecipeIndex from "./Components/AddRecipe";
import MyRecipesIndex from "./Components/MyRecipes";
import FavoritesIndex from "./Components/Favorites";
import Modal from "./Components/Modal";
import ViewOneRecipe from "./Components/ViewRecipe/ViewOneRecipe";
import {serverUrl} from "./constants";

function App() {
    const [modalActive, setModalActive] = useState(false)
    const [modalContent, setModalContent] = useState('')

    const checkToken = async() => {
        const token = localStorage.getItem('recipe_token')
        await fetch(`${serverUrl}/api/checkToken`, {method: 'post', body: JSON.stringify({token}), headers: {'Content-Type': 'application/json'}})
            .then(response => response.json()).then(result => {
                if(result.error) {localStorage.removeItem('recipe_token')}
            })
            .catch(e => {if(e) console.log(e)})
    }

    useEffect(() => {
        checkToken()
    }, [])

    return (
        <BrowserRouter>
        <div className='mainContainer'>
            <Header setModalActive={setModalActive} setModalContent={setModalContent}/>

            <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/allRecipes' element={<ViewRecipeIndex/>}/>
            <Route path='/myRecipes' element={<MyRecipesIndex/>}/>
            <Route path='/favorites' element={<FavoritesIndex/>}/>
            <Route path='/addRecipe' element={<AddRecipeIndex/>}/>
            <Route path='/recipes/:dish' element={<ViewOneRecipe/>}/>
            <Route path='/recipes/*' element={<h1 style={{textAlign: 'center', margin: '30px'}} className='error404 onePagePagination'>404: This page doesn't exist</h1>}/>
            <Route path='/*' element={<h1 style={{textAlign: 'center', margin: '30px'}} className='error404 onePagePagination'>404: This page doesn't exist</h1>}/>
            </Routes>

            {modalActive && <Modal modalActive={modalActive} setModalActive={setModalActive} modalContent={modalContent}/>}

            <Footer/>
        </div>
        </BrowserRouter>
    );
}

export default App;
