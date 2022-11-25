import { createContext, useState, useEffect, useReducer } from "react";
import { onAuthStateChangedListener, signOutUser } from "../utils/firebase/firebase.utils";
import { createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";

// as the actual value you want to access
// si useContext are nevoie de niste valori default ca si useState
export const UserContext = createContext({
    setCurrentUser: () => null,
    currentUser: null,
})

export const UserProvider = ({children}) => {
    // la inceput userul nu exista si il setam ca si null
const [currentUser, setCurrentUser] = useState(null)
// creem aceasta variabila (value) pentru a putea trimite mai departe
// currentUser si setCurrentUser in value de mai jos , din return(din componenta)
const value = {currentUser, setCurrentUser}
// Observer Pattern 
// 
useEffect(() => {
    // onAuthStateChangedListener este o functie pe care am construito initial in utils
    // aceasta ia ca si parametru un callback si returneaza o alta functie care ia ca parametru auth si callback
    // pe scurt, onAuthStateChangedListener va rula un callback de fiecare daca cand se intampla ceva cu userul,
    // sau mai simplu va rula un callback cand se monteaza componeta si 
    const unsubscribe = onAuthStateChangedListener((user) => {
        // verifica daca este un user, daca nu creaza un user nou
        if(user) {
            createUserDocumentFromAuth(user);
        }
        // daca exista un user trecel ca si currentUser | aici ma refer la faptul ca ne dam seama daca userul este log in sau log out
        setCurrentUser(user)
        })
    return unsubscribe
},[])

return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
