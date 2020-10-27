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
        firebaseDB.ref('units').push(payload.unit)
    },
    firebaseUpdateUnit ({ }, payload) {
        firebaseDB.ref('units/' + payload.key).update(payload.unit)
    }
}

const mutations = {
    addUnit (state, payload) {
        let unitDetails = {
            name: null,
            owner: null,
            picture: null,
            stats: {
                hpMax: 30,
                str: 30,
                mag: 30,
                spd: 30,
                skl: 30,
                def: 30,
                res: 30,
                lck: 5,
                mov: 3
            },
            masteries: {},
            items: {
                weapons: { none: true },
                armors: { none: true },
                mounts: { none: true }
            },
            equipment: {},
        }
        Object.assign(unitDetails, payload.unitDetails)
        Vue.set(state.units, payload.unitID, unitDetails)
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