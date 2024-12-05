import View from './View';
import previewView from './previewView';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errMsg =
    'there is no bookmark yet, find a delicious recipe and bookmark it ;)';

  addHandlerBookmark(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup(data) {
    return previewView._generateMarkup(data);
  }
}

export default new bookmarkView();
