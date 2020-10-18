import Vue from 'vue'
import { firebaseDB } from 'boot/firebase'

const state = {
    masteries: {},
    skills: {},
    equipment: {}
}

const actions = {
    firebaseGetMasteries ({ commit }) {
        firebaseDB.ref('masteries').on('child_added', snapshot => {
            let details = snapshot.val()
            let id = snapshot.key
            details.id = id
            commit('addMastery', {
                id,
                details
            })
        })
    },
    firebaseGetSkills ({ commit }) {
        firebaseDB.ref('skills').on('child_added', snapshot => {
            let details = snapshot.val()
            let id = snapshot.key
            details.id = id
            commit('addSkill', {
                id,
                details
            })
        })
    },
}

const mutations = {
    addMastery (state, payload) {
        Vue.set(state.masteries, payload.id, payload.details)
    },
    addSkill (state, payload) {
        Vue.set(state.skills, payload.id, payload.details)
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