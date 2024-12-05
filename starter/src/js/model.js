import { API_URL, RES_PER_PAGE, KEY } from './config';
import { getJSON, AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookMark: [],
};

// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(API_URL + id);
    if (!data) return;

    return makeRecipeObject(data);

    // console.log(recipe);
  } catch (error) {
    throw error;
    // console.error(error);
  }
};

const makeRecipeObject = function (data) {
  const { recipe } = data.data;
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
  if (state.bookMark.some(bookmark => bookmark.id === recipe.id)) {
    state.recipe.bookMarked = true;
  } else state.recipe.bookMarked = false;
  return state.recipe;
};

export const loadSearch = async function (query) {
  try {
    state.search.query = query;
    res = await AJAX(`${API_URL}?search=${query}`);

    const { recipes } = res.data;

    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
  } catch (error) {
    console.error(error);
  }
};

export const resultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    const newQuantity = (ing.quantity * newServings) / state.recipe.servings;
    ing.quantity = newQuantity;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMark));
};

export const addBookmark = function (recipe) {
  state.bookMark.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  console.log(state.bookMark);

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const bookmarkIndex = state.bookMark.findIndex(
    bookmark => bookmark.id === id
  );
  state.bookMark.splice(bookmarkIndex, 1);
  if (id === state.recipe.id) state.recipe.bookMarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookMark = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image, // TODO
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = makeRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// const data = [
//   {
  //     publisher: 'Closet Cooking',
  //     image_url:
  //       'http://forkify-api.herokuapp.com/images/BBQChickenPizzawithCauliflowerCrust5004699695624ce.jpg',
//     title: 'Cauliflower Pizza Crust (with BBQ Chicken Pizza)',
//     id: '664c8f193e7aa067e94e8706',
//   },
//   {
//     publisher: 'A Spicy Perspective',
//     image_url:
//       'http://forkify-api.herokuapp.com/images/IMG_4351180x1804f4a.jpg',
//     title: 'Greek Pizza',
//     id: '664c8f193e7aa067e94e8438',
//   },
//   {
//     publisher: 'All Recipes',
//     image_url: 'http://forkify-api.herokuapp.com/images/391236ba85.jpg',
//     title: 'Veggie Pizza',
//     id: '664c8f193e7aa067e94e845a',
//   },
//   {
//     publisher: 'My Baking Addiction',
//     image_url:
//       'http://forkify-api.herokuapp.com/images/PizzaDip21of14f05.jpg',
//     title: 'Pizza Dip',
//     id: '664c8f193e7aa067e94e840d',
//   },
// ];
