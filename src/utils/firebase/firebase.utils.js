import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

// Some parts of this file doesnt have a lot of logic, is just setup, config from documentation that we must do in order to work(1,2)

// 1.
// initializeApp is class to initialize with a paramter -> paramter is firebaseConfig
// we need to do this for create an instance for our firebase project to make CRUD actions

// my firebase config to acces my specific account
const firebaseConfig = {
  apiKey: "AIzaSyBSVMv6Do7mGWVrFIYAVYPYjFFC9AvSOtA",
  authDomain: "crwn-clothin-db-ca268.firebaseapp.com",
  projectId: "crwn-clothin-db-ca268",
  storageBucket: "crwn-clothin-db-ca268.appspot.com",
  messagingSenderId: "545114214272",
  appId: "1:545114214272:web:bb6bd2ddcf78124f27bb65",
};

const firebaseApp = initializeApp(firebaseConfig);

// 2. initialize googleProvider with new class GoogleAuthProvider
// use method setCustomParameters, set key and value

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

//   auth -> instanced getAuth()
//   signInWithGooglePopup and pass 2 parameters => auth & googleProvider

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

// 3.  db -> instanced getFirestore()
export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done");
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

//  createUserDocumentFromAuth -> async function receive userAuth object
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  // userDocRef -> doc(db(database), "users"(colection), userAuth.uid(unique ID))
  const userDocRef = doc(db, "users", userAuth.uid);
  // after we make the request and get the data response
  // we want to read that data so
  // userSnapshot async function getDoc(userDocRef(data))
  const userSnapshot = await getDoc(userDocRef);
  // exist verify if data exist in our database or not
  // if not create an object for me
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    // use setDoc to send the object created for the user
    // with this 3 keys and values in user data in database
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  // else return userDocRef
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

// sign out
export const signOutUser = async () => await signOut(auth);

// Observer
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// Observer Pattern
// {
// next:
// error:
// completed:

// }
