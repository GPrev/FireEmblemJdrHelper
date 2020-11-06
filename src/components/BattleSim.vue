<template>
  <div class="col">
    <unit-picker v-model="attackerId" />

    <q-card
      class="row justify-between q-ma-md q-pa-md"
      :disabled="!(attacker && defender)"
    >
      <battle-stats
        class="col-5"
        :unit="attacker"
        :stats="attackStats"
        :valid="attacker && defender"
        :skills="attackerActiveSkillsNoStyles"
      />
      <battle-stats
        class="col-5"
        :unit="defender"
        :stats="defenseStats"
        :valid="attacker && defender"
        :skills="defenderActiveSkillsNoStyles"
      />
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
    attackerActiveSkills () {
      return this.getActiveSkills(this.attacker, this.attackerSkills, true)
    },
    defenderActiveSkills () {
      return this.getActiveSkills(this.defender, this.defenderSkills, false)
    },
    attackerActiveSkillsNoStyles () {
      let skills = this.attackerActiveSkills
      let result = {}
      Object.keys(skills).forEach((skillKey) => {
        let skill = skills[skillKey]
        if (skill.type === "skills") {
          result[skillKey] = skills[skillKey]
        }
      })
      return result
    },
    defenderActiveSkillsNoStyles () {
      let skills = this.defenderActiveSkills
      let result = {}
      Object.keys(skills).forEach((skillKey) => {
        let skill = skills[skillKey]
        if (skill.type === "skills") {
          result[skillKey] = skills[skillKey]
        }
      })
      return result
    },
    attackerStats () {
      return this.getStats(this.attacker, this.attackerActiveSkills)
    },
    defenderStats () {
      return this.getStats(this.defender, this.defenderActiveSkills)
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
    getActiveSkills (unit, unitSkills, attacking, enemyWeapon) {
      let skillList = {}
      Object.keys(unitSkills).forEach((skillKey) => {
        let skill = unitSkills[skillKey]
        if (skill.condition && skill.stats && (
          skill.condition === "always" ||
          (attacking && skill.condition === "attacking") ||
          (!attacking && skill.condition === "attacked") ||
          (skill.condition === "hp-low" && (100 * unit.hpCur / unit.stats.hpMax) <= skill.threshold) ||
          (skill.condition === "hp-high" && (100 * unit.hpCur / unit.stats.hpMax) >= skill.threshold) ||
          (enemyWeapon && skill.condition === "close" && enemyWeapon.por - max < 2) ||
          (enemyWeapon && skill.condition === "distant" && enemyWeapon.por - max > 1) ||
          (enemyWeapon && skill.condition === enemyWeapon.type)
        )) {
          skillList[skillKey] = unitSkills[skillKey]
        }
      })
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
      let weapon = { atk: 0, spd: 0, hit: 0, crit: 0 }
      if (unit && unit.equipment['weapons-1']) {
        let weaponName = unit.equipment['weapons-1']
        if (this.items.weapons[weaponName]) {
          weapon = this.items.weapons[weaponName]
        }
      }
      return weapon
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
      if (myWeapon.magical) {
        result.mnt = result.mntMag
      }
      else {
        result.mnt = result.mntPhys
      }
      return result;
    }
  },
  components: {
    'unit-picker': require('components/UnitPicker').default,
    'battle-stats': require('components/BattleStats').default
  },
}
</script>

<style>
</style>