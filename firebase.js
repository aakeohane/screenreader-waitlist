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

const messageBoard = document.getElementById("announcement-message")
const lists = document.getElementsByClassName("roomList")

let timeout

function clearBoard() {
  while(messageBoard.firstElementChild) {
    messageBoard.firstElementChild.remove();
 }
  clearInterval(timeout)
}

onValue(child(dbRef, '/'), (snapshot) => {
  const totalValue = snapshot.val()
  console.log(totalValue)
  // object destructuring
  const {Announcements: {"Locker Number Ready": LockerNumber}, "Waiting Lists": WaitingLists} = totalValue
  const isLockerReadyEmpty = (LockerNumber == "")
  const waitlistArr = Object.values(WaitingLists)
  const iswaitlistEmpty = waitlistArr.some(item => item == "")
  // if both are true (they are blank strings) then there are rooms available so waitlist is not needed
  let availabilityArray
  if (isLockerReadyEmpty && iswaitlistEmpty) {
    availabilityArray = ["yes"]
    clearBoard()
    createAnncmt(availabilityArray)
  } else if (isLockerReadyEmpty && !iswaitlistEmpty) {
    availabilityArray = LockerNumber
    clearBoard()
    createAnncmt(availabilityArray)
  }
})

onValue(child(dbRef, `Announcements/Locker Number Ready`), (snapshot) => {
  if (snapshot.exists()) {
    clearBoard()
    const firebaseArray = snapshot.val()
    createAnncmt(firebaseArray)
  }
})


// this onValue built in Firebase function listens for any changes to the database and then will update the
// lists with the corresponding data
onValue(child(dbRef, `Waiting Lists/`), (snapshot) => {
      const nodes = document.getElementsByClassName("lockerContainer")
      const nodeList = [...nodes]
      const filteredArray = []
      // filters out the animated cloned secondary node because it causes parent node glitch
      nodeList.map(item => {
        if (!item.classList.contains("animate-list-secondary")) {
          filteredArray.push(item)
        }
      })
      filteredArray.map((lockerGroup) => {
        let listName = lockerGroup.parentNode.title
        let parent = lockerGroup.parentNode
        // this if statement allows me to only change the lists that are being edited rather than changing all of them
        if ((JSON.stringify(lockerGroup.children)) !== (JSON.stringify(snapshot.val()[`${listName}`]))) {
          // my first while loop!! I never used one =D this will remove the cloned dom lockerContainer for the animated nodes while the length 
          // is greater than one (one representing the initial lockerContainer)
          while (parent.children.length > 1) {
            parent.removeChild(parent.lastChild)
          }

          while(lockerGroup.children.length > 0) {
            lockerGroup.removeChild(lockerGroup.lastChild)
          }
          // not the ideal solution, but the only one that seemed to work was remove classLists and rename them if necesary with addLockers function
          lockerGroup.classList.remove("animate-list-primary")
          lockerGroup.classList.remove("animate-list-secondary")
          addLockers(lockerGroup, listName)
        }
      })
})

function addLockers(listDiv, groupTitle) {
  get(child(dbRef, `Waiting Lists/` + `${groupTitle}/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const firebaseArray = snapshot.val()
      if (firebaseArray !== "") {
        firebaseArray.map((lockerItem => {
          createListItem(listDiv, lockerItem["Locker Number"])
        }
        ))
      } animateList(listDiv)
    }
  }).catch((error) => {
    console.error(error);
  });
}

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
  const messageOptionsArr = ["cum to", "sashay toward", "bounce that booty to"]
  const randomMessageChoice = messageOptionsArr[Math.floor(Math.random() * messageOptionsArr.length)]
  let delay
  let template
  if (arr == "yes") {
    template = "There may be some rooms available. Please ask the front desk for assistance."
    messageArr.push(template)
    delay = 10000
  }
  else if (arr == "") {
    template = "There are currently no rooms available. Thanks for your patience!"
    messageArr.push(template)
    delay = 10000
  } else {
    arr.map(item => {
      let lockerNum = item["Locker Number"]
      let room = item["Room"]
      template = `${lockerNum}, your ${room} ${(room == "Non TV" || room == "Regular TV" || room == "Large TV") ? "room" : ""} is ready! Please ${randomMessageChoice} the front desk.`
      // unshift allows me to announce the locker number ready immediately
      messageArr.unshift(template)
    })
    delay = 10000
  }
  let count = 0
  timeout = setInterval(function cycleText() {
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
    message.innerText = messageArr[index]
    messageBoard.appendChild(message)
    return cycleText
  }(), delay)
  // double parentheses before interval, invokes immediately in addition to "return cycleText" above
}

// this function will animate the list if it exceeds its container size allowing viewer to see the whole list as it moves upwards
function animateList(roomType) {
  // all lists will have the same height dependent on viewheight of screen, so, this pulls
  // an array of each lists and gives me height of the first index list
  const listHeight = lists[0].getBoundingClientRect().height
  const containerHeight = roomType.getBoundingClientRect().height
  // in order to create a continuous flow of the list moving, I have to create a clone that moves at same speed
  if ((containerHeight + 45) >= listHeight) {
    roomType.style.paddingBottom = "80px"
    const clone = roomType.cloneNode(true)
    const parent = roomType.parentNode
    clone.style.counterReset = "locker-count 0"
    parent.append(clone)
    roomType.classList.add("animate-list-primary")
    clone.classList.add("animate-list-secondary")
  }
}
