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

    fetch(`${url}?q=${categoryValue}&mode=everything`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante la richiesta");
            }
            return response.json();
        })
        .then(data => {
            const books = data.docs;
            bookList.innerHTML = "";
            if (books && books.length > 0) {
                books.forEach(book => {
                    const li = document.createElement("li");
                    li.classList.add("item");

                    //Creazione del titolo del libro e autori
                    const titleAuthorContainer = document.createElement("div");
                    const authors = book.author_name ? book.author_name.join(", ") : "Autore sconosciuto";
                    li.textContent = `${book.title} by ${authors}`;
                    bookList.appendChild(li);

                    //Creazione dell'immagine
                    if (book.cover_i) {
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
    fetch(`https://openlibrary.org${bookKey}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore durante la richiesta");
            }
            return response.json();
        })
        .then(data => {
            let description = "Descrizione non disponibile";
            if (data.description) {
                if (typeof data.description === "string") {
                    description = data.description;
                } else if (data.description.value) {
                    description = data.description.value;
                }
            }
            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = description;
            listItem.appendChild(descriptionElement);
        })
        .catch(error => {
            console.error("Errore durante la richiesta", error);
            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = "Descrizione non disponibile";
            document.body.appendChild(descriptionElement);
        })
}