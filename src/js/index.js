import Search from "./models/Search";

/* Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const search = new Search("pizza");
console.log(search);
search.getResults();
