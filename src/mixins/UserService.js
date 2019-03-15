import axios from 'axios'
import { common } from './Common'

// Test if we are into a web extension or in a standard page (yarn serve)
// When in devMode CORS doesn't authorize direct API call => mock it
const devMode = !chrome.storage
if (devMode) console.log('DEBUG use mocks for api call')

/**
 * show main.js for global axios configuration
 */
export const userService = {
    mixins: [common],
    methods: {
        checkAuth() {
            if (devMode) {
                return this.mockResponse({logged: 0})
            }
            return axios.get('/auth/check')
        },
        loginUser(user) {
            if (devMode) {
                return this.mockResponse({ username: user.email, password: user.password, nom: 'Doe', prenom: 'John', gravatar: '69a9adea996d23709fe7757e1fddcb81', token: '1234567890' })
            }
            return axios.post('/auth/login',
                { username: user.email, password: user.password }
            )
        },
        addWish(payload) {
            if (devMode) {
                return this.mockResponse(payload)
            }
            return axios.post('/wish/add', payload)
        },
        getLists() {
            if (devMode) {
                this.$store.commit('addMyList', DATA_MY_LIST)
                this.$store.commit('addFollowList', DATA_FOLLOW_LIST)
                return
            }
            // Récupération de la liste des listes partagées
            axios.get('/user/shared/list').then(response => {
                response.data.sort(function(a, b){
                return a.name.localeCompare(b.name)
                })
                this.$store.commit('addMyList', response.data)
            }).catch(error => {
                this.showError('Erreur lors du chargement de mes listes : ' + error.response.data.message)
            })
            axios.get('/user/follow/list?useronly=true').then(response => {
              response.data.sort(function(a, b){
                if (!a.prenom) {
                  return -1
                }
                return a.prenom.localeCompare(b.prenom)
              })
              this.$store.commit('addFollowList', response.data)
            }).catch(error => {
                this.showError('Erreur lors du chargement des follows : ' + error.response.data.message)
            })
        },
        mockResponse(data) {
            return new Promise(resolve => {
                resolve({data: data})
            })
        },
    }
}

// MOCKS
const DATA_MY_LIST = [
    {
        "id": 4,
        "date": null,
        "name": "My List 4",
        "hashcode": "liste4",
        "paypalemail": null,
        "description": null,
        "restriction": "restricted",
        "dateevt": "2018-10-17T22:00:00.000Z",
        "image": 1,
        "background": 1,
        "color": "ws-bg-green",
        "typeshared": 3,
        "userfk": 1,
        "withfk": 1,
        "with": null,
        "usr": {
            "nom": "Doe",
            "prenom": "John",
            "hashcode": "johndoe="
        }
    },
    {
        "id": 20,
        "date": "2018-01-18T08:46:27.000Z",
        "name": "My List 20",
        "hashcode": "liste20",
        "paypalemail": null,
        "description": null,
        "restriction": "private",
        "dateevt": null,
        "image": null,
        "background": 1,
        "color": null,
        "typeshared": 3,
        "userfk": 1,
        "withfk": 1,
        "with": null,
        "usr": {
            "nom": "Doe",
            "prenom": "John",
            "hashcode": "johndoe="
        }
    }
]

const DATA_FOLLOW_LIST = [
    {
        "id": 5,
        "hashcode": "liste5=",
        "nom": "Follow",
        "prenom": "Mister5",
        "gravstyle": "none",
        "image": null,
        "imageurl": null,
        "email": "liste5@test.com",
        "gravatar": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "star": 1
    },
    {
        "id": 29,
        "hashcode": "liste29=",
        "nom": "Follow",
        "prenom": "Mister29",
        "gravstyle": null,
        "image": null,
        "imageurl": null,
        "email": "liste29",
        "gravatar": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "star": null
    }
]
