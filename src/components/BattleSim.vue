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
        :skills="attackerActiveSkills"
      />
      <battle-stats
        class="col-5"
        :unit="defender"
        :stats="defenseStats"
        :valid="attacker && defender"
        :skills="defenderActiveSkills"
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
      return this.getActiveSkills(this.attacker, this.attackerSkills, true, this.defenderWeapon)
    },
    defenderActiveSkills () {
      return this.getActiveSkills(this.defender, this.defenderSkills, false, this.attackerWeapon)
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
      return this.getCombatBuffs(this.attackerActiveSkills, true)
    },
    defenderCombatBuffs () {
      return this.getCombatBuffs(this.defenderActiveSkills, false)
    },
    attackerStatsBuffed () {
      return this.addBuffs(this.attackerStats, this.attackerCombatBuffs)
    },
    defenderStatsBuffed () {
      return this.addBuffs(this.defenderStats, this.defenderCombatBuffs)
    },
    attackStats () {
      let myStats = this.attackerStatsBuffed
      let otherStats = this.defenderStatsBuffed
      let myWeapon = this.attackerWeapon
      let otherWeapon = this.defenderWeapon
      let mySkills = this.attackerActiveSkills
      let otherSkills = this.defenderActiveSkills
      return this.getBattleStats(myStats, otherStats, myWeapon, otherWeapon, mySkills, otherSkills, true);
    },
    defenseStats () {
      let myStats = this.defenderStatsBuffed
      let otherStats = this.attackerStatsBuffed
      let myWeapon = this.defenderWeapon
      let otherWeapon = this.attackerWeapon
      let mySkills = this.defenderActiveSkills
      let otherSkills = this.attackerActiveSkills
      return this.getBattleStats(myStats, otherStats, myWeapon, otherWeapon, mySkills, otherSkills, false);
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
        // Skills with stats that are always active are already in the unit stats
        if (!(skill.stats && skill.condition === "always") && skill.condition) {
          let conditions = skill.condition.split(" ")
          let active = true
          conditions.forEach((condition) => {
            if (!(condition && (
              condition === "always" ||
              (attacking && condition === "attacking") ||
              (!attacking && condition === "attacked") ||
              ((condition === "hp-low") && ((100 * unit.hpCur / unit.stats.hpMax) <= skill.threshold)) ||
              ((condition === "hp-high") && ((100 * unit.hpCur / unit.stats.hpMax) >= skill.threshold)) ||
              (enemyWeapon && condition === "close" && enemyWeapon["por-max"] < 2) ||
              (enemyWeapon && condition === "distant" && enemyWeapon["por-max"] > 1) ||
              (enemyWeapon && condition === enemyWeapon.type)
            ))) {
              active = false
            }
          })
          if (active) {
            skillList[skillKey] = unitSkills[skillKey]
          }
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
        if (skill.stats) {
          Object.keys(skill.stats).forEach((statsKey) => {
            buffs[statsKey] += skill.stats[statsKey]
          })
        }
      })
      return buffs
    },
    countSkillEffect (skills, effect) {
      let count = 0
      Object.keys(skills).forEach((skillKey) => {
        let skill = skills[skillKey]
        if (skill.effect === effect) {
          count += 1
        }
      })
      return count
    },
    getDoubleModifier (mySkills, otherSkills) {
      let doubleModifier = 0
      Object.keys(mySkills).forEach((skillKey) => {
        let skill = mySkills[skillKey]
        if (skill.effect === "double") {
          doubleModifier += 1
        }
        else if (skill.effect === "no-double" || skill.effect === "windsweep") {
          doubleModifier -= 1
        }
      })
      // Enemy double negation applies
      doubleModifier -= this.countSkillEffect(otherSkills, "no-double")

      return doubleModifier
    },
    getBattleStats (myStats, otherStats, myWeapon, otherWeapon, mySkills, otherSkills, attacking) {
      let doubleModifier = this.getDoubleModifier(mySkills, otherSkills)
      let critCancelling = this.countSkillEffect(mySkills, "no-crit") + this.countSkillEffect(otherSkills, "no-crit")
      let result = {
        mntPhys: Math.max(0, myWeapon.atk + myStats.str - otherStats.def),
        mntMag: Math.max(0, myWeapon.atk + myStats.mag - otherStats.res),
        hit: Math.min(100, Math.max(0, myWeapon.hit + 3 * (myStats.skl - otherStats.skl))),
        crit: (critCancelling > 0) ? 0 : Math.max(0, myWeapon.crit + myStats.lck),
        double: (doubleModifier > 0) || ((doubleModifier == 0) &&
          (myWeapon.spd + myStats.spd > otherWeapon.spd + otherStats.spd + 3))
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