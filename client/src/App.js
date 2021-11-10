import './App.css';
import React, {useState} from "react";
import MainPage from "./Components/Main";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import ViewRecipeIndex from "./Components/ViewRecipe";
import AddRecipeIndex from "./Components/AddRecipe";
import MyRecipesIndex from "./Components/MyRecipes";
import FavoritesIndex from "./Components/Favorites";
import Modal from "./Components/Modal";
import ViewOneRecipe from "./Components/ViewRecipe/ViewOneRecipe";

function App() {
    const [modalActive, setModalActive] = useState(false)
    const [modalContent, setModalContent] = useState('')

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
            <Route path='/recipes/*' element={<h1 style={{textAlign: 'center', margin: '30px'}} className='error404'>404: This page doesn't exist</h1>}/>
            <Route path='/*' element={<h1 style={{textAlign: 'center', margin: '30px'}} className='error404'>404: This page doesn't exist</h1>}/>
            </Routes>

            {modalActive && <Modal modalActive={modalActive} setModalActive={setModalActive} modalContent={modalContent}/>}
            <Footer/>
        </div>
        </BrowserRouter>
    );
}

export default App;
