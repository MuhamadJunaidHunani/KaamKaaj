import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const themeSwitch = document.querySelector(".themeSwitch");

function toggleLoader(state) {
  let isLoading = state;
  document.querySelector(".LoaderCont").style.display = isLoading
    ? "flex"
    : "none";
}
themeSwitch.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  themeSwitch.classList.toggle("activeThemeBtn", newTheme === "dark");
});

toggleLoader(true);

if (document.getElementById("loginPage")) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user.email);
      window.location.href = "/index.html";
    }
    else {
      toggleLoader(false);
    }
  });
  const loginForm = document.querySelector(".loginForm");
  loginForm.addEventListener("submit", (e) => {
    toggleLoader(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        window.location.href = "/index.html";
      })
      .catch((error) => {
        toggleLoader(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        // alert(errorMessage);
      });
  });
}
else if (document.getElementById("signupPage")) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user.email);
      window.location.href = "/index.html";
    }
    else {
      toggleLoader(false);
    }
  });
  const signupForm = document.querySelector(".signupForm");
  signupForm.addEventListener("submit", (e) => {
    toggleLoader(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        addDocument("Users", {
          username,
          email,
          password,
          TimeStamp: serverTimestamp(),
          userId: user.uid,
        });
      })
      .catch((error) => {
        toggleLoader(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        // alert(errorMessage);
      });
  });
}
else if (document.getElementById("indexPage")) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("User is not logged in, redirecting to login page...");
      window.location.href = "/login.html";
    }
    else {
      toggleLoader(false);
      const todoLoaderCont = document.querySelector(".todoLoaderCont");
      const TaskInput = document.querySelector(".taskInput");
      const taskList = document.querySelector(".taskList");

      const toggleTodoLoder = (TodoState) => {
        todoLoaderCont.style.display = TodoState ? "flex" : "none";
      };
      const addDocument = async (collectionName, data) => {
        try {
          const docRef = await addDoc(collection(db, collectionName), data);
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          toggleTodoLoder(false);
          console.error("Error adding document: ", e);
        }
      };
      const deleteDocument = async (collectionName, docId) => {
        try {
          const docRef = doc(db, collectionName, docId);
          await deleteDoc(docRef);
          console.log("Document deleted with ID: ", docId);
        } catch (e) {
          console.error("Error deleting document: ", e);
        }
      };
      const updateTask = async (collectionName, docId, isDone) => {
        try {
          const docRef = doc(db, collectionName, docId);
          await updateDoc(docRef, { isDone });
        } catch (e) {
          console.error("Error updating task status: ", e);
        }
      };
      const fetchDocumentsRealTime = (collectionName, callback) => {
        try {
          toggleTodoLoder(true);

          const q = query(
            collection(db, collectionName),
            where("userTaskId", "==", user.uid),
            orderBy("TimeStamp", "desc")
          );
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            toggleTodoLoder(false);
            callback(docs);
          });
          return unsubscribe;
        } catch (e) {
          console.error("Error fetching documents: ", e);
        }
      };
      fetchDocumentsRealTime("Tasks", (docs) => {
        taskList.innerHTML = "";
        if (docs.length > 0) {
          docs.map((item, index) => {
            const TaskItem = document.createElement("li");
            TaskItem.classList.add("taskItem");
            TaskItem.innerHTML = `
            <input type='checkbox' id="inputAdd" ${
              item.isDone ? "checked" : ""
            } />
            <label>${
              item.isDone
                ? `<s>${index + 1}. ${item.taskValue}</s>`
                : `${index + 1}. ${item.taskValue}`
            }</label>
            <span class='deleteButton' id="${item.id}">✕</span>
          `;
            taskList.appendChild(TaskItem);
            TaskItem.querySelector(".deleteButton").addEventListener(
              "click",
              () => {
                deleteDocument("Tasks", item.id);
              }
            );
            TaskItem.querySelector(`#inputAdd`).addEventListener(
              "change",
              (e) => {
                const isChecked = e.target.checked;
                updateTask("Tasks", item.id, isChecked);
              }
            );
          });
        }
        else {
          const TaskItem = document.createElement("li");
          TaskItem.classList.add("taskItem");
          TaskItem.innerHTML = "No Data Found";
          taskList.appendChild(TaskItem);
        }
      });

      document.querySelector(".logoutCont").addEventListener("click", () => {
        signOut(auth)
          .then(() => {})
          .catch((error) => {});
      });

      document.querySelector(".addButton").addEventListener("click", () => {
        const taskValue = TaskInput.value;
        if (taskValue) {
          TaskInput.value = "";
          toggleTodoLoder(true);
          addDocument("Tasks", {
            taskValue,
            isDone: false,
            TimeStamp: serverTimestamp(),
            userTaskId: user.uid,
          });
        }
      });
    }
  });
}
else {
  document.write("No Routes Match");
}
