import * as fb from 'firebase'

class Ad {
    constructor(title, description, ownerId, imageSrc = '', promo = false, id = null) {
        this.title = title
        this.description = description
        this.ownerId = ownerId
        this.imageSrc = imageSrc
        this.promo = promo
        this.id = id
    }
}

export default {
    state: {
        ads: [
            {
                title: 'First ad',
                description: 'Hi ',
                promo: false,
                imageSrc: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1389&q=80',
                id: '123123'
            },
            {
                title: 'Second ad',
                description: 'Hello ',
                promo: true,
                imageSrc: 'https://images.unsplash.com/photo-1549471013-3364d7220b75?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                id: '123554'
            },
            {
                title: 'Thrid ad',
                description: 'Hi ',
                promo: true,
                imageSrc: 'https://images.unsplash.com/photo-1578097414097-0a89b1318c15?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjExMzk2fQ&auto=format&fit=crop&w=1350&q=80',
                id: '123sad5'
            },
            {
                title: 'Fourth ad',
                description: 'Hi ',
                promo: false,
                imageSrc: 'https://images.unsplash.com/photo-1578148462379-a02534614262?ixlib=rb-1.2.1&auto=format&fit=crop&w=1301&q=80',
                id: '1221336'
            }
        ]
    },
    mutations: {
        createAd(state, payload) {
            state.ads.push(payload)
        }
    },
    actions: {
        async createAd({commit, getters}, payload) {

            commit('clearError')
            commit('setLoading', true)

            try {

                const newAd = new Ad(payload.title, payload.description, getters.user.id, payload.imageSrc, payload.promo)
                const ad = await fb.database().ref('ads').push(newAd)

                commit('createAd',{
                    ...newAd,
                    id: ad.key
                })

            }
            catch (e) {
                commit('setError', e.message)
                commit('setLoading', false)
                throw e
            }
        }
    },
    getters: {
        ads(state) {
            return state.ads
        },
        promoAds(state) {
            return state.ads.filter(ad => {
                return ad.promo
            })
        },
        myAds(state) {
            return state.ads
        },
        adById(state) {
            return adId => {
                return state.ads.find(ad => ad.id === adId)
            }
        }
    }
}
