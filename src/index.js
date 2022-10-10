import SimpleLightbox from 'simplelightbox/dist/simple-lightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

import Notiflix from 'notiflix';
Notiflix.Notify.init({
  position: 'right-top',
  fontSize: '16px',
});
import 'notiflix/dist/notiflix-3.2.5.min.css';

const PIXABAY_KEY = '13063741-5515a23bced967f7d7ac2fd10';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = true;
const API = 'https://pixabay.com/api/';
const PER_PAGE = 40;
const BODY_PADDING = 8;
const GRID_MARGIN = 10;

let currentPage = 1;
let pagesCount = 1;

const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('#search-form');
const {
  elements: { searchQuery },
} = formRef;

searchQuery.style.padding = '8px';
searchQuery.style.fontSize = '16px';
searchQuery.style.height = '36px';
searchQuery.style.border = 'none';
searchQuery.style.borderRadius = '4px 0 0 4px';
searchQuery.style.outline = 'none';

const btnRef = searchQuery.nextElementSibling;
btnRef.style.width = '36px';
btnRef.style.border = 'none';
btnRef.style.borderRadius = '0 4px 4px 0';
btnRef.style.cursor = 'pointer';

async function getGallery() {
  try {
    const searchParams = new URLSearchParams({
      key: PIXABAY_KEY,
      q: searchQuery.value.split(' ').join('+'),
      image_type: IMAGE_TYPE,
      orientation: ORIENTATION,
      safesearch: SAFESEARCH,
      page: currentPage,
      per_page: PER_PAGE,
    });

    console.log(`${API}?${searchParams}`);

    const response = await axios.get(`${API}?${searchParams}`);

    console.log(response.status);

    if (response.status !== 200) {
      throw new Error(response.status);
    }
    if (response.data.hits.length === 0) {
      throw new Error('Sorry, there are no images matching your search query. Please try again.');
    }
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

function normalizedQuery(symbol) {
  searchQuery.value = searchQuery.value.trim().toLowerCase();
  if (symbol === ' ') searchQuery.value += ' ';
}

function renderImages(images) {
  let markup = '';

  console.log('Tags: ');
  markup = images
    .map(
      img => `
	<a class="photo-card">
  <img src="${img.webformatURL}" alt='${img.tags
        .split(', ')
        .join(' ')}" loading="lazy" class="photo-img" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${img.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${img.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${img.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${img.downloads}</span>
    </p>
  </div>
	</a>
	`
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

searchQuery.addEventListener('input', event => {
  normalizedQuery(event.data);
});

formRef.addEventListener('submit', event => {
  event.preventDefault();

  pagesCount = 1;
  currentPage = 1;

  getGallery().then(images => {
    console.log(images);
    let pagesCount = Math.trunc(images.totalHits / PER_PAGE);
    pagesCount = images.totalHits % PER_PAGE === 0 ? pagesCount : pagesCount + 1;
    renderImages(images.hits);
  });
});
