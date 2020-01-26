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
        ads: []
    },
    mutations: {
        createAd(state, payload) {
            state.ads.push(payload)
        },
        loadAds(state, payload){
            state.ads = payload
        }
    },
    actions: {
        async createAd({commit, getters}, payload) {

            commit('clearError')
            commit('setLoading', true)

            const image = payload.image

            try {

                const newAd = new Ad(payload.title, payload.description, getters.user.id, '', payload.promo)
                const ad = await fb.database().ref('ads').push(newAd)
                const imageExt = image.name.slice(image.name.lastIndexOf('.'))

                const fileData = await fb.storage().ref(`ads/${ad.key}.${imageExt}`).put(image)
                // console.log()
                // const imageSrc = fileData.metadata.getDownloadURL().toString()
                const imageSrc = fileData.getDownloadURL()
                console.log(imageSrc)


                commit('createAd',{
                    ...newAd,
                    id: ad.key,
                    imageSrc
                })

            }
            catch (e) {
                commit('setError', e.message)
                commit('setLoading', false)
                throw e
            }
        },
        async fetchAds({commit}){
            commit('clearError')
            commit('setLoading', true)

            const resultAds = []

            try {

                const fbAVal = await fb.database().ref('ads').once('value')
                const ads = fbAVal.val()

                Object.keys(ads).forEach(key =>{
                    const ad = ads[key]
                    resultAds.push(new Ad(
                        ad.title,
                        ad.description,
                        ad.ownerId,
                        ad.imageSrc,
                        ad.promo,
                        key
                    ))
                })

                commit('loadAds',resultAds)

                commit('setLoading', false)
            } catch (e) {
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
