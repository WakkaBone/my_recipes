import React from 'react';
import {BsTelegram} from 'react-icons/bs'
import {IoLogoWhatsapp} from 'react-icons/io'
import {AiTwotoneMail, AiTwotonePhone, AiFillFacebook} from 'react-icons/ai'
import {FaViber} from 'react-icons/fa'

const Footer = () => {
    return (
        <footer>
            <div>&copy;	 2021 MyRecipes</div>
            <div>Contact us: <AiTwotonePhone/> <AiTwotoneMail/> <AiFillFacebook/> <BsTelegram/> <IoLogoWhatsapp/> <FaViber/> </div>
        </footer>
    );
};

export default Footer;