const output = document.querySelector(".output");
const outputContainer = document.querySelector(".output-container");
const inputNum = document.getElementById("inputNum");
const btn = document.getElementById("btn");
let arr;
let user = prompt("Please enter your name:");

async function handleInput() {
  if (inputNum.value === "1") {
    showMenu();
    const newBtn = createElement(
      "button",
      "selectmeal",
      outputContainer,
      "btnMeals",
      {
        padding: "10px 20px",
        border: "none",
        background: "#333",
        color: "#fff",
        borderRadius: "5px",
        fontSize: "12px",
      }
    );
    newBtn.addEventListener("click", async () => {
      // console.log("clicked");
      const items = await showMenu();
      arr = selectFoodItems(items);
    });
  } else {
    if (inputNum.value === "99") {
      createOrder();
      // console.log("here");
    }
    // handle other input numbers here
  }
  inputNum.value = "";
}

// A function to display the restaurant menu
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

  let items = await fetch(`http://localhost:4000/api/v1/mealplan/${day}`).then(
    (response) => response.json()
  );
  // console.log(items);
  items = Object.values(items.meals)
    .flat()
    .map((food, index) => `${index + 1}. ${food}`);

  const message = `Here's the meal plan for ${day}:\n${items.join("\n")}`;
  displayMessage(message);

  return items;
}

async function createOrder() {
  // const items = await showMenu();

  const data = {
    customerName: user,
    orderItems: splitFoodName(arr),
  };
  console.log(data.orderItems);

  await fetch("http://localhost:4000/api/v1/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}
//function to select food from the mealplan
//
//
function selectFoodItems(items) {
  const selectedItems = [];
  let selection;
  while (selection !== "done") {
    selection = window.prompt(
      `Enter the number of the food item you would like to select, or type "done" to finish:\n${items.join(
        "\n"
      )}`
    );
    if (selection === null || selection === "") {
      return selectedItems;
    } else if (selection !== "done") {
      const selectedFood = items[parseInt(selection) - 1];
      selectedItems.push(selectedFood);
    }

    const messageToSend = `You have selected the following items:\n${selectedItems.join(
      "\n"
    )}`;
    displayMessage(messageToSend);
    console.log(selectedItems);
  }

  return selectedItems;
}

//function to display message
function displayMessage(message) {
  output.innerText = message;
}

function createElement(tagName, textContent, parentElement, className, styles) {
  const element = document.createElement(tagName);
  element.innerText = textContent;
  element.classList.add(className);
  // add the specified styles to the element
  for (const [property, value] of Object.entries(styles)) {
    element.style[property] = value;
  }

  parentElement.appendChild(element);
  return element;
}

function splitFoodName(arr) {
  const result = arr.map((string) => string.split(".")[1].trim());
  return result;
}
