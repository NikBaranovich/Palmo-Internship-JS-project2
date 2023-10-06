const carousel = document.getElementById("cards-carousel");
const carouselInner = carousel.getElementsByClassName("carousel-inner")[0];

const carouselButtonPrev = document.getElementById("cards-carousel-prev");
const carouselButtonNext = document.getElementById("cards-carousel-next");
const cardModeButton = document.getElementById("card-mode-button");

const addCard = (word, index) => {
  const layout = `<div class="carousel-item${index ? "" : " active"}">
    <div class="container w-100 d-flex justify-content-center">
    <div class="flip-card w-100">
      <div class="flip-card-inner">
        <div class="flip-card-front d-flex justify-content-center align-items-center">
          <div class="mx-5">
            <p class="fs-1 mb-0">${word.word}</p>
          </div>
        </div>
        <div class="flip-card-back d-flex justify-content-center align-items-center">
          <div class="mx-5">
            <p class="fs-1 mb-0">${word.translation}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>`;

  if (index === 0) {
    carouselInner.innerHTML = layout;
    return;
  }
  
  carouselInner.innerHTML += layout;
  carouselButtonNext.disabled = false;
};

const printCards = () => {
  if (!words.length) {
    carouselButtonPrev.disabled = true;
    carouselButtonNext.disabled = true;
  }
  carouselButtonPrev.disabled = true;
  carouselButtonNext.disabled = false;

  words.forEach(addCard);
};

cardModeButton.onclick = () => {
  if (isCardMode) {
    return;
  }
  if (!words.length) {
    return;
  }

  isCardMode = true;
  isTranslationMode = false;
  printCards();

  cardModeButton.classList.add("btn-success");
  cardModeButton.classList.remove("btn-secondary");
  translationModeButton.classList.add("btn-secondary");
  translationModeButton.classList.remove("btn-success");

  hideElement(document.getElementById("mode-label"));
  showElement(carousel);
  hideElement(translationModeBlock);
};

let rotationDegree = 0;
carouselInner.onclick = () => {
  const activeSlide = carouselInner.querySelector(".carousel-item.active");
  const flipCardInner = activeSlide.getElementsByClassName("flip-card-inner")[0];

  rotationDegree = rotationDegree == 0 ? 180 : 0;
  flipCardInner.style.transform = `rotateY(${rotationDegree}deg)`;
};

const changeProgressbarValue = (index, length) => {
  wordsProgressBar.style.width = `${(index / length) * 100}%`;
  wordsProgressBar.textContent = `${index}/${length}`;
};

carousel.addEventListener("slid.bs.carousel", function (event) {
  if (event.direction === "left" && event.to === carouselInner.childElementCount - 1) {
    carouselButtonNext.disabled = true;
  } else {
    carouselButtonNext.disabled = false;
  }

  if (event.direction === "right" && event.to === 0) {
    carouselButtonPrev.disabled = true;
  } else {
    carouselButtonPrev.disabled = false;
  }
});
