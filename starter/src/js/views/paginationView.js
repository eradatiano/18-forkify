import icons from '../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errMsg = 'there is an error';
  _curPage = this._data

  addHandlerPagination(handeler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest('.btn--inline')
      if (!btn) return;
      const gotoPage = +btn.dataset.goto
      handeler(gotoPage)
      // console.log(btn.dataset.goto);
    })
  }

  _generateMarkup(data) {
    const pagesNum = Math.ceil(data.results.length / data.resultPerPage);

    // look at all senarios
    if (pagesNum > 1) {
      // first page with others
      if (data.page === 1) {
        return this._generateBtnMarkup('next');
      }

      // last page && pagesNum > 1
      if (data.page === pagesNum) {
        return this._generateBtnMarkup('prev');
      }
      // other pages
      else {
        return (
          this._generateBtnMarkup('prev') + this._generateBtnMarkup('next')
        );
      }
      // first page no others
    }
  }

  _generateBtnMarkup(to) {
    if (to === 'next')
      return `
        <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${this._data.page + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    if (to === 'prev')
      return `
        <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${this._data.page - 1}</span>
        </button>
      `;
  }
}

export default new PaginationView();
