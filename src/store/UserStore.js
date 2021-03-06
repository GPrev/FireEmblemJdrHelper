import Vue from 'vue'
import { boot } from "quasar/wrappers"
import { firebaseAuth, firebaseDB } from 'boot/firebase'

const state = {
    users: {},
    userDetails: {}
}

const actions = {
    registerUser ({ }, payload) {
        firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
                console.log(response)
                let userId = firebaseAuth.currentUser.uid
                firebaseDB.ref('users/' + userId).set({
                    name: payload.name,
                    email: payload.email,
                    online: true
                })
            })
            .catch(error => {
                console.log(error.message)
            })
    },
    loginUser ({ }, payload) {
        firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error.message)
            })
    },
    logoutUser () {
        firebaseAuth.signOut()
    },
    handleAuthStateChanged ({ commit, dispatch, state }) {
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                // User is logged in.
                let userId = firebaseAuth.currentUser.uid
                firebaseDB.ref('users/' + userId).once('value', snapshot => {
                    let userDetails = snapshot.val()
                    commit('setUserDetails', {
                        name: userDetails.name,
                        email: userDetails.email,
                        userId: userId
                    })
                })
                dispatch('firebaseUpdateUser', {
                    userId: userId,
                    updates: {
                        online: true
                    }
                })
                // Useless, we don't care about the user list
                // dispatch('firebaseGetUsers')
                // We get errors if we are already at root, so we ignore them
                this.$router.push('/').catch(err => { })
            }
            else {
                // User is logged out.
                dispatch('firebaseUpdateUser', {
                    userId: state.userDetails.userId,
                    updates: {
                        online: false
                    }
                })
                commit('setUserDetails', {})
                this.$router.replace('/auth')
            }
        })
    },
    firebaseUpdateUser ({ }, payload) {
        if (payload.userId) {
            firebaseDB.ref('users/' + payload.userId).update(payload.updates)
        }
    },
    firebaseGetUsers ({ commit }) {
        firebaseDB.ref('users').on('child_added', snapshot => {
            let userDetails = snapshot.val()
            let userId = snapshot.key
            commit('addUser', {
                userId,
                userDetails
            })
        })
        firebaseDB.ref('users').on('child_changed', snapshot => {
            let userDetails = snapshot.val()
            let userId = snapshot.key
            commit('updateUser', {
                userId,
                userDetails
            })
        })
    },
}

const mutations = {
    setUserDetails (state, payload) {
        state.userDetails = payload
    },
    addUser (state, payload) {
        Vue.set(state.users, payload.userId, payload.userDetails)
    },
    updateUser (state, payload) {
        Object.assign(state.users[payload.userId], payload.userDetails)
    },
}

const getters = {

}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}