// Models
import Search from "./models/Search";
import Recipe from "./models/Recipe";

// Views
import {elements, renderLoader, clearLoader} from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";

/* Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

// SEARCH CONTROLLER
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2) New search obcject and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.recipes);
    } catch (error) {
      clearLoader();
      console.error(error);
      alert("Error processing search");
    }
  }
};

// SEARCH EVENTS
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.recipes, goToPage);
  }
});

// RECIPE CONTROLLER
const controlRecipe = async () => {
  // get id from url
  const id = window.location.hash.replace("#", "");
  if (id) {
    // prepare ui for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected search item
    if (state.search) searchView.highlighSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);
    window.r = state.recipe;

    try {
      // get recipe data
      await state.recipe.getRecipe();

      // calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();

      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
      console.log(state.recipe);
    } catch (error) {
      console.error(error);
      alert("Error processing recipe");
    }
  }
};

["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Decrease button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  }
  console.log(state.recipe);
});
