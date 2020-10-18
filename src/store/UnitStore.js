import Vue from 'vue'
import { boot } from "quasar/wrappers"
import { firebaseAuth, firebaseDB } from 'boot/firebase'

const state = {
    units: {}
}

const actions = {
    firebaseGetUnits ({ commit }) {
        firebaseDB.ref('units').on('child_added', snapshot => {
            let unitDetails = snapshot.val()
            let unitID = snapshot.key
            unitDetails.id = unitID
            commit('addUnit', {
                unitID,
                unitDetails
            })
        })
        firebaseDB.ref('units').on('child_changed', snapshot => {
            let unitDetails = snapshot.val()
            let unitID = snapshot.key
            commit('updateUnit', {
                unitID,
                unitDetails
            })
        })
    },
    firebaseCreateUnit ({ }, payload) {
        firebaseDB.ref('units').push(payload.character)
    }
}

const mutations = {
    addUnit (state, payload) {
        Vue.set(state.units, payload.unitID, payload.unitDetails)
    },
    updateUnit (state, payload) {
        Object.assign(state.units[payload.unitID], payload.unitDetails)
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