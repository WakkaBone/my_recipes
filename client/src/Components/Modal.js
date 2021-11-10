import React, {useState} from 'react';
import {serverUrl} from "../constants";

const Modal = ({setModalActive, modalContent}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const loginHandler = async () => {
        await fetch(`${serverUrl}/api/login`, {
            method: 'post', body: JSON.stringify({email, password}),
            headers: {'Content-type': 'application/json'}
        })
            .then(response => response.json()).then(result => {
                result.error ?
                    result.error[0].msg ? setErrorMessage(result.error[0].msg) : setErrorMessage(result.error)
                    : (() => {
                        localStorage.setItem('recipe_token', result.accessToken)
                        setModalActive(false)
                        window.location.reload()
                    })()
            })
    }
    const signUpHandler = async () => {
        await fetch(`${serverUrl}/api/register`, {method: 'post', body: JSON.stringify({email, password, username}), headers: {'Content-Type': 'application/json'}})
            .then(response => response.json()).then(result => {
                result.error ?
                    result.error[0].msg ? setErrorMessage(result.error[0].msg) : setErrorMessage(result.error)
                    : (() => {
                        loginHandler()
                        window.location.reload()
                        setModalActive(false)
                    })();
            })
    }

    if (modalContent === 'signIn') {
        return (
            <div className='modalContainer'>
                <div className='modalContentContainer'>
                    <div style={{textAlign: 'center'}}>
                        <h1>Sign in</h1>
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email'/>
                        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}
                               placeholder='password'/><p/>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button onClick={() => {
                            loginHandler()
                        }}>Sign in</button>
                        <button onClick={() => setModalActive(false)}>Close</button>
                        <p className='authErrorMessage'>{errorMessage}</p>
                    </div>
                </div>
            </div>
        )
    }
    if (modalContent === 'signUp') {
        return (
            <div className='modalContainer'>
                <div className='modalContentContainer'>
                    <div style={{textAlign: 'center'}}>
                        <h1>Sign up</h1>
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email'/>
                        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}
                               placeholder='password'/>
                        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}
                               placeholder='username'/><p/>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button onClick={() => {
                            signUpHandler()
                        }}>Sign up</button>
                        <button onClick={() => setModalActive(false)}>Close</button>
                        <p className='authErrorMessage'>{errorMessage}</p>
                    </div>
                </div>
            </div>
        )
    } else return (
        <div className='modalContainer'>
            <div className='modalContentContainer'>
                <div><h1>Sign out</h1>
                    <p>Are you sure you want to logout?</p></div>
                <div><button onClick={() => {
                    localStorage.removeItem('recipe_token')
                    setModalActive(false)
                }}>Sign out</button>
                    <button onClick={() => setModalActive(false)}>Close</button></div>
            </div>
        </div>
    )
};

export default Modal;