import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZdTnf6lQV8AAcgCnhZbbBgTdBB2JIvxo",
  authDomain: "csd-waitlist.firebaseapp.com",
  databaseURL: "https://csd-waitlist-default-rtdb.firebaseio.com",
  projectId: "csd-waitlist",
  storageBucket: "csd-waitlist.appspot.com",
  messagingSenderId: "835959686846",
  appId: "1:835959686846:web:237214b944e39e0afb80ef"
};

initializeApp(firebaseConfig);
const dbRef = ref(getDatabase())

const messageBoard = document.getElementById("messageBoard")

const groupOne = document.getElementById("list1")
const groupTwo = document.getElementById("list2")
const groupThree = document.getElementById("list3")
const groupFour = document.getElementById("list4")
const groupFive = document.getElementById("list5")

let timeout

// set array for each group list so that I can iterate through and add their list items (<li/>) from firebase data
const firebaseListArray = [groupOne, groupTwo, groupThree, groupFour, groupFive]

onValue(child(dbRef, `Announcements/Locker Number Ready`), (snapshot) => {
  if (snapshot.exists()) {
    clearInterval(timeout)
    const firebaseArray = snapshot.val()
    if (firebaseArray !== "") {
      createAnncmt(firebaseArray)
    } else {
    console.log("No data available");
    while(messageBoard.firstElementChild) {
      messageBoard.firstElementChild.remove();
   }
  }}
})

// this onValue built in Firebase function listens for any changes to the database and then will update the
// lists with the corresponding data
onValue(child(dbRef, `Waiting Lists/`), () => {
  firebaseListArray.map((group) => {
    // my first while loop!! I never used one =D this will remove the dom list nodes and then reset
    // them while the length is greater than one, this accounts for the actual html title of the list which I did not
    // want to delete
    while (group.childNodes.length > 1) {
      group.removeChild(group.lastChild)
    }
    let groupTitle = group.title
    get(child(dbRef, `Waiting Lists/` + `${groupTitle}/`)).then((snapshot) => {
      if (snapshot.exists()) {
        const firebaseArray = snapshot.val()
        if (firebaseArray !== "") {
          firebaseArray.map((fbItem => {
            createListItem(group, fbItem["Locker Number"])
          }
          ))
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  })
})

function createListItem(roomType, lockerNumber) {
  const newElement = document.createElement("li")
  newElement.className = "listItems"

  const lockerNumberText = document.createElement("div")
  lockerNumberText.innerText = lockerNumber
  lockerNumberText.setAttribute("class", "locker-text")
  newElement.appendChild(lockerNumberText)

  roomType.appendChild(newElement)
}

function createAnncmt(arr) {
  const array = []
  arr.map(item => {
    const message = `${item["Locker Number"]}, your ${item["Room"]} is ready! Please come to the front desk.`
    array.unshift(message)
  })
  let count = 0
  timeout = setInterval(function cycleText() {
    count++
    let index = count % array.length
    let message = document.createElement('p')
    while(messageBoard.firstElementChild) {
      messageBoard.firstElementChild.remove();
   }
    message.innerText = array[index]
    messageBoard.appendChild(message)
    return cycleText
  }(), 2500)
  // double parentheses before interval, invokes immediately in addition to return cycleText
}









// create array that cycles through the available messages
// message on bottom saying thanks for waiting etc.