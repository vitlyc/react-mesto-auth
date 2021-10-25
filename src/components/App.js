// serve - s build
// npm start

import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupWithForm from "./PopupWithForm.js";
import api from "../utils/Api.js";
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App(props) {
   
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
    const [selectedCard, selectCard] = React.useState({});

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    };
    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    };
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    };
    function handleCardClick(select) {
        selectCard(select);
        setIsImagePopupOpen(true);
    };

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsImagePopupOpen(false);
    };
   
    const [userInfo, setUserInfo] = React.useState({});
    const [cards, setCards] = React.useState([]);
    // console.log(userInfo);
    React.useEffect(() => {
        
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([userData, initialCards]) => {
                setUserInfo({
                    userName: userData.name,
                    userDescription: userData.about,
                    userAvatar: userData.avatar,
                    userId: userData._id
                });
                setCards(initialCards);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    React.useEffect(() => {
        const closeByEscape = (e) => {
            if (e.key === 'Escape') {
                closeAllPopups();
            }
        }

        document.addEventListener('keydown', closeByEscape)

        return () => document.removeEventListener('keydown', closeByEscape)
    }, [])



    function handleCardLike(card) {
        // console.log('hi');
        const isLiked = card.likes.some((i) => i._id === userInfo.userId);

        api.likeCard(card._id, isLiked)
        .then((newCard) => {
            setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => {
                console.log(err);
        });
        
    };

    function handleCardDelete(card) {
        api.deleteCard(card._id)
        .then(() => {
            setCards((cards) => cards.filter((c) => c._id !== card._id));
        })
        .catch((err) => {
                console.log(err);
        });
        
    };

    function handleUpdateUser(userData) {
        
        api.updateUserInfo(userData)
            .then((userData) => {
               
                setUserInfo({
                    userName: userData.name,
                    userDescription: userData.about,
                    userAvatar: userData.avatar,
                    userId: userData._id,
                });
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function handleUpdateavatar(userData) {
       
        api.setAvatar(userData.avatar)
            .then((userData) => {
                setUserInfo({
                    userName: userData.name,
                    userDescription: userData.about,
                    userAvatar: userData.avatar,
                    userId: userData._id,
                });
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function handleAddPlace(placeData) {
        api.createNewCard(placeData)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return ((
        <div className="page">
            <CurrentUserContext.Provider value={userInfo}>
                
               
            <Header />

                    <Main onEditProfile={handleEditProfileClick} isAddPlacePopupOpen={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick} card={selectedCard} onCardLike={handleCardLike} onCardDelete={handleCardDelete}
                    cards={cards}/>
                    <ImagePopup card={selectedCard} isOpen={isImagePopupOpen} closeAllPopups={closeAllPopups} />

                    <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

                    <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateavatar} />

                    <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} />

            <PopupWithForm name="approval" title="Вы уверены?" buttonName="Да" isOpen={false} />

            <Footer />
               
            </CurrentUserContext.Provider>
        </div>
    ));
}
export default App;









