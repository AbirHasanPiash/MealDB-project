// Fetch meal data based on search query
async function handleSearch(searchValue) {
  try {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    document.querySelector(".detail-container").innerHTML = ""; // clear previous details
    document.querySelector(".card-container").innerHTML = ""; // Clear previous results

    if (!data.meals) {
      displaySorry();
    } else {
      displayCard(data.meals);
    }
  } catch (error) {
    console.error("Error fetching meal data:", error);
  }
}

// Display meal cards dynamically
function displayCard(meals) {
  const cardContainer = document.querySelector(".card-container");
  meals.forEach((meal) => {
    const div = document.createElement("div");
    div.className = "card";
    div.id = meal.idMeal;
    div.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
      `;
    cardContainer.appendChild(div);
  });
}

// Show "Not Found" message
function displaySorry() {
  const cardContainer = document.querySelector(".card-container");
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
      <img src="./sorry.png" alt="Not Found">
      <h3>Not Found</h3>
  `;
  cardContainer.appendChild(div);
}

// Fetch details when a meal card is clicked
async function handleDetails(id) {
  try {
    const detailContainer = document.querySelector(".detail-container");
    detailContainer.innerHTML = ""; // Clear previous details
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayDetails(data.meals[0]);
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}

// Display meal details with ingredients
function displayDetails(meal) {
  const detailContainer = document.querySelector(".detail-container");
  let ingredientsList = "";
  const div = document.createElement("div");

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<li>${ingredient}</li>`;
    }
  }

  div.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
      <h4>Ingredients:</h4>
      <ul>${ingredientsList}</ul>
  `;
  div.classList.add("detail-card");
  detailContainer.appendChild(div);
}

// Event listener for searching
document.getElementById("search-button").addEventListener("click", () => {
  const searchValue = document.getElementById("search-value").value.trim();
  if (searchValue !== "") handleSearch(searchValue);
});

// Allow pressing "Enter" for search
document
  .getElementById("search-value")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const searchValue = document.getElementById("search-value").value.trim();
      if (searchValue !== "") handleSearch(searchValue);
    }
  });

// Event delegation for card clicks
document.querySelector(".card-container").addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) {
    handleDetails(card.id);
  }
});
