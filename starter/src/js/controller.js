import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchResultView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

// Controller for search results

// Controller for loading recipes
const controlRecipes = async function () {
  try {
    // Get recipe id
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Render spinner
    recipeView.renderSpinner();
    // selected stayle for a result
    resultsView.update(model.resultsPerPage());
    // load recipe
    const recipe = await model.loadRecipe(id);
    if (!recipe) return;
    // Update bookmarks view
    bookmarkView.update(model.state.bookMark);
    // render recipe
    recipeView.render(recipe);
  } catch (error) {
    recipeView.renderErorr();
    console.error(error);
  }
};

// Controller for rendering list of recipes
const controlSearch = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    // Render spinner
    resultsView.renderSpinner();
    // Load search results
    await model.loadSearch(query);
    // Render results
    resultsView.render(model.resultsPerPage(1));

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goto) {
  // Render results
  resultsView.render(model.resultsPerPage(goto));

  // Render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = async function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or delete bookmark
  if (!model.state.recipe.bookMarked) {
    model.addBookmark(model.state.recipe);
    console.log('add');
  } else model.deleteBookmark(model.state.recipe.id);

  // Update recipeView
  recipeView.update(model.state.recipe);
  // Render bookmarksView
  bookmarkView.render(model.state.bookMark);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookMark);
};

const controlAddRecipe = async function (recipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner()
    // Upload recipe
    await model.uploadRecipe(recipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Render success message
    addRecipeView.renderMessage();
    // Close form window
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderErorr(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerBookmark(controlBookmark);
  recipeView.addHandlerRecipe(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
