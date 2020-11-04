<template>
  <div class="col">
    <unit-picker v-model="attackerId" />

    <q-card
      v-if="attacker && defender"
      class="row justify-between q-ma-md q-pa-md"
    >
      <div class="col-5">
        <div class="row text-h5">
          {{attacker.name}}
        </div>
        <div class="row">
          <div class="col-6">Dgt</div>
          <div class="col-3 text-right">{{attackStats.mnt}}</div>
          <div
            class="col-3 text-accent q-px-xs"
            v-if="attackStats.double"
          >x2</div>
        </div>
        <div class="row">
          <div class="col-6">Hit</div>
          <div class="col-3 text-right">{{attackStats.hit}}</div>
          <div class="col-3 q-px-xs">%</div>
        </div>
        <div class="row">
          <div class="col-6">Crit</div>
          <div class="col-3 text-right">{{attackStats.crit}}</div>
          <div class="col-3 q-px-xs">%</div>
        </div>
      </div>
      <div class="col-5">
        <div class="row text-h5">
          {{defender.name}}
        </div>
        <div class="row">
          <div class="col-6">Dgt</div>
          <div class="col-3 text-right">{{defenseStats.mnt}}</div>
          <div
            class="col-3 text-accent q-px-xs"
            v-if="defenseStats.double"
          >x2</div>
        </div>
        <div class="row">
          <div class="col-6">Hit</div>
          <div class="col-3 text-right">{{defenseStats.hit}}</div>
          <div class="col-3 q-px-xs">%</div>
        </div>
        <div class="row">
          <div class="col-6">Crit</div>
          <div class="col-3 text-right">{{defenseStats.crit}}</div>
          <div class="col-3 q-px-xs">%</div>
        </div>
      </div>
    </q-card>

    <unit-picker v-model="defenderId" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      attackerId: null,
      defenderId: null
    }
  },
  computed: {
    ...mapState('UnitStore', ['units']),
    ...mapState('StaticStore', ['skills', 'items']),
    attacker () {
      if (this.units && this.units[this.attackerId]) {
        return this.units[this.attackerId]
      }
      else {
        return null
      }
    },
    defender () {
      if (this.units && this.units[this.defenderId]) {
        return this.units[this.defenderId]
      }
      else {
        return null
      }
    },
    attackerStats () {
      let mystats = {}
      if (this.attacker && this.attacker.stats) {
        mystats = Object.assign({}, this.attacker.stats)
        // Skills
        Object.keys(this.attackerSkills).forEach((equipKey) => {
          let skill = this.attackerSkills[equipKey]
          if (skill.condition && skill.stats && skill.condition === "always") {
            Object.keys(skill.stats).forEach((statsKey) => {
              mystats[statsKey] += skill.stats[statsKey]
            })
          }
        })
        // Equipement
        if (this.attacker && this.attacker.equipment && this.attacker.equipment['armors-1'] && this.items.armors) {
          let armor = this.items.armors[this.attacker.equipment['armors-1']]
          if (armor && armor.stats) {
            Object.keys(armor.stats).forEach((statsKey) => {
              mystats[statsKey] += armor.stats[statsKey]
            })
          }
        }
        if (this.attacker && this.attacker.equipment && this.attacker.equipment['mounts-1'] && this.items.mounts) {
          let mount = this.items.mounts[this.attacker.equipment['mounts-1']]
          if (mount && mount.stats) {
            Object.keys(mount.stats).forEach((statsKey) => {
              mystats[statsKey] += mount.stats[statsKey]
            })
          }
        }
      }
      return mystats
    },
    defenderStats () {
      let mystats = {}
      if (this.defender && this.defender.stats) {
        mystats = Object.assign({}, this.defender.stats)
        // Skills
        Object.keys(this.defenderSkills).forEach((equipKey) => {
          let skill = this.defenderSkills[equipKey]
          if (skill.condition && skill.stats && skill.condition === "always") {
            Object.keys(skill.stats).forEach((statsKey) => {
              mystats[statsKey] += skill.stats[statsKey]
            })
          }
        })
        // Equipement
        if (this.defender && this.defender.equipment && this.defender.equipment['armors-1'] && this.items.armors) {
          let armor = this.items.armors[this.defender.equipment['armors-1']]
          if (armor && armor.stats) {
            Object.keys(armor.stats).forEach((statsKey) => {
              mystats[statsKey] += armor.stats[statsKey]
            })
          }
        }
        if (this.defender && this.defender.equipment && this.defender.equipment['mounts-1'] && this.items.mounts) {
          let mount = this.items.mounts[this.defender.equipment['mounts-1']]
          if (mount && mount.stats) {
            Object.keys(mount.stats).forEach((statsKey) => {
              mystats[statsKey] += mount.stats[statsKey]
            })
          }
        }
      }
      return mystats
    },
    attackerSkills () {
      let skillList = {}
      if (this.attacker && this.attacker.equipment) {
        Object.keys(this.attacker.equipment).forEach((equipKey) => {
          let equipValue = this.attacker.equipment[equipKey]
          if (this.skills[equipValue]) {
            skillList[equipValue] = this.skills[equipValue]
          }
        })
      }
      return skillList
    },
    defenderSkills () {
      let skillList = {}
      if (this.defender && this.defender.equipment) {
        Object.keys(this.defender.equipment).forEach((equipKey) => {
          let equipValue = this.defender.equipment[equipKey]
          if (this.skills[equipValue]) {
            skillList[equipValue] = this.skills[equipValue]
          }
        })
      }
      return skillList
    },
    attackerWeapon () {
      let weapon = null
      if (this.attacker && this.attacker.equipment['weapons-1']) {
        let weaponName = this.attacker.equipment['weapons-1']
        if (this.items.weapons[weaponName]) {
          weapon = this.items.weapons[weaponName]
        }
      }
      return {
        atk: weapon ? parseInt(weapon.atk) : 0,
        spd: weapon ? parseInt(weapon.spd) : 0,
        hit: weapon ? parseInt(weapon.hit.replace(/%/g, '')) : 0,
        crit: weapon ? parseInt(weapon.crit.replace(/%/g, '')) : 0,
        physical: weapon && weapon.damage === 'PHYS'
      }
    },
    defenderWeapon () {
      let weapon = null
      if (this.defender && this.defender.equipment['weapons-1']) {
        let weaponName = this.defender.equipment['weapons-1']
        if (this.items.weapons[weaponName]) {
          weapon = this.items.weapons[weaponName]
        }
      }
      return {
        atk: weapon ? parseInt(weapon.atk) : 0,
        spd: weapon ? parseInt(weapon.spd) : 0,
        hit: weapon ? parseInt(weapon.hit.replace(/%/g, '')) : 0,
        crit: weapon ? parseInt(weapon.crit.replace(/%/g, '')) : 0,
        physical: weapon && weapon.damage === 'PHYS'
      }
    },
    attackerCombatBuffs () {
      let mySkills = this.attackerSkills
      let buffs = { str: 0, mag: 0, spd: 0, skl: 0, def: 0, res: 0, lck: 0 }
      Object.keys(mySkills).forEach((equipKey) => {
        let skill = mySkills[equipKey]
        if (skill.condition && skill.stats && skill.condition === "attacking") {
          Object.keys(skill.stats).forEach((statsKey) => {
            buffs[statsKey] += skill.stats[statsKey]
          })
        }
      })
      return buffs
    },
    defenderCombatBuffs () {
      let mySkills = this.defenderSkills
      let buffs = { str: 0, mag: 0, spd: 0, skl: 0, def: 0, res: 0, lck: 0 }
      Object.keys(mySkills).forEach((equipKey) => {
        let skill = mySkills[equipKey]
        if (skill.condition && skill.stats && skill.condition === "attacked") {
          Object.keys(skill.stats).forEach((statsKey) => {
            buffs[statsKey] += skill.stats[statsKey]
          })
        }
      })
      return buffs
    },
    attackerStatsBuffed () {
      let myStats = this.attackerStats;
      let myBuffs = this.attackerCombatBuffs;
      let res = {}
      Object.keys(myStats).forEach((statsKey) => {
        res[statsKey] = myStats[statsKey] + myBuffs[statsKey]
      })
      return res
    },
    defenderStatsBuffed () {
      let myStats = this.defenderStats;
      let myBuffs = this.defenderCombatBuffs;
      let res = {}
      Object.keys(myStats).forEach((statsKey) => {
        res[statsKey] = myStats[statsKey] + myBuffs[statsKey]
      })
      return res
    },
    attackStats () {
      let myStats = this.attackerStatsBuffed;
      let otherStats = this.defenderStatsBuffed;
      let myWeapon = this.attackerWeapon;
      let otherWeapon = this.defenderWeapon;
      let result = {
        mntPhys: Math.max(0, myWeapon.atk + myStats.str - otherStats.def),
        mntMag: Math.max(0, myWeapon.atk + myStats.mag - otherStats.res),
        hit: Math.min(100, Math.max(0, myWeapon.hit + 3 * (myStats.skl - otherStats.skl))),
        crit: Math.max(0, myWeapon.crit + myStats.lck),
        double: (myWeapon.spd + myStats.spd > otherWeapon.spd + otherStats.spd + 3)
      }
      if (myWeapon.physical) {
        result.mnt = result.mntPhys
      }
      else {
        result.mnt = result.mntMag
      }
      return result;
    },
    defenseStats () {
      let myStats = this.defenderStatsBuffed;
      let otherStats = this.attackerStatsBuffed;
      let myWeapon = this.defenderWeapon;
      let otherWeapon = this.attackerWeapon;
      let result = {
        mntPhys: Math.max(0, myWeapon.atk + myStats.str - otherStats.def),
        mntMag: Math.max(0, myWeapon.atk + myStats.mag - otherStats.res),
        hit: Math.min(100, Math.max(0, myWeapon.hit + 3 * (myStats.skl - otherStats.skl))),
        crit: Math.max(0, myWeapon.crit + myStats.lck),
        double: (myWeapon.spd + myStats.spd > otherWeapon.spd + otherStats.spd + 3)
      }
      if (myWeapon.physical) {
        result.mnt = result.mntPhys
      }
      else {
        result.mnt = result.mntMag
      }
      return result;
      return result;
    }
  },
  components: {
    'unit-picker': require('components/UnitPicker').default
  },
}
</script>

<style>
</style>