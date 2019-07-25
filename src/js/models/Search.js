import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = "56e8e694b2c461c989e5172ebb4d0507";
    try {
      const result = await axios(
        `https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.recipes = result.data.recipes;
      // console.log(this.recipes);
    } catch (error) {
      alert(error);
    }
  }
}
