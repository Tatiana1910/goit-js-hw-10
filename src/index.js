import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(evt) {
  let value = evt.target.value.trim();

  if (!value) {
    listEl.innerHTML = '';
    return;
  }

  fetchCountries(value)
    .then(resp => {
      if (resp.length === 1) {
        listEl.innerHTML = countryCardMarkup(resp);
        return;
      }

      if (resp.length >= 2 && resp.length <= 10) {
        listEl.innerHTML = countriesListMarkup(resp);
        return;
      }

      if (resp.length >= 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err => {
      console.log(err);
      Notiflix.Notify.failure('Oops, there is no country with that name');
      listEl.innerHTML = '';
      return;
    });
}

function countriesListMarkup(arr) {
  return arr
    .map(({ name, flags }) => {
      return `<li class="country-elem">
      <img class="country-flag" src="${flags.svg}" alt="flag"</img>
        <p class="country-name">${name.official}</p>
      </li>`;
    })
    .join('');
}

function countryCardMarkup(arr) {
  return arr
    .map(({ name, flags, capital, population, languages }) => {
      let langs = Object.values(languages).join(', ');

      return `<li class="card-element">
        <div class="contry-thumb">
          <img class="country-flag" src="${flags.svg}" alt="flag"</img>
          <h2 class="country-header">${name.official}</h2>
        </div>
        <p><span class="country-bold">Capital: </span>${capital}</p>
        <p><span class="country-bold">Population: </span>${population}</p>
        <p><span class="country-bold">Languages: </span>${langs}</p>
      </li>`;
    })
    .join('');
}
