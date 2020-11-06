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
    attackerSkills () {
      return this.getSkills(this.attacker)
    },
    defenderSkills () {
      return this.getSkills(this.defender)
    },
    attackerStats () {
      return this.getStats(this.attacker, this.attackerSkills)
    },
    defenderStats () {
      return this.getStats(this.defender, this.defenderSkills)
    },
    attackerWeapon () {
      return this.getWeapon(this.attacker)
    },
    defenderWeapon () {
      return this.getWeapon(this.defender)
    },
    attackerCombatBuffs () {
      return this.getCombatBuffs(this.attackerSkills, true)
    },
    defenderCombatBuffs () {
      return this.getCombatBuffs(this.defenderSkills, false)
    },
    attackerStatsBuffed () {
      return this.addBuffs(this.attackerStats, this.attackerCombatBuffs)
    },
    defenderStatsBuffed () {
      return this.addBuffs(this.defenderStats, this.defenderCombatBuffs)
    },
    attackStats () {
      let myStats = this.attackerStatsBuffed;
      let otherStats = this.defenderStatsBuffed;
      let myWeapon = this.attackerWeapon;
      let otherWeapon = this.defenderWeapon;
      return this.getBattleStats(myStats, otherStats, myWeapon, otherWeapon, true);
    },
    defenseStats () {
      let myStats = this.defenderStatsBuffed;
      let otherStats = this.attackerStatsBuffed;
      let myWeapon = this.defenderWeapon;
      let otherWeapon = this.attackerWeapon;
      return this.getBattleStats(myStats, otherStats, myWeapon, otherWeapon, false);
    }
  },
  methods: {
    addBuffs (stats, buffs) {
      let res = {}
      Object.keys(stats).forEach((statsKey) => {
        res[statsKey] = stats[statsKey] + (buffs[statsKey] ? buffs[statsKey] : 0)
      })
      console.log(stats, buffs, res)
      return res
    },
    getSkills (unit) {
      let skillList = {}
      if (unit && unit.equipment) {
        Object.keys(unit.equipment).forEach((equipKey) => {
          let equipValue = unit.equipment[equipKey]
          if (this.skills[equipValue]) {
            skillList[equipValue] = this.skills[equipValue]
          }
        })
      }
      return skillList
    },
    getStats (unit, unitSkills) {
      let mystats = {}
      if (unit && unit.stats) {
        mystats = Object.assign({}, unit.stats)
        // Skills
        Object.keys(unitSkills).forEach((equipKey) => {
          let skill = unitSkills[equipKey]
          if (skill.condition && skill.stats && skill.condition === "always") {
            Object.keys(skill.stats).forEach((statsKey) => {
              mystats[statsKey] += skill.stats[statsKey]
            })
          }
        })
        // Equipement
        if (unit && unit.equipment && unit.equipment['armors-1'] && this.items.armors) {
          let armor = this.items.armors[unit.equipment['armors-1']]
          if (armor && armor.stats) {
            Object.keys(armor.stats).forEach((statsKey) => {
              mystats[statsKey] += armor.stats[statsKey]
            })
          }
        }
        if (unit && unit.equipment && unit.equipment['mounts-1'] && this.items.mounts) {
          let mount = this.items.mounts[unit.equipment['mounts-1']]
          if (mount && mount.stats) {
            Object.keys(mount.stats).forEach((statsKey) => {
              mystats[statsKey] += mount.stats[statsKey]
            })
          }
        }
      }
      return mystats
    },
    getWeapon (unit) {
      let weapon = null
      if (unit && unit.equipment['weapons-1']) {
        let weaponName = unit.equipment['weapons-1']
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
    getCombatBuffs (unitSkills, attacking) {
      let buffs = { str: 0, mag: 0, spd: 0, skl: 0, def: 0, res: 0, lck: 0 }
      Object.keys(unitSkills).forEach((equipKey) => {
        let skill = unitSkills[equipKey]
        if (skill.condition && skill.stats && (
          (attacking && skill.condition === "attacking") ||
          (!attacking && skill.condition === "defending")
        )) {
          Object.keys(skill.stats).forEach((statsKey) => {
            buffs[statsKey] += skill.stats[statsKey]
          })
        }
      })
      return buffs
    },
    getBattleStats (myStats, otherStats, myWeapon, otherWeapon, attacking) {
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
    }
  },
  components: {
    'unit-picker': require('components/UnitPicker').default
  },
}
</script>

<style>
</style>