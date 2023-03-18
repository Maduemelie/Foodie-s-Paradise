// const output = document.querySelector(".output");
const Foodie_chat = document.querySelector(".Foodie_chat");
const inputNum = document.getElementById("inputNum");
// const btn = document.querySelector(".btn");
const optionsDiv = document.querySelector(".options");
// console.log(btn);
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
    const optionsDiv = document.querySelector(".options");
    if (optionsDiv) {
      optionsDiv.remove();
    }

    await showMenu();
  } 
    if (inputNum.value === "99") {
      createOrder();
      
  }
  if (inputNum.value === "98") {
    await getOrderHistory();
  }
  if (inputNum.value === "97") {
    await getCurrentOrder();
  }
  if (inputNum.value === "0") {
    await cancelOrder();
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
  let items;
  try {
    const response = await fetch(`http://localhost:4000/api/v1/mealplan/${day}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId, // Send the user ID in a custom header
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch menu items.");
    }
    items = await response.json();
  } catch (error) {
    console.error(error);
    alert("Failed to fetch menu items. Please try again later.");
    return;
  }
  
  let optionsDiv = document.createElement("div");
  optionsDiv.className = "options";
  Foodie_chat.appendChild(optionsDiv);
  const header = document.createElement("h4");
  header.textContent = `Here's the meal plan for ${day}:`;
  optionsDiv.appendChild(header);

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
    if (selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }
    const messageToSend = `You have selected the following items:\n </br> Enter 99 to checkout</br>
   \n </br>${selectedItems.join("</br>")}`;
    let messageElement = createElement("message", messageToSend);
    Foodie_chat.appendChild(messageElement);
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

    optionsDiv.style.display = "none";

    // console.log(selectedItems);
    return selectedItems;
  }
}


async function getOrderHistory() {
  await fetch(`http://localhost:4000/api/v1/order`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId, // Send the user ID in a custom header
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const messageElement= document.querySelector(".message");
  if (messageElement) {
    Foodie_chat.removeChild(messageElement);
  }
      data.forEach((order) => {
        // const orderId= order.id;
        const items = order.items
          .map((item) => `</br>${item.name} ($${item.price})`)
          .join(",");
        const total = `$${order.total.toFixed(2)}`;
        const status = order.status;

        const messageToSend = `</br>\nCustomer Name: ${userId}</br>\nItems: ${items}</br>\nTotal: ${total}</br>\nStatus: ${status}`;
        let messageElement = createElement("message", messageToSend);
        Foodie_chat.appendChild(messageElement);
      });

      // console.log(data)
      // console.log(data[0].items)
      // console.log(data[0].items[0].price)
    });
}

async function getCurrentOrder() {
  let currentOrder = await fetch(
    `http://localhost:4000/api/v1/order/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId, // Send the user ID in a custom header
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      let messageElement= document.querySelector(".message");
  if (messageElement) {
    Foodie_chat.removeChild(messageElement);
  }
      const id = data.id;
      const items = data.items
        .map((item) => `${item.name} ($${item.price})`)
        .join(", ");
      const total = `$${data.total.toFixed(2)}`;
      console.log(id, items, total)
       const messageToSend = `your current order!</br> name: ${id} </br> Items: ${items}.</br> Total price: ${total}.`;
       messageElement = createElement("message", messageToSend);
      Foodie_chat.appendChild(messageElement);

      console.log(data);
      console.log(data.id);
      console.log(data.items[0]);
    });
}


async function cancelOrder() {
  // const data = {
  //   customerName: userId,
  // };
  const response = await fetch(`http://localhost:4000/api/v1/order/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId, // Send the user ID in a custom header
    },
    // body: JSON.stringify(data),
  });
  const data = await response.json();
  const message = data.message;

  displayMessageWrapper(message);
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

  const response = await fetch("http://localhost:4000/api/v1/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId, // Send the user ID in a custom header
    },
    body: JSON.stringify(data),
  });
  const messageElement= document.querySelector(".message");
  if (messageElement) {
    Foodie_chat.removeChild(messageElement);
  }
  try {
    if (response.ok) {
      const order = await response.json();
      console.log(order)
      // display order items and total price
      const messageToSend = `Order placed.</br> Total price: $${order.data.totalPrice}`;
      let messageElement = createElement("message", messageToSend);
      Foodie_chat.appendChild(messageElement);
    } else {
      throw new Error("Failed to place order");
    }
  } catch (error) {
    // if there was an error creating the order, display an error message
    let messageElement = createElement(
      "message",
      "There was an error creating your order. Please try again later."
    );
    Foodie_chat.appendChild(messageElement);
    console.error(error);
  } finally {
    // remove the options from the screen
    const optionsDiv = document.querySelector(".options");
    if (optionsDiv) {
      Foodie_chat.removeChild(optionsDiv);
    }
}
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

  // Add the CSS rules to center the message
  messageElement.style.position = "fixed";
  messageElement.style.top = "50%";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translate(-50%, -50%)";

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
// function to create new button
function createButton(className, content) {
  const button = document.createElement("button");
  button.className = `btn ${className}`;
  button.innerHTML = content;
  return button;
}

// function to create new element
function createElement(className, content) {
  const element = document.createElement("div");
  element.className = className;
  element.innerHTML = content;
  return element;
}
