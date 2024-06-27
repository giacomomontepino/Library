import "./style.css"

const url = "https://openlibrary.org";
const button = document.getElementById("button");
const category = document.getElementById("category");
const bookList = document.getElementById("bookList");
const loading = document.getElementById("loading");

button.addEventListener("click", () => {
  searchBooks();
});

function searchBooks() {
  const categoryValue = category.value.trim();
  if (categoryValue === "") {
    displayMessage("Per favore, inserisci una categoria di ricerca");
    return;
  }

  loading.hidden = false;
  bookList.innerHTML = "";

  axios.get(`${url}/subjects/${categoryValue}.json?detail=true`)
    .then(response => {
      const works = _.get(response.data, "works", []);
      bookList.innerHTML = "";
      if (works && works.length > 0) {
        works.forEach(work => {
          const li = document.createElement("li");
          li.classList.add("item");
          bookList.appendChild(li);
          displayBookDetails(work, li);
          displayBookCover(work, li);
          addInfoButton(work, li);
        });
      } else {
        displayMessage("Non ci sono libri in questa categoria");
      }
    })
    .catch(error => {
      console.error("Errore durante la richiesta", error);
      displayMessage("Ricerca dei libri fallita, per favore riprovare.");
    })
    .finally(() => {
      loading.hidden = true;
    });
}

function displayMessage(message) {
  const li = document.createElement("li");
  li.textContent = message;
  bookList.innerHTML = "";
  bookList.appendChild(li);
}

function displayBookDetails(work, listItem) {
  const authors = work.authors && work.authors.length > 0 ? work.authors.map(author => author.name).join(", ") : "Autore sconosciuto";
  listItem.textContent = `${work.title} by ${authors}`;
}

function addInfoButton(work, listItem) {
  const btnDescription = document.createElement("button");
  btnDescription.textContent = "Info";
  btnDescription.addEventListener("click", () => {
    getBookDescription(work.key, listItem);
  });
  listItem.appendChild(btnDescription);
}

function displayBookCover(work, listItem) {
  const coverId = work.cover_id;
  if (coverId) {
    const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    const img = document.createElement("img");
    img.src = coverUrl;
    img.alt = `${work.title} cover`;
    img.classList.add("cover");
    listItem.appendChild(img);
  }
}

function getBookDescription(workKey, listItem) {
  axios.get(`https://openlibrary.org${workKey}.json`)
    .then(response => {
      const description = _.get(response.data, "description", "Descrizione non disponibile");
      const descriptionText = typeof description === "string" ? description : _.get(description, "value", "Descrizione non disponibile");
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = descriptionText;
      listItem.appendChild(descriptionElement);
    })
    .catch(error => {
      console.error("Errore durante la richiesta", error);
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = "Descrizione non disponibile";
      listItem.appendChild(descriptionElement);
    });
}
