import {request} from "./network.js";
import store from "./store/index.js";
import ContentComponent from "./content.js";

 export default class ContentItemsComponent extends ContentComponent {
  constructor() {
    super();
    this.anchor = document.querySelector('.content__main-results-list');
    console.log( this.anchor );
    this.data = request.readTodosRequest();

    const input = document.getElementById('add-item-input');
    const submit = document.getElementById('add-item-button');
    const handleClick = event => {
      event.preventDefault();
      let value = input.value.trim();
      if (value.length) {
        console.log( value );
        store.dispatch('addItem', {text: value, createDate: Date.now(), completed: false});
        input.focus();
        input.value = '';
      }
    };
    submit.addEventListener('click', handleClick);
  }

  onPropsChange(value) {
    this.render(value);

  }

  set data(value) {
    console.log( value );
    value.then(obj => {
      this._data = obj;
      console.log( this._data );
      this.onPropsChange(this._data);
      console.log( this._data );
    });
  }

  get data() {
    return this._data;
  }

  render(value) {
    console.log( value );
    console.log( store.props );
    console.log( 'items render' );

    if (store.props.length === 0) {
      this.anchor.innerHTML = "No todo's";
      return;
    }

    let listItems = `
      <ul>
        ${
          store.props.map(todoItem => `
            <li class="content__main-results-list-item">
              <p class="content__main-results-list-item-text">${todoItem.text}</p>
              <div class="content__main-results-list-item-buttons">
                <a class="content__main-results-list-item-buttons-done done-button"></a>
                <a class="content__main-results-list-item-buttons-delete delete-button"></a>
                <a class="content__main-results-list-item-buttons-edit edit-button"></a>
              </div>
            </li>
          `).join('')
        }
      </ul>
    `;
    // this.anchor.innerHTML = '';
    this.anchor.innerHTML = `${listItems}`;
    this.setupListeners();
  }

  setupListeners() {
    this.anchor.querySelectorAll('.delete-button').forEach((button, id) =>
      button.addEventListener('click', () =>
        store.dispatch('removeItem', { id })
      )
    )
  }
}
