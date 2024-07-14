let container = document.getElementById("container")
let btnSearch = document.getElementById("btn_search")
let inputSearch = document.getElementById("input_search")
let searchForm = document.getElementById("searchForm")
let results = []
let allResults = []

async function cargarResultados() {
    try {
        const response = await axios.get("https://randomuser.me/api/?results=15")
        results = response.data.results
        allResults = [...results]
        drawResults(results, container)
    } catch (err) {
        console.log("Error: " + err.message)
    }
}

async function ejecutarDibujado() {
    await cargarResultados()
    createSearchListener(searchForm, results, container)
    createInputListener(inputSearch, container)
    handleCategoryFilter(results)
}

ejecutarDibujado()

function drawResults(array, container) {
    container.innerHTML = ""
    array.forEach((result) => {
        container.innerHTML += `
            <div id="card" class="card border" style="width: 18rem;">
                <img class="card_img" src="${result.picture.large}">
                <h5 class="card-title"> ${result.name.first} ${result.name.last} </h5>
                <p class="card-text">emprendedor/a</p>
                <p class="card-text">${result.location.city}, ${result.location.state}, ${result.location.country}</p>
                <div class="card-body">
                    <a id="price" href="#" class="card-link">Contacto: ${result.cell}</a>
                    <a href="./details.html" class="card-link">Details</a>
                </div>
            </div>
            `
    })
}

function createSearchListener(searchForm, results, container) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let resultName = inputSearch.value.toLowerCase()
    
        let resultsFilter = results.filter(
            (result) => result.name.first.toLowerCase().includes(resultName) || result.name.last.toLowerCase().includes(resultName)
        )
    
        if(resultsFilter.length === 0){
            drawResults(results, container)
        } else {
            drawResults(resultsFilter, container)
        }
    })
}

function createInputListener(inputSearch, container) {
    inputSearch.addEventListener("input", () => {
        let resultName = inputSearch.value.toLowerCase()
    
        let resultsFilter = results.filter((result) =>
            result.name.first.toLowerCase().includes(resultName) || result.name.last.toLowerCase().includes(resultName)
        )
        
        if (resultName === "") {
            drawResults(results, container)
        } else {
            drawResults(resultsFilter, container)
        }
    })
}

function handleCategoryFilter(results) {
    const checkboxes = document.querySelectorAll(".category-filter")
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const selectedValues = Array.from(checkboxes)
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value)

            let resultsFilter = results

            if (selectedValues.length > 0) {
                resultsFilter = resultsFilter.filter((result) => {
                    return selectedValues.includes(result.location.country) || selectedValues.includes(result.gender)
                })
            }

            if (selectedValues.length === 0) {
                drawResults(allResults, container)
            } else {
                drawResults(resultsFilter, container)
            }
        })
    })
}
