import { createContext, useState, useEffect } from "react";
import { getCategoriesAndDocuments } from "../utils/firebase/firebase.utils.js";

// Value = initial empty object
export const CategoriesContext = createContext({
    categoriesMap: {},
})

// Component = 
export const CategoriesProvider = ({children}) => {
    const [categoriesMap, setCategoriesMap] = useState({})

    // Creem o functie asyncrona care cheama produsele din firebase
    // Produsele le stocam in variabila categoryMap prin chemarea functiei getCategoriesAndDocuments()
    // setam setCategoriesMap cu noua variabila care acum detine produsele
    // la final chemam si functia
    // folosim useEffect pentru a randa produsele atunci cand intram pe pagina
    useEffect(() => {
        const getCategoriesMap = async () => {
            const categoryMap = await getCategoriesAndDocuments()
            setCategoriesMap(categoryMap)
        }
        getCategoriesMap()
    }, [])
    
    const value = {categoriesMap}
    return (
        <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
    )
}