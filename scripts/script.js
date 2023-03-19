'use strict';

///////////////////////////////////////
// Page elements

let servicesBtnActive = document.querySelector('.services__nav-btn--selected');
let modalCloseTimer;

const header = document.querySelector('.header');
const nav = document.querySelector('.main-nav__container');
const progressBar = document.querySelector('.main-nav__progress-bar');
const servicesCards = document.querySelector('.cards');
const servicesNav = document.querySelector('.services__nav');
const carouselCards = document.querySelectorAll('.carousel__card-container');
const carouselBtnRight = document.querySelector('.carousel-btn--right');
const carouselBtnLeft = document.querySelector('.carousel-btn--left');
const signUpForm = document.querySelector('form');
const firstNameInput = document.querySelector('.form-input--first-name');
const lastNameInput = document.querySelector('.form-input--last-name');
const emailInput = document.querySelector('.form-input--email');
const footerSpanYear = document.querySelector('.footer-copyright-year');
const modal = document.querySelector('.modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const modalOverlay = document.querySelector('.overlay');

///////////////////////////////////////
// Database fetching links

const DB_PROJECTS =
  'https://http-fetch-react-default-rtdb.europe-west1.firebasedatabase.app/projects.json';

// UNSAFE //
const DB_USERSDATA =
  'https://http-fetch-react-default-rtdb.europe-west1.firebasedatabase.app/usersdata.json';

///////////////////////////////////////
// Helpers

const randomize = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'Decemeber',
};

///////////////////////////////////////
// Progress bar

window.addEventListener('scroll', () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / totalHeight) * 100;
  progressBar.style.width = `${progress}%`;
});

///////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('link')) {
    const hoveredLink = e.target;
    const navLinks = e.target
      .closest('.main-nav__links')
      .querySelectorAll('.link');
    const navLogo = document.querySelector('.main-nav__logo');

    navLinks.forEach(link => {
      if (link !== hoveredLink) {
        link.style.opacity = this.hoverOpacity;
      }
    });
    navLogo.style.opacity = this.hoverOpacity;
  }
};

nav.addEventListener('mouseover', handleHover.bind({ hoverOpacity: 0.5 }));
nav.addEventListener('mouseout', handleHover.bind({ hoverOpacity: 1 }));

///////////////////////////////////////
// Page navigation

document.querySelector('.main-nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('link')) {
    const sectionId = e.target.getAttribute('href');
    const selectedSection = document.querySelector(sectionId);
    const selectedSectionPosition = selectedSection.getBoundingClientRect().top;
    const navHeight = -nav.getBoundingClientRect().height;
    const Y_OFFSET = sectionId === '#section--blog' ? 50 : -50;

    const yCord =
      selectedSectionPosition + navHeight + window.pageYOffset + Y_OFFSET;

    window.scrollTo({
      top: yCord,
      behavior: 'smooth',
    });
  }
});

///////////////////////////////////////
// Sections show-up

const allSections = document.querySelectorAll('section');

const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section-hidden');
  observer.unobserve(entry.target);
};

const sectionObs = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  section.classList.add('section-hidden');
  sectionObs.observe(section);
});

///////////////////////////////////////
// Sticky navigation

const navObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
};

const stickyNavHandler = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
    progressBar.classList.remove('hidden');
  } else {
    nav.classList.remove('sticky');
    progressBar.classList.add('hidden');
  }
};

const navigationObserver = new IntersectionObserver(
  stickyNavHandler,
  navObserverOptions
);

navigationObserver.observe(header);

///////////////////////////////////////
// Project data fetching

const fetchProjects = async () => {
  const response = await fetch(DB_PROJECTS);
  const projectsData = await response.json();
  const projectsKeys = Object.keys(projectsData);
  const projectsDataSlice = {
    ...projectsData,
    topSelection: [],
  };
  projectsKeys.forEach(key =>
    projectsDataSlice.topSelection.push(projectsData[key][0])
  );
  return projectsDataSlice;
};

const projectsData = fetchProjects();

///////////////////////////////////////
// Projects rendering

const renderProjects = async (projectType = 'topSelection') => {
  const projects = await projectsData;
  let renderedProjects = ``;

  projects[projectType].forEach(project => {
    const cardType = project.type === 'architecture' ? 'card--2' : 'card--1';

    renderedProjects += `
    \n
    <div class="card ${cardType}">
    <img src="./svg/${project.type}.svg" aria-hidden="true" />
    <div class="${cardType}__desc">
      <h2 class="${cardType}__desc-heading">${project.title}</h2>
      <p class="${cardType}__desc-paragraph">
        ${project.description}
      </p>
    </div>
    </div>
    `;
    servicesCards.innerHTML = renderedProjects;
  });
};

renderProjects();

servicesNav.addEventListener('click', e => {
  e.preventDefault();
  if (
    !e.target.classList.contains('services__nav-btn') ||
    e.target.classList.contains('services__nav-btn--selected')
  )
    return;
  servicesBtnActive.classList.remove('services__nav-btn--selected');
  const projectType = e.target.dataset.type;
  e.target.classList.add('services__nav-btn--selected');
  servicesBtnActive = e.target;
  renderProjects(projectType);
});

///////////////////////////////////////
// Carousel processing

let curSlide = 0;
const lastSlide = carouselCards.length;

const scrollSlide = () => {
  carouselCards.forEach((card, i) => {
    card.style.transform = `translateX(${120 * (i - curSlide * 2)}%)`;
  });
};

const nextSlide = () => {
  ++curSlide;
  if (curSlide === lastSlide / 2) curSlide = 0;
  scrollSlide();
};

