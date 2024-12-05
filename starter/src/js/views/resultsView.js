import View from './View';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errMsg = 'No results for this query . please try another :)';

  _generateMarkup(data) {
    const markup = data
      .map(recipe => this._generateMarkupPreview(recipe))
      .join('');
    return markup;
  }

  _generateMarkupPreview(data) {
    const location = document.location.hash.slice(1);

    return `
         <li class="preview">
            <a class="preview__link ${
              location === data.id ? 'preview__link--active' : ''
            }" href="#${data.id}">
              <figure class="preview__fig">
                <img src="${data.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${data.title}</h4>
                <p class="preview__publisher">${data.publisher}</p>
              </div>
            </a>
          </li>
    `;
  }
}

export default new ResultsView();
