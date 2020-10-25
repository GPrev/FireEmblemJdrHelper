<template>
  <q-card class="my-card">
    <q-card-section horizontal>
      <q-img
        class="col-5"
        :src="picture"
      />
      <q-card-section
        vertical
        class="col"
      >
        <div class="row justify-between">
          <div>
            {{unit.name}}
          </div>
          <div>
            {{ownerID}}
          </div>
        </div>
        <div>
          HP : {{hpCur}}/{{stats.hpMax}}
        </div>
        <div class="row">
          <div class="col">
            FOR : {{stats.str}}
          </div>
          <div class="col">
            MAG : {{stats.mag}}
          </div>
        </div>
        <div class="row">
          <div class="col">
            VIT : {{stats.spd}}
          </div>
          <div class="col">
            TEC : {{stats.skl}}
          </div>
        </div>
        <div class="row">
          <div class="col">
            DEF : {{stats.def}}
          </div>
          <div class="col">
            RES : {{stats.res}}
          </div>
        </div>
        <div class="row">
          <div class="col">
            CHA : {{stats.lck}}
          </div>
          <div class="col">
            MOV : {{stats.mov}}
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['unit'],
  computed: {
    ...mapState('UserStore', ['users']),
    ...mapState('StaticStore', ['skills']),
    ownerID () {
      if (this.unit.owner && this.users[this.unit.owner]) {
        return this.users[this.unit.owner].name
      }
      else return ""
    },
    picture () {
      if (this.unit.picture) {
        return this.unit.picture
      }
      else return ""
    },
    equipedSkills () {
      let skillList = {}
      if (this.unit.equipment) {
        Object.keys(this.unit.equipment).forEach((equipKey) => {
          let equipValue = this.unit.equipment[equipKey]
          if (this.skills[equipValue]) {
            skillList[equipValue] = this.skills[equipValue]
          }
        })
      }
      return skillList
    },
    stats () {
      let mystats = Object.assign({}, this.unit.stats)
      Object.keys(this.equipedSkills).forEach((equipKey) => {
        let skill = this.equipedSkills[equipKey]
        if (skill.condition && skill.stats && skill.condition === "always") {
          Object.keys(skill.stats).forEach((statsKey) => {
            mystats[statsKey] += skill.stats[statsKey]
          })
        }
      })
      return mystats
    },
    hpCur () {
      return Math.min(this.unit.hpCur, this.stats.hpMax)
    }
  },
}
</script>
