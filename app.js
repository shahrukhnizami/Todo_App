import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyARhky7ty6KtK0qTjfjZwvqCiDYpPOogSo",
    authDomain: "ecommerce-be2dc.firebaseapp.com",
    projectId: "ecommerce-be2dc",
    storageBucket: "ecommerce-be2dc.appspot.com",
    messagingSenderId: "179775344953",
    appId: "1:179775344953:web:ebf1ab5b690f4cf96358e8",
    measurementId: "G-04F0FVEDJZ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const numbers_list = document.getElementById("numbers_list");
const add_number = document.getElementById("add_number");
const inputTask = document.getElementById("inputTask");
//collection -> collection ke reference ke lye
//addDoc -> document ko collection mein add krne ke lye

const numberCollection = collection(db, "todos");

getNumbersFromDb();

add_number.addEventListener("click", async () => {
  const numbers = inputTask.value
  try {
    add_number.disabled = true;
    const docRef = await addDoc(numberCollection, {
      numbers,
    });
    add_number.disabled = false;
    getNumbersFromDb();
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    add_number.disabled = false;
    console.error("Error adding document: ", e);
  }
});

async function getNumbersFromDb() {
  const querySnapshot = await getDocs(numberCollection);
  numbers_list.innerHTML = "";
  querySnapshot.forEach((doc) => {
    var obj = doc.data();
    const li = `<li id= ${doc.id}> <b>${obj.numbers}</b>  <button> Edit </button> <button> Delete </button>  </li>`;
    numbers_list.innerHTML += li;
  });

  numbers_list.childNodes.forEach((node) => {
    node.children[1].addEventListener("click", async function () {
      const docRef = doc(db, "todos", this.parentNode.id);
      const newNumber = prompt("New Number");

      await updateDoc(docRef, {
        numbers: newNumber,
      });
      console.log("Document update hogya he");
      getNumbersFromDb();
    });

    node.children[2].addEventListener("click", async function () {
      const docRef = doc(db, "todos", this.parentNode.id);
      await deleteDoc(docRef);
      console.log("Doc deleted");
      getNumbersFromDb();
    });
  });
}