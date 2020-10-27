<template>
  <q-card class="my-card">
    <q-card-section
      horizontal
      v-if="unit"
    >
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
        <div class="row">
          <template v-for="template in equipTemplate">
            <div
              v-for="i in template.count"
              :key="template.subtype + i"
              class=".col"
            >
              <q-avatar
                size="xs"
                v-if="template.type === 'skills' && skills[unit.equipment[template.subtype + '-' + i]]"
              >
                <img :src="skills[unit.equipment[template.subtype + '-' + i]].icon" />
              </q-avatar>
              <q-avatar
                size="xs"
                v-if="template.type === 'items' && items[template.subtype] && items[template.subtype][unit.equipment[template.subtype + '-' + i]]"
              >
                <img :src="items[template.subtype][unit.equipment[template.subtype + '-' + i]].icon" />
              </q-avatar>
            </div>
          </template>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['unit'],
  data () {
    return {
      equipTemplate: [
        { name: 'Armes', type: 'items', subtype: 'weapons', count: 2 },
        { name: 'Armure', type: 'items', subtype: 'armours', count: 1 },
        { name: 'Monture', type: 'items', subtype: 'mounts', count: 1 },
        { name: 'Styles', type: 'skills', subtype: 'styles', count: 2 },
        { name: 'Actions', type: 'skills', subtype: 'assists', count: 2 },
        { name: 'Compétences', type: 'skills', subtype: 'skills', count: 2 },
        { name: 'Critique', type: 'skills', subtype: 'crits', count: 1 },
      ]
    }
  },
  computed: {
    ...mapState('UserStore', ['users']),
    ...mapState('StaticStore', ['skills']),
    ...mapState('StaticStore', ['items']),
    ownerID () {
      if (this.unit.owner && this.users[this.unit.owner]) {
        return this.users[this.unit.owner].name
      }
      else return ""
    },
    picture () {
      if (this.unit && this.unit.picture) {
        return this.unit.picture
      }
      else return ""
    },
    equipedSkills () {
      let skillList = {}
      if (this.unit && this.unit.equipment) {
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
      let mystats = {}
      if (this.unit && this.unit.stats) {
        mystats = Object.assign({}, this.unit.stats)
        Object.keys(this.equipedSkills).forEach((equipKey) => {
          let skill = this.equipedSkills[equipKey]
          if (skill.condition && skill.stats && skill.condition === "always") {
            Object.keys(skill.stats).forEach((statsKey) => {
              mystats[statsKey] += skill.stats[statsKey]
            })
          }
        })
      }
      return mystats
    },
    hpCur () {
      return Math.min(this.unit.hpCur, this.stats.hpMax)
    }
  },
}
</script>
