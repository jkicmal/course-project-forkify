import axios from "axios";
import {key, food2forkURI} from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const result = await axios(`${food2forkURI}search?key=${key}&q=${this.query}`);
      this.recipes = result.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}
