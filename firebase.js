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
    while(messageBoard.firstElementChild) {
      messageBoard.firstElementChild.remove();
   }
    clearInterval(timeout)
    const firebaseArray = snapshot.val()
    createAnncmt(firebaseArray)
  }
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
  let messageArr = []
  let delay
  if (arr == "") {
    let template = "There are currently no rooms available. Thanks for your patience!"
    messageArr.push(template)
    delay = 10000
  } else {
    arr.map(item => {
      let lockerNum = item["Locker Number"]
      let room = item["Room"]
      const template = `${lockerNum}, your ${room} ${(room == "Non TV" || room == "Regular TV" || room == "Large TV") ? "room" : ""} is ready! Please come to the front desk.`
      // unshift allows me to announce the locker number ready immediately
      messageArr.unshift(template)
    })
    delay = 5000
  }
  let count = 0
  timeout = setInterval(function cycleText() {
    console.log(count)
    count++
    let index = (count - 1) % messageArr.length
    let message = document.createElement('p')
    while(messageBoard.firstElementChild) {
      messageBoard.firstElementChild.remove();
    }
    // this allows me to randomly add css animations for each new message
    const randomAnimationArr = ["message-grow", "message-left", "message-top-down", "message-bottom-up", "message-opacity"]
    const randomAnimation = randomAnimationArr[Math.floor(Math.random() * randomAnimationArr.length)]
    message.classList.add("message", randomAnimation)
    // message.classList.add("message", "message-grow")
    message.innerText = messageArr[index]
    messageBoard.appendChild(message)
    console.log(message)
    return cycleText
  }(), delay)
  // double parentheses before interval, invokes immediately in addition to "return cycleText;"" above
}


// create array that cycles through the available messages
// message on bottom saying thanks for waiting etc.