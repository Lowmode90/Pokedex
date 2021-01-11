"use strict"

let pokeList = []
let tableauFin = []

const searchInput = document.querySelector('.search input')
const listeP = document.querySelector('.poke-list')
const chargement = document.querySelector('.loader')

const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
}

function fetchPokemonBase() {
    fetch ("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then (response => response.json())
    .then ((pokeList) => {
        pokeList.results.forEach((pokemon) => {
            fetchPokemonComplete(pokemon)
        })
    })
}
fetchPokemonBase()

function fetchPokemonComplete(pokemon) {
    let pokemonFull = {}
    let url = pokemon.url
    let nameP = pokemon.name

    fetch (url)
    .then (response => response.json())
    .then ((pokeData) => {
        pokemonFull.pic = pokeData.sprites.front_default
        pokemonFull.type = pokeData.types[0].type.name
        pokemonFull.id = pokeData.id

        fetch (`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then(response => response.json())
        .then((pokeData) => {
            pokemonFull.name = pokeData.names[4].name
            pokeList.push(pokemonFull)

            if (pokeList.length === 151) {
                // console.log(pokeList);
                tableauFin = pokeList.sort((a, b) => {
                    return a.id - b.id
                }).slice(0, 21);
                creeCarte(tableauFin)
                chargement.style.display = "none"
            }
        })
    })
}

function creeCarte(arr) {
    for (let i = 0; i < arr.length; i++) {
        const carte = document.createElement('li')
        let couleur = types[arr[i].type]
        carte.style.background = couleur

        const txtCarte = document.createElement('h5')
        txtCarte.innerText = arr[i].name

        const idCarte = document.createElement('p')
        idCarte.innerText = `ID# ${arr[i].id}`

        const imgCarte = document.createElement('img')
        imgCarte.src = arr[i].pic

        carte.appendChild(imgCarte)
        carte.appendChild(txtCarte)
        carte.appendChild(idCarte)

        listeP.appendChild(carte)
    }
}

window.addEventListener('scroll', () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement
    if (clientHeight + scrollTop >= scrollHeight - 20) {
        ajouterPokemon(6)
    }
})

let index = 21

function ajouterPokemon(nb) {
    if (index > 151) {
        return
    } else {
        const ajouterTab = pokeList.slice(index, index + nb)
        creeCarte(ajouterTab)
        index += nb
    }
}

searchInput.addEventListener('keyup', recherche)

// const formRecherche = document.querySelector('form')
// formRecherche.addEventListener('submit', (e) => {
//     e.preventDefault()
//     recherche()
// })

function recherche() {
    if (index < 151) {
        ajouterPokemon(130)
    }
    let filter, allLi, titleValue, allTitles
    filter = searchInput.value.toUpperCase()
    allLi = document.querySelectorAll('li')
    allTitles = document.querySelectorAll('li > h5')

    for (let i = 0; i < allLi.length; i++) {
        titleValue = allTitles[i].innerText
        if (titleValue.toUpperCase().indexOf(filter) > -1) {
            allLi[i].style.display = "flex"
        } else {
            allLi[i].style.display = "none"
        }
    }
} 

searchInput.addEventListener('input', function(e) {
    if (e.target.value !== "") {
        e.target.parentNode.classList.add('active-input')
    } else if (e.target.value === "") {
        e.target.parentNode.classList.remove('active-input')
    }
})