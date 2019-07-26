// Models
import Search from "./models/Search";
import Recipe from "./models/Recipe";

// Views
import {elements, renderLoader, clearLoader} from "./views/base";
import * as searchView from "./views/searchView";

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
      console.log(state.recipe);
    } catch (error) {
      console.error(error);
      alert("Error processing recipe");
    }
  }
};

["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));
