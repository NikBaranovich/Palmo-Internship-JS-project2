const carousel = document.getElementById("cards-carousel");
const carouselInner = carousel.getElementsByClassName("carousel-inner")[0];
const wordsList = document.getElementById("words-list");

const caoruselButtonPrev = document.getElementById("cards-carousel-prev");
const caoruselButtonNext = document.getElementById("cards-carousel-next");
const saveWordButton = document.getElementById("save-word-button");
const cardModeButton = document.getElementById("card-mode-button");
const translationModeButton = document.getElementById("translation-mode-button");

const wordsProgressBar = document.getElementById("words-progress-bar");
const translationModeBlock = document.getElementById("translation-mode-block");
const translationModeWord = document.getElementById("translation-mode-word");
const translationModeInput = document.getElementById("translation-mode-input");
const translateModeCheckButton = document.getElementById("translate-mode-check-button");
const translateModeSkipButton = document.getElementById("translate-mode-skip-button");
const translateModeNextButton = document.getElementById("translate-mode-next-button");

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
let isCardMode = false;
let isTranslationMode = false;

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (var i = shuffledArray.length - 1; i > 0; i--) {
    var j = getRandomNumber(0, i);
    var temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }
  return shuffledArray;
};

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
  addWordToList(words[words.length - 1], words.length - 1);

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

const changeProgressbarValue = (index, length) => {
  wordsProgressBar.style.width = `${(index / length) * 100}%`;
  wordsProgressBar.textContent = `${index}/${length}`;
};
cardModeButton.onclick = () => {
  if (isCardMode) {
    return;
  }
  isCardMode = true;
  isTranslationMode = false;
  printCards();
  cardModeButton.classList.add("btn-success");
  cardModeButton.classList.remove("btn-secondary");
  translationModeButton.classList.add("btn-secondary");
  translationModeButton.classList.remove("btn-success");

  document.getElementById("mode-label").classList.add("visually-hidden");
  carousel.classList.remove("visually-hidden");
  translationModeBlock.classList.add("visually-hidden");
};
translationModeButton.onclick = () => {
  if (isTranslationMode) {
    return;
  }
  isTranslationMode = true;
  isCardMode = false;
  quizWords = shuffleArray(words);

  translationModeWord.textContent = quizWords[quizWords.length - 1].word;

  changeProgressbarValue(0, words.length);

  translationModeButton.classList.add("btn-success");
  translationModeButton.classList.remove("btn-secondary");
  cardModeButton.classList.add("btn-secondary");
  cardModeButton.classList.remove("btn-success");

  document.getElementById("mode-label").classList.add("visually-hidden");
  translationModeBlock.classList.remove("visually-hidden");
  carousel.classList.add("visually-hidden");
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

printWordsList();

let quizWords;

translateModeCheckButton.onclick = () => {
  if (translationModeInput.value !== quizWords[quizWords.length - 1].translation) {
    console.log("Wrong!");
  } else {
    console.log("Correct!");
  }
  translateModeCheckButton.classList.add("visually-hidden");
  translateModeSkipButton.classList.add("visually-hidden");
  translateModeNextButton.classList.remove("visually-hidden");
};

translateModeNextButton.onclick = () => {
  quizWords.pop();
  translationModeWord.textContent = quizWords[quizWords.length - 1].word;
  translationModeInput.value = "";
  changeProgressbarValue(words.length - quizWords.length, words.length);
  translateModeCheckButton.classList.remove("visually-hidden");
  translateModeSkipButton.classList.remove("visually-hidden");
  translateModeNextButton.classList.add("visually-hidden");
};
