"use strict"

let pokeList = []
let finalArr = []

const searchInput = document.querySelector('.search input')
const listP = document.querySelector('.poke-list')
const load = document.querySelector('.loader')

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
            pokemonFull.name = pokeData.names[6].name
            pokeList.push(pokemonFull)

            if (pokeList.length === 151) {
                // console.log(pokeList);
                finalArr = pokeList.sort((a, b) => {
                    return a.id - b.id
                }).slice(0, 21);
                createCard(finalArr)
                load.style.display = "none"
            }
        })
    })
}

function createCard(arr) {
    for (let i = 0; i < arr.length; i++) {
        const card = document.createElement ('li')
        let color = types[arr[i].type]
        card.style.background = color

        const cardTxt = document.createElement('h5')
        cardTxt.innerText = arr[i].name

        const cardId = document.createElement('p')
        cardId.innerText = `ID# ${arr[i].id}`

        const cardImg = document.createElement('img')
        cardImg.src = arr[i].pic

        card.appendChild(cardImg)
        card.appendChild(cardTxt)
        card.appendChild(cardId)

        listP.appendChild(card)
    }
}

window.addEventListener('scroll', () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement
    if (clientHeight + scrollTop >= scrollHeight - 20) {
        addPokemon(6)
    }
})

let index = 21

function addPokemon(nb) {
    if (index > 151) {
        return
    } else {
        const addToArr = pokeList.slice(index, index + nb)
        createCard(addToArr)
        index += nb
    }
}

searchInput.addEventListener('keyup', search)

// const formSearch = document.querySelector('form')
// formSearch.addEventListener('submit', (e) => {
//     e.preventDefault()
//     search()
// })

function search() {
    if (index < 151) {
        addPokemon(130)
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
