export const common = {
    methods: {
        clearMessages() {
            this.$store.commit('clearMessages') // mutate store
        },
        showError(msg) {
            this.showMessage(msg, 'error') // mutate store
        },
        showMessage(msg, type) {
            this.$store.commit('addMessage', {text: msg, type: type?type:'info'}) // mutate store
        },
        /**
         * Compute hashcode (pageid)
         * @param s string value
         */
        hashCode(s) {
            return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0)
        },
        /**
         * Helper used to retrieve data from persistent cache if exists or return default value
         */ 
        getDataFromCache(name, value, storage) {
            const pageid = this.$store.state.pageid
            if (storage && storage.lastinfo && storage.lastinfo[pageid] && storage.lastinfo[pageid][name] && storage.lastinfo[pageid][name].length>0) {
            return storage.lastinfo[pageid][name]
            } else if (value && value.length>0) {
            return value
            } else {
            return ''
            }
        },
        getDefaultUser() {
            return { 
                admin: null, 
                background: null, 
                color: null, 
                datederniereconnexion: null, 
                dateinscription: null, 
                datenaissance: null, 
                email: null, 
                gravatar: null, 
                gravstyle: null, 
                hashcode: null, 
                id: null, 
                image: null, 
                imageurl: null, 
                logged: null, 
                nom: null, 
                orderField: null, 
                orderReverse: null, 
                prenom: null, 
                resareminder: null, 
                restriction: null, 
                token: null
            }
        }
    }
}
