const output = document.querySelector(".output");
const outputContainer = document.querySelector(".output-container");
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

async function handleInput() {
  if (inputNum.value === "1") {
    showMenu();

    btn.addEventListener("click", async () => {
      const items = await showMenu();
      arr = selectFoodItems(items);
    });
  } else {
    if (inputNum.value === "99") {
      if (arr.length === 0) {
        displayMessage("No order to place");
        btn.innerHTML = "Place order";
        btn.addEventListener("click", async () => {
          handleInput();
        });
      } else  {
        const order = createOrder();
        if (!order) {
          displayMessage("Server error");
        } else {
          displayMessage("Order placed");
        }
      }
    }
    // handle other input numbers here
  }
  inputNum.value = "";
}

// A function to display the restaurant menu
// async function showMenu() {
//   const daysOfWeek = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const today = new Date();
//   const day = daysOfWeek[today.getDay()];

//   let items = await fetch(`http://localhost:4000/api/v1/mealplan/${day}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-User-Id': userId, // Send the user ID in a custom header
//     },
//   }).then(
//     (response) => response.json()
//   );
//   // console.log(items);
//   items = Object.values(items.meals)
//     .flat()
//     .map((food, index) => `${index + 1}. ${food}`);

//   const message = `Here's the meal plan for ${day}:\n${items.join("\n")}`;
//   displayMessage(message);
//   btn.innerHTML = "Select meal";
//   return items;
// }
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
  let items = await fetch(`http://localhost:4000/api/v1/mealplan/${day}`).then(
    (response) => response.json()
  );
  console.log(items);
  // format the meal options for display
  items = Object.values(items.meals)
    .flat()
    .map((food, index) => `${index + 1}. ${food}\n`);

  // display the meal options to the user
  const message = `Here's the meal plan for ${day}:\n ${items.join("\n")}`;
  displayMessage(message);
  btn.innerHTML = "Select meal";

  return items;
}

async function createOrder() {


  const data = {
    customerName: userId,
    orderItems: returnFoodName(arr),
    totalPrice: returnFoodPrice(arr),
  };
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
  return order;
}
//function to select food from the mealplan
//
//
function selectFoodItems(items) {
  const selectedItems = [];
  let selection;
  while (selection !== "done") {
    selection = window.prompt(
      `Enter the number of the food item you would like to select, or type "done" to finish:\n ${items.join(
        "\n"
      )}`
    );
    if (selection === null || selection === "") {
      return selectedItems;
    } else if (selection !== "done") {
      // check if the selection is valid
      const selectedFood = items[parseInt(selection) - 1];
      if (selectedFood === undefined) {
        // display error message and continue loop
        const errorMessage = `Invalid selection: ${selection}. Please select a number between 1 and ${items.length}.`;
        displayMessage(errorMessage);
        continue;
      }
      // const selectedFood = items[parseInt(selection) - 1];
      selectedItems.push(selectedFood);
    }

    const messageToSend = `You have selected the following items:\n${selectedItems.join(
      " "
    )}`;
    displayMessage(messageToSend);
    console.log(selectedItems);
    btn.style.display = "none";
  }

  return selectedItems;
}

//function to display message
function displayMessage(message) {
  output.innerText = message;
}

function returnFoodName(arr) {
  const result = arr.map((string) => string.split(".")[1].trim());
  const finalResult = result.map((string) => string.split("-")[0].trim());
  return finalResult;
}

function returnFoodPrice(arr) {
  const result = arr.map((string) => string.split(".")[1].trim());
  let finalResult = result.map((string) =>
    Number(string.split("- $")[1].trim())
  );
  const totalPrice = finalResult.reduce((accumulator, currentItem) => {
    return accumulator + currentItem;
  }, 0);
  return totalPrice;
}
