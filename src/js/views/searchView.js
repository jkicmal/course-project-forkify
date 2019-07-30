import {elements} from "./base";
export const getInput = () => elements.searchInput.value;
const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

export const highlighSelected = id => {
  const resultsArray = Array.from(document.querySelectorAll(".results__link"));
  resultsArray.forEach(el => {
    el.classList.remove("results__link--active");
  });
  document.querySelector(`.results__link[href="#${id}"]`).classList.add("results__link--active");
};

// 'Pasta with tomato and spinach'
/*
acc: 0 / acc + curr.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + curr.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + curr.length = 15 / newTitle = ['Pasta', 'with', 'tomato'] - limit reached
acc: 15 / acc + curr.length = 18 / newTitle = ['Pasta', 'with', 'tomato'] - limit reached
acc: 18 / acc + curr.length = 24 / newTitle = ['Pasta', 'with', 'tomato'] - limit reached
*/
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, curr) => {
      if (acc + curr.length <= limit) {
        newTitle.push(curr);
      }
      return acc + curr.length;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    button = createButton(page, "next");
  } else if (page < pages) {
    button = `
        ${createButton(page, "prev")}
        ${createButton(page, "next")}
    `;
  } else if (page === pages && pages > 1) {
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" 
    data-goto=${type === "prev" ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
        </svg>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    </button>
`;

export const renderResults = (recipes, page = 2, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(recipe => {
    renderRecipe(recipe);
  });

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
export const clearInput = () => {
  elements.searchInput.value = "";
};
export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};
