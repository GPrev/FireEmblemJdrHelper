<template>
  <q-card class="my-card">
    <q-card-section
      horizontal
      v-if="unit"
    >
      <q-img
        class="col-5"
        :src="picture"
        height="180px"
        contain
      />
      <q-card-section
        vertical
        class="col q-pa-sm"
      >
        <div class="row justify-between items-center">
          <div class="text-h5">
            {{unit.name}}
          </div>
          <div class="text-caption">
            {{ownerID}}
          </div>
        </div>
        <q-linear-progress
          class="q-my-xs"
          size="20px"
          rounded
          :value="hpCur/stats.hpMax"
          color="primary"
        >
          <div class="absolute-full flex flex-center">
            <q-badge
              color="white"
              text-color="black"
              :label="'PV : '+hpCur+'/'+stats.hpMax"
            />
          </div>
        </q-linear-progress>
        <div class="row justify-between">
          <template v-for="(statName, statKey) in statNames">
            <div
              :key="statKey+'_label'"
              class="col-3"
            >{{statName}}</div>
            <div
              :key="statKey+'_value'"
              class="col-1 text-right"
            >{{stats[statKey]}}</div>
            <div
              v-if="unit.buffs && unit.buffs[statKey] != 0"
              :key="statKey+'_buff'"
              :class="'col-1 '+(unit.buffs[statKey]>0 && ' text-positive ')+(unit.buffs[statKey]<0 && ' text-negative')"
            >{{(unit.buffs[statKey]>0?'+':'') + unit.buffs[statKey]}}</div>
            <div
              v-else
              :key="statKey+'_space'"
              class="col-1"
            />
          </template>
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
                square
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
      statNames: {
        str: "FOR",
        mag: "MAG",
        spd: "VIT",
        skl: "TEC",
        def: "DEF",
        res: "RES",
        lck: "CHA",
        mov: "MOV",
      },
      equipTemplate: [
        { name: 'Armes', type: 'items', subtype: 'weapons', count: 2 },
        { name: 'Armure', type: 'items', subtype: 'armors', count: 1 },
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
    ...mapState('StaticStore', ['skills', 'items']),
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
        // Skills
        Object.keys(this.equipedSkills).forEach((equipKey) => {
          let skill = this.equipedSkills[equipKey]
          if (skill.condition && skill.stats && skill.condition === "always") {
            Object.keys(skill.stats).forEach((statsKey) => {
              mystats[statsKey] += skill.stats[statsKey]
            })
          }
        })
        // Equipement
        if (this.unit && this.unit.equipment && this.unit.equipment['armors-1'] && this.items.armors) {
          let armor = this.items.armors[this.unit.equipment['armors-1']]
          if (armor && armor.stats) {
            Object.keys(armor.stats).forEach((statsKey) => {
              mystats[statsKey] += armor.stats[statsKey]
            })
          }
        }
        if (this.unit && this.unit.equipment && this.unit.equipment['mounts-1'] && this.items.mounts) {
          let mount = this.items.mounts[this.unit.equipment['mounts-1']]
          if (mount && mount.stats) {
            Object.keys(mount.stats).forEach((statsKey) => {
              mystats[statsKey] += mount.stats[statsKey]
            })
          }
        }
      }
      return mystats
    },
    hpCur () {
      return Math.min(this.unit.hpCur, this.stats.hpMax)
    }
  },
}
</script>
