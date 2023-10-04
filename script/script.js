const carousel = document.getElementById("cards-carousel");
const carouselInner = carousel.getElementsByClassName("carousel-inner")[0];
const wordsList = document.getElementById("words-list");

const caoruselButtonPrev = document.getElementById("cards-carousel-prev");
const caoruselButtonNext = document.getElementById("cards-carousel-next");
const saveWordButton = document.getElementById("save-word-button");

const wordAlertSuccess = document.getElementById("word-alert-success-wrapper");
const bsWordAlertSuccess = new bootstrap.Collapse(wordAlertSuccess, {
  toggle: false,
});
const wordAlertError = document.getElementById("word-alert-error-wrapper");
const bsWordAlertError = new bootstrap.Collapse(wordAlertError, {
  toggle: false,
});

wordAlertSuccess.addEventListener("show.bs.collapse", function () {
  setTimeout(() => {
    bsWordAlertSuccess.hide();
  }, 1500);
});

wordAlertError.addEventListener("show.bs.collapse", function () {
  setTimeout(() => {
    bsWordAlertError.hide();
  }, 1500);
});

if (!localStorage.getItem("words")) {
  localStorage.setItem("words", JSON.stringify([]));
}
let words = JSON.parse(localStorage.getItem("words"));

const addCard = (word, index) => {
  const layout = `<div class="carousel-item${index ? "" : " active"}">
  <div class="container w-100 d-flex justify-content-center">
  <div class="flip-card w-100">
    <div class="flip-card-inner">
      <div class="flip-card-front d-flex justify-content-center align-items-center">
        <div class="mx-5">
          <p class="fs-1">${word.word}</p>
        </div>
      </div>
      <div class="flip-card-back d-flex justify-content-center align-items-center">
        <div class="mx-5">
          <p class="fs-1">${word.translation}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>`;
  if (index == 0) {
    carouselInner.innerHTML = layout;
    return;
  }
  carouselInner.innerHTML += layout;
  caoruselButtonNext.disabled = false;
};

const printCards = () => {
  if (!words.length) {
    carouselInner.innerHTML = `<div class="carousel-item active">
    <div class="d-flex justify-content-center align-items-center w-100 bg-secondary flex-column text-white" style="height: 500px;"><p class="fs-1">Word list is empty.</p> <p class="fs-1">Try to add new words</p></div>
  </div>`;

    caoruselButtonPrev.disabled = true;
    caoruselButtonNext.disabled = true;
    return;
  }

  caoruselButtonNext.disabled = false;

  words.forEach(addCard);
};

const addWordToList = (word, index) => {
  const layout = `<div class="card mb-2">
  <div class="card-body d-flex justify-content-around align-items-center">
    <p class="w-25 mb-0 text-center">${word.word}</p>
    <p class="w-25 mb-0 text-center blur" onclick="this.classList.toggle('blur')">
      ${word.translation}
    </p>
  </div>
</div>`;
  if (index == 0) {
    wordsList.innerHTML = layout;
    return;
  }
  wordsList.innerHTML += layout;
};

const printWordsList = () => {
  if (!words.length) {
    wordsList.innerHTML = `<p class="fs-4 mb-0">Word list is empty.</p>
    <p class="fs-4">Try to add new words</p>`;
    return;
  }
  words.forEach(addWordToList);
};

saveWordButton.onclick = () => {
  const wordInput = document.getElementById("word-input");
  const wordTranslationInput = document.getElementById("word-translation-input");

  if (wordInput.value == "" || wordTranslationInput.value == "") {
    bsWordAlertError.show();
    return;
  }

  bsWordAlertSuccess.show();
  words.push({ word: wordInput.value, translation: wordTranslationInput.value });
  localStorage.setItem("words", JSON.stringify(words));
  addCard(words[words.length - 1], words.length - 1);

  wordsList.innerHTML += `<div class="card">
  <div class="card-body d-flex justify-content-around">
    <p class="w-25">${wordInput.value}</p>
    <p class="w-25">${wordTranslationInput.value}</p>
  </div>
</div>`;
  wordInput.value = "";
  wordTranslationInput.value = "";
};

let rotationDegree = 0;

carouselInner.onclick = () => {
  const activeSlide = carouselInner.querySelector(".carousel-item.active");
  const flipCardInner = activeSlide.getElementsByClassName("flip-card-inner")[0];

  rotationDegree = rotationDegree == 0 ? 180 : 0;
  flipCardInner.style.transform = `rotateY(${rotationDegree}deg)`;
};

carousel.addEventListener("slid.bs.carousel", function (event) {
  if (event.direction == "left" && event.to == carouselInner.childElementCount - 1) {
    caoruselButtonNext.disabled = true;
  } else {
    caoruselButtonNext.disabled = false;
  }

  if (event.direction == "right" && event.to == 0) {
    caoruselButtonPrev.disabled = true;
  } else {
    caoruselButtonPrev.disabled = false;
  }
});

printCards();
printWordsList();
