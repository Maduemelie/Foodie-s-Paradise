const output = document.querySelector(".output");
const Foodie_chat = document.querySelector(".Foodie_chat");
const inputNum = document.getElementById("inputNum");
const btn = document.querySelector(".btn");
let arr;

//function to get the userId
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
}
//userId
const userId = getCookie("userId");
console.log(userId);

async function handleInput() {
  if (inputNum.value === "1") {
    arr = [];
    await showMenu();
    
    
    // arr = selectFoodItems(items);
  } else {
    if (inputNum.value === "99") {
      createOrder();
      if (arr.length === 0) {
        displayMessage("No order to place");
        btn.innerHTML = "Place order";
        btn.addEventListener("click", async () => {
          handleInput();
        });
        return;
      } else {
        displayMessageWrapper("Order placed");
      }
      const optionsDiv = document.querySelector(".options");
      optionsDiv.innerHTML = "";
    } 
    // handle other input numbers here
  }
  
  inputNum.value = "";
}

async function showMenu() {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const day = daysOfWeek[today.getDay()];

  // fetch the meal options for the current day
  let items = await fetch(`http://localhost:4000/api/v1/mealplan/${day}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId, // Send the user ID in a custom header
    },
  }).then((response) => response.json());
  console.log(items);
  let optionsDiv = document.createElement("div");
  optionsDiv.className = "options";
  Foodie_chat.appendChild(optionsDiv);
  const header = document.createElement("h4");
  header.textContent = `Here's the meal plan for ${day}:`;
  optionsDiv.appendChild(header);
  console.log(optionsDiv);
  // format the meal options for display
  const foodItems = Object.values(items.meals)
    .flat()
    .map((food, index) => {
      const option = document.createElement("label");
      option.className = "option";
      option.innerHTML = `
      <input type="checkbox" name="food-item" value="${food}">
      ${index + 1}. ${food}\n
    </br>
    `;
      optionsDiv.appendChild(option);
      return food;
    });
  const doneButton = document.createElement("button");
  doneButton.textContent = "Done";
  doneButton.className = "done-button";
  doneButton.addEventListener("click", () => {
    const selectedItems = selectFoodItems(foodItems);
    const messageToSend = `You have selected the following items:\n 
   \n </br>${selectedItems.join("</br>")}`;
  optionsDiv =  displayMessage(messageToSend);
    
  });
  Foodie_chat.appendChild(doneButton);

  function selectFoodItems(_items) {
    const selectedItems = [];
    const selectedCheckboxes = document.querySelectorAll(
      '[name="food-item"]:checked'
    );
    selectedCheckboxes.forEach((checkbox) => {
      selectedItems.push(checkbox.value);
    });
    Foodie_chat.removeChild(doneButton);
    arr = selectedItems;
    

    // console.log(selectedItems);
    return selectedItems;
  }
}

async function createOrder() {
  const data = {
    customerName: userId,
    orderItems: returnFoodName(arr),
    totalPrice: returnFoodPrice(arr),
  };
  console.log(data.customerName);
  console.log(data.orderItems);
  console.log(data.totalPrice);

  const order = await fetch("http://localhost:4000/api/v1/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId, // Send the user ID in a custom header
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
    const optionsDiv = document.querySelector(".options");
    Foodie_chat.removeChild(optionsDiv)
  return order;
  
}


//function to display message
function displayMessage(message) {
  const optionsDiv = document.querySelector(".options");
  optionsDiv.innerHTML = message;
}
function displayMessageWrapper(message, targetElement = document.body) {
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.innerText = message;
  targetElement.appendChild(messageElement);

  setTimeout(() => {
    targetElement.removeChild(messageElement);
  }, 5000);
}

//Function to return food name
function returnFoodName(arr) {
  const result = arr.map((string) => string.split("-")[0].trim());
  return result;
}
//funtion to return total food price
function returnFoodPrice(arr) {
  const result = arr.map((string) => Number(string.split("- $")[1].trim()));
  const totalPrice = result.reduce((accumulator, currentItem) => {
    return accumulator + currentItem;
  }, 0);
  return totalPrice;
}
