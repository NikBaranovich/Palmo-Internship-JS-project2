async function fetchTranslation(sourceLanguage, translationLanguage, text) {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&dt=at&sl=${sourceLanguage}&tl=${translationLanguage}&q=${text}`
  );
  const translation = await response.json();
  return translation[5][0][2];
}

const wordInput = document.getElementById("word-input");
const datalistTranslations = document.getElementById("translation-options");
const wordTranslationInput = document.getElementById("word-translation-input");

const wordsList = document.getElementById("words-list");
const saveWordButton = document.getElementById("save-word-button");

const editModal = document.getElementById("word-edit-modal");
const wordEditInput = document.getElementById("word-edit-input");
const datalistEditTranslations = document.getElementById("translation-edit-options");
const wordTranslationEditInput = document.getElementById("word-translation-edit-input");
const bsEditModal = new bootstrap.Modal(editModal);
const saveWordEditButton = document.getElementById("save-word-edit-button");

const deleteModal = document.getElementById("word-delete-modal");
const bsDeleteModal = new bootstrap.Modal(deleteModal);
const deleteWordModalButton = document.getElementById("delete-word-modal-button");

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

const hideElement = (element) => {
  element.classList.add("visually-hidden");
};
const showElement = (element) => {
  element.classList.remove("visually-hidden");
};

const addWordToList = (word, index) => {
  const layout = `
    <div class="card mb-2 flex-row row">
    <div class="card-body row flex-row flex-wrap col-12 col-sm-10">
      <div class="col-sm-2 col-12 d-flex align-items-center justify-content-center">
        <span
        class="badge bg-success ${word.learned ? "" : "visually-hidden"}"
        data-word-id="${word.id}">
        Learned
        </span>      
      </div>
      <div class="col-sm-10 col-12 d-flex flex-row justify-content-around flex-wrap align-items-center">
        <p class="mb-0 text-center">${word.word}</p>
        <p class="mb-0 text-center blur" onclick="this.classList.toggle('blur')">
          ${word.translation}
        </p>
      </div>
    </div>
    <div class="btn-group-vertical word-action-buttons col- 2 col-sm-2 px-0" role="group">
      <button class="btn btn-secondary edit-word-button" data-word-id="${word.id}">
        Edit
      </button>
      <button class="btn btn-danger remove-word-button" data-word-id="${word.id}">
        Remove
      </button>
    </div>
  </div>
`;
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

wordInput.onchange = () => {
  fetchTranslation("ru", "en", wordInput.value).then((translation) => {
    datalistTranslations.innerHTML = translation.reduce(
      (layout, translation) =>
        (layout += `
    <option value="${translation[0]}">${translation[0]}</option>`),
      ``
    );
  });
};
wordInput.oninput = () => {
  datalistTranslations.innerHTML = ``;
};

saveWordButton.onclick = () => {
  const wordInput = document.getElementById("word-input");
  const wordTranslationInput = document.getElementById("word-translation-input");

  if (wordInput.value == "" || wordTranslationInput.value == "") {
    bsWordAlertError.show();
    return;
  }

  bsWordAlertSuccess.show();

  const id = words[words.length - 1] ? words[words.length - 1].id + 1 : 0;
  words.push({
    id: id,
    word: wordInput.value,
    translation: wordTranslationInput.value,
    learned: false,
  });
  localStorage.setItem("words", JSON.stringify(words));

  if (isCardMode) {
    addCard(words[words.length - 1], words.length - 1);
  }

  addWordToList(words[words.length - 1], words.length - 1);

  wordInput.value = "";
  wordTranslationInput.value = "";
};

wordsList.addEventListener("click", (event) => {
  const target = event.target;
  if (!target.hasAttribute("data-word-id")) {
    return;
  }
  const wordId = +target.getAttribute("data-word-id");

  if (target.classList.contains("edit-word-button")) {
    editModal.setAttribute("data-word-id", wordId);
    bsEditModal.show();
  }

  if (target.classList.contains("remove-word-button")) {
    deleteModal.setAttribute("data-word-id", wordId);
    bsDeleteModal.show();
  }
});

editModal.addEventListener("show.bs.modal", (event) => {
  const wordId = +editModal.getAttribute("data-word-id");
  const wordInput = editModal.querySelector("#word-edit-input");
  const word = words.find((word) => word.id == wordId);
  wordInput.value = word.word;
  const wordTranslationInput = editModal.querySelector("#word-translation-edit-input");
  wordTranslationInput.value = word.translation;
});

saveWordEditButton.addEventListener("click", () => {
  const wordId = +editModal.getAttribute("data-word-id");
  const wordInput = editModal.querySelector("#word-edit-input");
  const wordTranslationInput = editModal.querySelector("#word-translation-edit-input");
  const word = words.find((word) => word.id == wordId);
  word.word = wordInput.value;
  word.translation = wordTranslationInput.value;
  localStorage.setItem("words", JSON.stringify(words));
  printWordsList();
  if (isCardMode) {
    printCards();
  }
  bsEditModal.hide();
});

deleteWordModalButton.addEventListener("click", () => {
  const wordId = +deleteModal.getAttribute("data-word-id");
  words = words.filter(function (word) {
    return word.id !== wordId;
  });
  localStorage.setItem("words", JSON.stringify(words));
  printWordsList();
  if (isCardMode) {
    printCards();
  }
  bsDeleteModal.hide();
});

function handleTranslationInputFocus(datalistTranslations, wordTranslationInput) {
  showElement(datalistTranslations);
  wordTranslationInput.classList.add("input-datalist");
}

function handleTranslationInputClick(event, wordTranslationInput) {
  const target = event.target;
  wordTranslationInput.value = target.value;
}

function handleTranslationInputFocusOut(datalistTranslations, wordTranslationInput) {
  setTimeout(() => {
    hideElement(datalistTranslations);
    wordTranslationInput.classList.remove("input-datalist");
  }, 150);
}

function handleTranslationInput(wordTranslationInput, datalistTranslations) {
  let hasDisplayedElement = false;
  const text = wordTranslationInput.value.toLowerCase();
  for (let option of datalistTranslations.options) {
    if (option.value.toLowerCase().indexOf(text) > -1) {
      option.style.display = "block";
      hasDisplayedElement = true;
    } else {
      option.style.display = "none";
    }
  }
  if (hasDisplayedElement) {
    showElement(datalistTranslations);
    wordTranslationInput.classList.add("input-datalist");
  } else {
    hideElement(datalistTranslations);
    wordTranslationInput.classList.remove("input-datalist");
  }
}

wordTranslationInput.onfocus = () => {
  handleTranslationInputFocus(datalistTranslations, wordTranslationInput);
};

datalistTranslations.addEventListener("click", (event) => {
  handleTranslationInputClick(event, wordTranslationInput);
});

wordTranslationInput.addEventListener("focusout", () => {
  handleTranslationInputFocusOut(datalistTranslations, wordTranslationInput);
});

wordTranslationInput.oninput = function () {
  handleTranslationInput(wordTranslationInput, datalistTranslations);
};


wordTranslationEditInput.onfocus = () => {
  handleTranslationInputFocus(datalistEditTranslations, wordTranslationEditInput);
};

datalistEditTranslations.addEventListener("click", (event) => {
  handleTranslationInputClick(event, wordTranslationEditInput);
});

wordTranslationEditInput.addEventListener("focusout", () => {
  handleTranslationInputFocusOut(datalistEditTranslations, wordTranslationEditInput);
});

wordTranslationEditInput.oninput = function () {
  handleTranslationInput(wordTranslationEditInput, datalistEditTranslations);
};

wordEditInput.onchange = () => {
  fetchTranslation("ru", "en", wordEditInput.value).then((translation) => {
    datalistEditTranslations.innerHTML = translation.reduce(
      (layout, translation) =>
        (layout += `
    <option value="${translation[0]}">${translation[0]}</option>`),
      ``
    );
  });
};

if (!localStorage.getItem("words")) {
  localStorage.setItem("words", JSON.stringify([]));
}
let words = JSON.parse(localStorage.getItem("words"));
let isCardMode = false;
let isTranslationMode = false;

printWordsList();