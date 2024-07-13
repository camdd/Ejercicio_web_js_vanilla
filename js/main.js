
let container = document.getElementById("container")
let btnSearch = document.getElementById("btn_search")
let inputSearch = document.getElementById("input_search")
let searchForm = document.getElementById("searchForm");
let events = []
let allEvents = [];

async function cargarEventos() {
    try {
        const response = await axios.get("https://mindhub-xj03.onrender.com/api/amazing");
        console.log(response.data.events);
        events = response.data.events;
        allEvents = [...events];
        dibujarEventos(events, container);
    } catch (err) {
        console.log("Error: " + err.message);
    }
}

async function ejecutarDibujado() {
    await cargarEventos();
    createSearchListener(searchForm, events, container);
    createInputListener(searchForm, events, container);
    handleCategoryFilter(events);
}

ejecutarDibujado()

let dibujarEventos = (array, container) => {
    container.innerHTML = ""
    array.forEach((event) => {
        container.innerHTML += `
            <div id="card" class="card border" style="width: 18rem;">
                <img class="card_img" src="${event.image}">
                <h5 class="card-title"> ${event.name} </h5>
                <p class="card-text">${event.description}</p>
                <div class="card-body">
                    <a id="price" href="#" class="card-link">Price: $${event.price}</a>
                    <a href="./details.html" class="card-link">Details</a>
                </div>
            </div>
            `
    })
}

//Creo un filtro para la barra de búsqueda
let createSearchListener = (searchForm, events, container) => {
    
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let eventName = inputSearch.value
    
        let eventsFilter = events.filter(
            (event)=>event.name.toLowerCase().includes(eventName.toLowerCase())
        )
    
        if(eventsFilter.length===0){
            dibujarEventos(events, container)
        } else {
            dibujarEventos(eventsFilter, container)
        }
    })
}

//A ese filtro le implemento la posibilidad de mostrar el contenido conforme se va tipeando en el input
let createInputListener = (searchForm, events, container) => {
    inputSearch.addEventListener("input", ()=> {
        let eventName = inputSearch.value
    
        let eventsFilter = events.filter ((event) =>
        event.name.toLowerCase().includes(eventName.toLowerCase()))
        
        if (eventName ==="") {
            dibujarEventos(events, container)
        } else {
            dibujarEventos(eventsFilter, container)
        }
    })
}

//Función para filtrar los eventos por categoría en el checkbox
function handleCategoryFilter(events) {
    const checkboxes = document.querySelectorAll(".category-filter");
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const selectedCategories = Array.from(checkboxes)
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value);

            if (selectedCategories.length === 0) {
                dibujarEventos(allEvents, container);
            } else {
                const eventsFilter = events.filter((event) => {
                    return selectedCategories.includes(event.category);
                });
                dibujarEventos(eventsFilter, container);
            }
        });
    });
}