const prevSlide = () => {
  --curSlide;
  if (curSlide === -1) curSlide = lastSlide / 2 - 1;
  scrollSlide();
};

carouselCards.forEach((card, i) => {
  card.style.transform = `translateX(${120 * i}%)`;
});

carouselBtnRight.addEventListener('click', nextSlide);
carouselBtnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

///////////////////////////////////////
// Blogs show-up

const revealBlogs = entries => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.style.animation = 'show-blog 1s';
    entry.target.style.opacity = 1;
  } else {
    entry.target.style.opacity = 0;
    entry.target.style.animation = '';
  }
};

const blogsSectionObs = new IntersectionObserver(revealBlogs, {
  root: null,
  threshold: 0,
});

const blogsSection = document.querySelector('.blogs');
blogsSectionObs.observe(blogsSection);

///////////////////////////////////////
// Modal initialization

const createParticles = particlesNum => {
  for (let i = 0; i < particlesNum; i++) {
    const square = document.createElement('div');
    square.classList.add('fall-square');
    square.style.backgroundColor = `rgb(${randomize(0, 255)}, ${randomize(
      0,
      255
    )}, ${randomize(0, 255)})`;
    square.style.left = `${randomize(0, modalOverlay.offsetWidth)}px`;
    square.style.animationDelay = `${randomize(0, 3)}s`;
    square.style.animationDuration = `${randomize(4, 8)}s`;
    square.style.transform = `rotate(${randomize(0, 360)}deg)`;
    modalOverlay.appendChild(square);
  }
};

const openModal = () => {
  modal.classList.remove('invisible');
  modalOverlay.classList.remove('invisible');
  createParticles(30);
  clearTimeout(modalCloseTimer);
  modalCloseTimer = setTimeout(closeModal, 5000);
};

const closeModal = () => {
  modal.classList.add('invisible');
  modalOverlay.classList.add('invisible');
  // Particle cleanup on close
  document
    .querySelectorAll('.fall-square')
    .forEach(square => (square.style.display = 'none'));

  clearTimeout(modalCloseTimer);
};

modalOverlay.addEventListener('click', closeModal);
btnCloseModal.addEventListener('click', closeModal);

///////////////////////////////////////
// Modal date parsing

const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
const modalDate = `${months[currentMonth]} ${currentDay}`;

document.querySelector('.modal__date').textContent = modalDate;

///////////////////////////////////////
// Form validation

const postUserData = async userData => {
  const request = await fetch(DB_USERSDATA, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

const localStorageInit = () => {
  if (!localStorage.getItem('users'))
    localStorage.setItem('users', JSON.stringify([]));
};

const addToStorage = (storage, data) => {
  const selectedStorage = JSON.parse(localStorage.getItem(storage));
  selectedStorage.push(data);
  localStorage.setItem(storage, JSON.stringify(selectedStorage));
};

localStorageInit();

signUpForm.addEventListener('submit', e => {
  e.preventDefault();
  const nameRegex = /^[A-Z][a-z]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [firstNameError, lastNameError, emailError] =
    document.querySelectorAll('.form-input-error');

  const nameIsValid = nameRegex.test(firstNameInput.value);
  const lastNameIsValid = nameRegex.test(lastNameInput.value);
  const emailIsValid = emailRegex.test(emailInput.value);

  const formIsValid = nameIsValid && lastNameIsValid && emailIsValid;

  firstNameInput.classList[nameIsValid ? 'remove' : 'add']('input--invalid');
  firstNameError.classList[nameIsValid ? 'add' : 'remove']('hidden');

  lastNameInput.classList[lastNameIsValid ? 'remove' : 'add']('input--invalid');
  lastNameError.classList[lastNameIsValid ? 'add' : 'remove']('hidden');

  emailInput.classList[emailIsValid ? 'remove' : 'add']('input--invalid');
  emailError.classList[emailIsValid ? 'add' : 'remove']('hidden');

  if (formIsValid) {
    const userData = {
      id: Math.random().toFixed(6),
      userFirstName: firstNameInput.value,
      userLastName: lastNameInput.value,
      userEmail: emailInput.value,
    };
    addToStorage('users', userData);
    postUserData(userData);
    if (firstNameInput.value === 'Alex') openModal();
  }
});

///////////////////////////////////////
// Handling loading state

// const LOADING_TIMEOUT = 5000; // 5 seconds
const LOADING_TIMEOUT = 500; // testing

window.addEventListener('load', () => {
  const content = document.querySelector('.content');
  const loader = document.querySelector('.loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    content.classList.remove('hidden');
  }, LOADING_TIMEOUT);
});

///////////////////////////////////////
// Handling idle state

const IDLE_EVENT_LIST = ['click', 'scroll', 'selectionchange'];
// const IDLE_TIMEOUT = 60 * 1000; // 1 minute
const IDLE_TIMEOUT = 60 * 10000; // 10 minutes
// const IDLE_TIMEOUT = 2000; // testing

const resetTimer = () => {
  clearTimeout(timer);
  timer = setTimeout(showAlert, IDLE_TIMEOUT);
};

const showAlert = () => {
  // Scripts may not close windows that were not opened by script.
  confirm('Ви ще тут?') ? resetTimer() : window.close();
};

IDLE_EVENT_LIST.forEach(event => {
  document.addEventListener(event, resetTimer);
});

let timer = setTimeout(showAlert, IDLE_TIMEOUT);

///////////////////////////////////////
// Footer date parser

const currentYear = new Date().getFullYear();
footerSpanYear.textContent = currentYear;
