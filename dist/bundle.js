(()=>{const e=document.getElementById("button"),t=document.getElementById("category"),n=document.getElementById("bookList"),o=document.getElementById("loading");function i(e){const t=document.createElement("li");t.textContent=e,n.innerHTML="",n.appendChild(t)}e.addEventListener("click",(()=>{!function(){const e=t.value.trim();""!==e?(o.hidden=!1,n.innerHTML="",axios.get(`https://openlibrary.org/subjects/${e}.json?detail=true`).then((e=>{const t=_.get(e.data,"works",[]);n.innerHTML="",t&&t.length>0?t.forEach((e=>{const t=document.createElement("li");t.classList.add("item"),n.appendChild(t),function(e,t){const n=e.authors&&e.authors.length>0?e.authors.map((e=>e.name)).join(", "):"Autore sconosciuto";t.textContent=`${e.title} by ${n}`}(e,t),function(e,t){const n=e.cover_id;if(n){const o=`https://covers.openlibrary.org/b/id/${n}-M.jpg`,i=document.createElement("img");i.src=o,i.alt=`${e.title} cover`,i.classList.add("cover"),t.appendChild(i)}}(e,t),function(e,t){const n=document.createElement("button");n.textContent="Info",n.addEventListener("click",(()=>{!function(e,t){axios.get(`https://openlibrary.org${e}.json`).then((e=>{const n=_.get(e.data,"description","Descrizione non disponibile"),o="string"==typeof n?n:_.get(n,"value","Descrizione non disponibile"),i=document.createElement("p");i.textContent=o,t.appendChild(i)})).catch((e=>{console.error("Errore durante la richiesta",e);const n=document.createElement("p");n.textContent="Descrizione non disponibile",t.appendChild(n)}))}(e.key,t)})),t.appendChild(n)}(e,t)})):i("Non ci sono libri in questa categoria")})).catch((e=>{console.error("Errore durante la richiesta",e),i("Ricerca dei libri fallita, per favore riprovare.")})).finally((()=>{o.hidden=!0}))):i("Per favore, inserisci una categoria di ricerca")}()}))})();