import SimpleLightbox from 'simplelightbox/dist/simple-lightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios');

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const formRef = document.querySelector('#search-form');
const {
  elements: { searchQuery },
} = formRef;

searchQuery.style.padding = '8px';
searchQuery.style.fontSize = '16px';
searchQuery.style.height = '36px';
searchQuery.style.border = 'none';
searchQuery.style.borderRadius = '4px 0 0 4px';

const btnRef = searchQuery.nextElementSibling;
btnRef.style.width = '36px';
btnRef.style.border = 'none';
btnRef.style.borderRadius = '0 4px 4px 0';
