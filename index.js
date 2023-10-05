async function fetchTranslation(sl, tl, text) {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&dt=at&sl=${sl}&tl=${tl}&q=${text}`
  );
  const translation = await response.json();
  return translation;
}

const wordInput = document.getElementById("word-input");
const datalistTranslations = document.getElementById("translation-options");
const wordTranslationInput = document.getElementById("word-translation-input");

const wordsList = document.getElementById("words-list");
const saveWordButton = document.getElementById("save-word-button");

const editModal = document.getElementById("word-edit-modal");
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

if (!localStorage.getItem("words")) {
  localStorage.setItem("words", JSON.stringify([]));
}
let words = JSON.parse(localStorage.getItem("words"));
let isCardMode = false;
let isTranslationMode = false;

const hideElement = (element) => {
  element.classList.add("visually-hidden");
};
const showElement = (element) => {
  element.classList.remove("visually-hidden");
};

const addWordToList = (word, index) => {
  const layout = `<div class="card mb-2 d-flex flex-row">
  <div class="card-body d-flex justify-content-around align-items-center flex-grow-1">
    <p class="w-25 mb-0 text-center">${word.word}</p>
    <p class="w-25 mb-0 text-center blur" onclick="this.classList.toggle('blur')">
      ${word.translation}
    </p>
  </div>
  <div class="btn-group-vertical word-action-buttons" role="group">
    <button class="btn btn-secondary edit-word-button" data-word-id = "${word.id}">Edit</button>
    <button class="btn btn-secondary remove-word-button" data-word-id = "${word.id}">Remove</button>
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

wordInput.onchange = () => {
  fetchTranslation("ru", "en", wordInput.value).then((translation) => {
    console.log(translation[5][0][2]);
    datalistTranslations.innerHTML = translation[5][0][2].reduce(
      (layout, translation) =>
        (layout += `
    <option value="${translation[0]}"></option>`),
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
  });
  localStorage.setItem("words", JSON.stringify(words));

  addCard(words[words.length - 1], words.length - 1);
  addWordToList(words[words.length - 1], words.length - 1);

  wordInput.value = "";
  wordTranslationInput.value = "";
};

printWordsList();

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
  printCards();
  bsEditModal.hide();
});

deleteWordModalButton.addEventListener("click", () => {
  const wordId = +deleteModal.getAttribute("data-word-id");
  words = words.filter(function (word) {
    return word.id !== wordId;
  });
  localStorage.setItem("words", JSON.stringify(words));
  printWordsList();
  printCards();
  bsDeleteModal.hide();
});
