import "./style.css"

const url = "https://openlibrary.org/search.json";
const button = document.getElementById("button");
const category = document.getElementById("category");
const bookList = document.getElementById("bookList");
const loading = document.getElementById("loading");

button.addEventListener("click", () => {
    searchBooks();
})
function searchBooks() {
    const categoryValue = category.value.trim();
    if (categoryValue === "") {
        const li = document.createElement("li");
        li.textContent = "Per favore, inserisci una categoria di ricerca";
        bookList.innerHTML = "";
        bookList.appendChild(li);
        return;
    }

    loading.hidden = false
    bookList.innerHTML = "";

    axios.get(`${url}?q=${categoryValue}&mode=everything`)
        .then(response => {
            const books = _.get(response.data, "docs", []);
            bookList.innerHTML = "";
            if (books && books.length > 0) {
                books.forEach(book => {
                    const li = document.createElement("li");
                    li.classList.add("item");

                    //Creazione del titolo del libro e autori
                    const titleAuthorContainer = document.createElement("div");
                    const authors = _.get(book, "author_name", ["Autore sconosciuto"]).join(",");
                    li.textContent = `${book.title} by ${authors}`;
                    bookList.appendChild(li);

                    //Creazione dell'immagine
                    const coverId = _.get(book, "cover_i");
                    if (coverId) {
                        const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
                        const img = document.createElement("img");
                        img.src = coverUrl;
                        img.alt = `${book.title} cover`;
                        img.classList.add("cover");
                        li.appendChild(img);
                    }

                    //Creazione del bottone info
                    const btnDescription = document.createElement("button");
                    btnDescription.textContent = "Info";
                    btnDescription.addEventListener("click", () => {
                        getBookDescription(book.key, li);
                    });
                    li.appendChild(btnDescription);
                })
            } else {
                const li = document.createElement("li");
                li.textContent = "Non ci sono libri in questa categoria";
                bookList.appendChild(li);
            }
        })
        .catch(error => {
            console.error("Errore durante la richiesta", error);
            const li = document.createElement("li");
            li.textContent = "Ricerca dei libri fallita, per favore riprovare.";
            bookList.appendChild(li);
        })
        .finally(() => {
            console.log("nascondi caricamento (finally)")
            loading.hidden = true;
        })
}

function getBookDescription(bookKey, listItem) {
    const categoryValue = category.value.trim()
    axios.get(`https://openlibrary.org${bookKey}.json`)
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
            document.body.appendChild(descriptionElement);
        })
}