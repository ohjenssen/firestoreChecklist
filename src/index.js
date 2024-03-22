import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";
import { getFirestore, collection, doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { taskComponent } from "./htmlComponents/task";

// Initialize Firebase, create a congif file and add your own firebaseconfig there
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Creating a reference to the tasks collection inside the database
const tasksRef = collection(db, 'tasks');

const container = document.querySelector('#task-container');
const form = document.querySelector('#add-tasks-form');
let tasks = [];

async function createTask(event){
    event.preventDefault();
    container.innerHTML = ``;
    const formData = new FormData(event.target);
    const listingInfo = Object.fromEntries(formData.entries());
    const id = new Date().getTime();
    await setDoc(doc(tasksRef, id.toString()), listingInfo);
    form.reset();
}

form.addEventListener('submit', createTask)

// Document listens for changes, updates when task is added
onSnapshot(tasksRef, (snapshot) => {
    snapshot.docs.forEach(doc => {
        tasks.push({ ...doc.data(), id: doc.id});
        const taskDiv = taskComponent(doc.data()['task-name'], doc.id);
        container.appendChild(taskDiv)
    })

    const deleteBtns = document.querySelectorAll('.deleteBTN');
    deleteBtns.forEach(button => {
        button.addEventListener('click', () => {
            container.innerHTML = ``;
            deleteDoc(doc(db, 'tasks', button.id));
        })
    })
    
    const addImageBTN = document.querySelectorAll('.addImageBTN');
    addImageBTN.forEach((button) => {
       button.addEventListener('click', () => {
            const addImageContainer = document.querySelector('.addImageContainer');           
            addImageContainer.classList.toggle('active');

            addImageContainer.addEventListener('click', (e) => {
                addImageContainer.classList.remove('active');
            })
       })
    })
});                  

// -------------------------------------------------------
const storage = getStorage();

const listRef = ref(storage, 'images');

const imageForm = document.querySelector('.testImageForm');
imageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const imageFile = document.getElementById('imageFile').files[0];
    const fileRef = ref(storage, `images/${imageFile.name}`);

    try {
        const snapshot = await uploadBytes(fileRef, imageFile)
        window.location.reload;
        console.log('Sucess: ', snapshot)
    } catch (error){
        console.error('Error uploading the file: ', error)
    }
})

const testImageContainer = document.querySelector('.testImageContainer');

listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {
            getDownloadURL(ref(storage, itemRef))
                .then((url) => {
                    const img = document.createElement('img');
                    img.src = url;
                    testImageContainer.appendChild(img);
                })
        });
        
    }).catch((error) => {

    });
