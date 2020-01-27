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
        },
        updateAd(state, {title, description, id}){
            const ad = state.ads.find(a =>{
                return a.id === id
            })

            ad.title = title
            ad.description = description
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



                // const gsReference = storage.refFromURL('gs://ads-project-eb1b1.appspot.com')


                const imageSrc = await fb.storage().ref(`ads/${ad.key}.${imageExt}`).child(`ads/${ad.key}.${imageExt}`).getDownloadURL().then(function(url) {
                    // `url` is the download URL for 'images/stars.jpg'

                    // This can be downloaded directly:
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function(event) {
                        var blob = xhr.response;
                    };
                    xhr.open('GET', url);
                    xhr.send();

                    // Or inserted into an <img> element:
                    var img = document.getElementById(ad.key);
                    img.src = url;
                }).catch(function(error) {
                    // Handle any errors
                });


                // console.log()
                // const imageSrc = fileData.metadata.getDownloadURL().toString()
                // const imageSrc = fileData.getDownloadURL()
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
        },
        async updateAd({commit}, {title, description, id}){
            commit('clearError')
            commit('setLoading', true)

            try {
                await fb.database().ref('ads').child(id).update({
                    title, description
                })
                commit('updateAd', {
                    title, description, id
                })
                commit('setLoading', true)
            } catch (e) {
                commit('setError', e.message)
                commit('setLoading', true)

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
