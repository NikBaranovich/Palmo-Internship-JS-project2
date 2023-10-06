const translationModeButton = document.getElementById("translation-mode-button");

const wordsProgressBar = document.getElementById("words-progress-bar");
const translationModeBlock = document.getElementById("translation-mode-block");
const translationModeWord = document.getElementById("translation-mode-word");
const translationModeResult = document.getElementById("translation-mode-result");
const translationModeInput = document.getElementById("translation-mode-input");
const translationInputResult = document.getElementById("result-sign-label");
const translationModeCheckButton = document.getElementById("translation-mode-check-button");
const translationModeSkipButton = document.getElementById("translation-mode-skip-button");
const translationModeNextButton = document.getElementById("translation-mode-next-button");
const translationModeStartButton = document.getElementById("translation-mode-start-button");

let quizWords;
let quizWordsLength;
let score = 0;

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

translationModeButton.onclick = () => {
  if (isTranslationMode) {
    return;
  }
  if (!words.length) {
    return;
  }
  isTranslationMode = true;
  isCardMode = false;
  quizWords = shuffleArray(words);
  quizWordsLength = quizWords.length;
  translationModeWord.textContent = quizWords[quizWords.length - 1].word;

  changeProgressbarValue(0, words.length);
  clearInput(translationInputResult, translationModeInput);

  translationModeButton.classList.add("btn-success");
  translationModeButton.classList.remove("btn-secondary");
  cardModeButton.classList.add("btn-secondary");
  cardModeButton.classList.remove("btn-success");
  hideElement(document.getElementById("mode-label"));
  showElement(translationModeBlock);
  hideElement(carousel);
};

translationModeCheckButton.onclick = () => {
  if (
    translationModeInput.value.toLowerCase() !==
    quizWords[quizWords.length - 1].translation.toLowerCase()
  ) {
    displayErrorInput(translationInputResult, translationModeInput);
  } else {
    displaySuccessInput(translationInputResult, translationModeInput);

    const bage = document.querySelector(
      `.badge[data-word-id="${quizWords[quizWords.length - 1].id}"]`
    );
    if (bage) {
      showElement(bage);
      quizWords[quizWords.length - 1].learned = true;
    }

    score++;
  }
  hideElement(translationModeCheckButton);
  hideElement(translationModeSkipButton);
  showElement(translationModeNextButton);
};

translationModeNextButton.onclick = () => {
  quizWords.pop();
  if (!quizWords.length) {
    clearInput(translationInputResult, translationModeInput);

    hideElement(translationModeWord);
    hideElement(translationModeInput);
    hideElement(translationModeNextButton);

    showElement(translationModeStartButton);
    showElement(translationModeResult);

    translationModeResult.textContent = `Great! Your score is ${score}/${quizWordsLength}`;
    changeProgressbarValue(quizWordsLength, quizWordsLength);
    return;
  }

  translationModeWord.textContent = quizWords[quizWords.length - 1].word;
  clearInput(translationInputResult, translationModeInput);
  changeProgressbarValue(quizWordsLength - quizWords.length, quizWordsLength);
  showElement(translationModeCheckButton);
  showElement(translationModeSkipButton);
  hideElement(translationModeNextButton);
};

translationModeSkipButton.onclick = () => {
  quizWords.pop();
  if (!quizWords.length) {
    clearInput(translationInputResult, translationModeInput);

    hideElement(translationModeWord);
    hideElement(translationModeInput);
    hideElement(translationModeSkipButton);
    hideElement(translationModeCheckButton);

    showElement(translationModeStartButton);
    showElement(translationModeResult);

    translationModeResult.textContent = `Great! Your score is ${score}/${quizWordsLength}`;
    changeProgressbarValue(quizWordsLength, quizWordsLength);
    return;
  }
  translationModeWord.textContent = quizWords[quizWords.length - 1].word;
  clearInput(translationInputResult, translationModeInput);
  changeProgressbarValue(quizWordsLength - quizWords.length, quizWordsLength);
};

translationModeStartButton.onclick = () => {
  score = 0;
  quizWords = shuffleArray(words);
  quizWordsLength = quizWords.length;
  translationModeWord.textContent = quizWords[quizWords.length - 1].word;

  changeProgressbarValue(0, quizWordsLength);
  showElement(translationModeWord);
  showElement(translationModeInput);
  hideElement(translationModeStartButton);
  hideElement(translationModeResult);
  showElement(translationModeCheckButton);
  showElement(translationModeSkipButton);
};

const displayErrorInput = (label, input) => {
  showElement(label);
  label.innerHTML = `<svg width="25" height="25" fill="white" viewBox="0 0 16 16">
    <path
      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
    />  
  </svg>`;
  label.classList.remove("bg-success");
  label.classList.add("bg-danger");

  input.classList.add("incorrect-input");
  input.classList.remove("correct-input");
};

const displaySuccessInput = (label, input) => {
  showElement(label);
  label.innerHTML = `<svg width="25" height="25" fill="white" viewBox="0 0 16 16">
    <path
        d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
    />
  </svg>`;
  label.classList.add("bg-success");
  label.classList.remove("bg-danger");

  input.classList.remove("incorrect-input");
  input.classList.add("correct-input");
};

const clearInput = (label, input) => {
  hideElement(label);
  label.innerHTML = ``;

  input.classList.remove("incorrect-input");
  input.classList.remove("correct-input");
  input.value = "";
};
