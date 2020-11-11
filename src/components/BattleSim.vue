<template>
  <div class="col">
    <unit-picker
      v-model="attackerId"
      v-on:edit-hp-buffs="initHbDialog(attacker, attackerStats); showHpAndBuffsDialog = true"
    />

    <q-card
      class="row justify-between q-ma-md q-pa-md"
      :disabled="!(attacker && defender)"
    >
      <battle-stats
        class="col-5"
        v-model="attackerWeaponSlot"
        :unit="attacker"
        :stats="attackStats"
        :weapon="attackerWeapon"
        :valid="attacker && defender"
        :skills="attackerActiveSkills"
      />
      <q-btn
        dense
        flat
        class="col-1"
        color="primary"
        icon="compare_arrows"
        :disable="!(attacker && defender)"
        @click="swapPositions()"
      />
      <battle-stats
        class="col-5"
        v-model="defenderWeaponSlot"
        :unit="defender"
        :stats="defenseStats"
        :weapon="defenderWeapon"
        :valid="attacker && defender"
        :skills="defenderActiveSkills"
      />
    </q-card>

    <unit-picker
      v-model="defenderId"
      v-on:edit-hp-buffs="initHbDialog(defender, defenderStats); showHpAndBuffsDialog = true"
    />

    <q-dialog
      v-model="showHpAndBuffsDialog"
      @before-hide="onHbDialogClose()"
    >
      <q-card>
        <q-card-section>
          <hp-buffs-dialog v-model="temporaryHpAndBuffs" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'unit-picker': require('components/UnitPicker').default,
    'battle-stats': require('components/BattleStats').default,
    'hp-buffs-dialog': require('components/HpAndBuffsDialog').default
  },
  data () {
    return {
      attackerId: null,
      defenderId: null,
      attackerWeaponSlot: 'weapons-1',
      defenderWeaponSlot: 'weapons-1',
      showHpAndBuffsDialog: false,
      temporaryHpAndBuffs: {
        unit: null,
        hpCur: 0,
        buffs: {
          str: 0,
          mag: 0,
          spd: 0,
          skl: 0,
          lck: 0,
          def: 0,
          res: 0,
          mov: 0
        }
      },
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
      return this.getActiveSkills(this.attacker, this.attackerSkills, true, this.attackerWeapon, this.defenderWeapon)
    },
    defenderActiveSkills () {
      return this.getActiveSkills(this.defender, this.defenderSkills, false, this.defenderWeapon, this.attackerWeapon)
    },
    attackerStats () {
      return this.getStats(this.attacker, this.attackerSkills)
    },
    defenderStats () {
      return this.getStats(this.defender, this.defenderSkills)
    },
    attackerWeapon () {
      return this.getWeapon(this.attacker, this.attackerWeaponSlot)
    },
    defenderWeapon () {
      return this.getWeapon(this.defender, this.defenderWeaponSlot)
    },
    attackerCombatBuffs () {
      return this.getCombatBuffs(this.attackerActiveSkills, true)
    },
    defenderCombatBuffs () {
      return this.getCombatBuffs(this.defenderActiveSkills, false)
    },
    attackerStatsBuffed () {
      let res = this.addBuffs(this.attackerStats, this.attackerCombatBuffs)
      if (this.attacker && this.attacker.buffs) {
        res = this.addBuffs(res, this.attacker.buffs)
      }
      return res
    },
    defenderStatsBuffed () {
      let res = this.addBuffs(this.defenderStats, this.defenderCombatBuffs)
      if (this.defender && this.defender.buffs) {
        res = this.addBuffs(res, this.defender.buffs)
      }
      return res
    },
    attackStats () {
      let me = this.attacker
      let other = this.defender
      let myStats = this.attackerStatsBuffed
      let otherStats = this.defenderStatsBuffed
      let myWeapon = this.attackerWeapon
      let otherWeapon = this.defenderWeapon
      let mySkills = this.attackerActiveSkills
      let otherSkills = this.defenderActiveSkills
      return this.getBattleStats(me, other, myStats, otherStats, myWeapon, otherWeapon, mySkills, otherSkills, true);
    },
    defenseStats () {
      let me = this.defender
      let other = this.attacker
      let myStats = this.defenderStatsBuffed
      let otherStats = this.attackerStatsBuffed
      let myWeapon = this.defenderWeapon
      let otherWeapon = this.attackerWeapon
      let mySkills = this.defenderActiveSkills
      let otherSkills = this.attackerActiveSkills
      return this.getBattleStats(me, other, myStats, otherStats, myWeapon, otherWeapon, mySkills, otherSkills, false);
    }
  },
  methods: {
    ...mapActions('UnitStore', ['firebaseUpdateUnit']),
    initHbDialog (unit, unitStats) {
      this.temporaryHpAndBuffs.unit = unit
      this.temporaryHpAndBuffs.hpCur = Math.min(unit.hpCur, unitStats.hpMax)
      this.temporaryHpAndBuffs.hpMax = unitStats.hpMax
      // Reset buffs
      Object.keys(this.temporaryHpAndBuffs.buffs).forEach((buffKey) => {
        this.temporaryHpAndBuffs.buffs[buffKey] = 0
      })
      // Apply existing buffs if any
      if (unit.buffs) {
        Object.keys(unit.buffs).forEach((buffKey) => {
          this.temporaryHpAndBuffs.buffs[buffKey] = unit.buffs[buffKey]
        })
      }
      this.onHbDialogClose()
    },
    onHbDialogClose () {
      let mypayload = {
        key: this.temporaryHpAndBuffs.unit.id,
        unit: {
          hpCur: this.temporaryHpAndBuffs.hpCur,
          buffs: this.temporaryHpAndBuffs.buffs
        }
      }
      this.firebaseUpdateUnit(mypayload)
    },
    swapPositions () {
      let oldAtk = this.attackerId
      this.attackerId = this.defenderId
      this.defenderId = oldAtk

      let oldAtkW = this.attackerWeaponSlot
      this.attackerWeaponSlot = this.defenderWeaponSlot
      this.defenderWeaponSlot = oldAtkW
    },
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
    getActiveSkills (unit, unitSkills, attacking, myWeapon, enemyWeapon) {
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
              (enemyWeapon && condition === "enemy-".concat(enemyWeapon.type)) ||
              (myWeapon && condition === "self-".concat(myWeapon.type))
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
    getWeapon (unit, weaponSlot) {
      let weapon = { atk: 0, spd: 0, hit: 0, crit: 0 }
      let found = false
      // We try to find the weapon
      if (unit && unit.equipment[weaponSlot]) {
        let weaponName = unit.equipment[weaponSlot]
        if (this.items.weapons[weaponName]) {
          weapon = this.items.weapons[weaponName]
          found = true
        }
      }
      // Default to weapon-1 in case of non existing weapon 2
      if (!found && unit && unit.equipment["weapons-1"]) {
        let weaponName = unit.equipment["weapons-1"]
        if (this.items.weapons[weaponName]) {
          weapon = this.items.weapons[weaponName]
        }
      }
      return weapon
    },
    getArmor (unit) {
      let item = null
      if (unit && unit.equipment['armors-1']) {
        let itemName = unit.equipment['armors-1']
        if (this.items.armors[itemName]) {
          item = this.items.armors[itemName]
        }
      }
      return item
    },
    getMount (unit) {
      let item = null
      if (unit && unit.equipment['mounts-1']) {
        let itemName = unit.equipment['mounts-1']
        if (this.items.mounts[itemName]) {
          item = this.items.mounts[itemName]
        }
      }
      return item
    },
    getMountAndArmorWeakness (unit, unitSkills) {
      let armor = this.getArmor(unit)
      let mount = this.getMount(unit)
      let weakness = {}
      if (armor && armor.type === "heavy") {
        weakness[armor.type] = true
      }
      if (mount && mount.type === "horse") {
        weakness[mount.type] = true
      }
      else if (mount && mount.type) { // flying mount
        weakness["flying"] = true
      }
      // Skill immunity and weakness
      // Two loops because immunity has priority
      Object.keys(unitSkills).forEach((equipKey) => {
        let skill = unitSkills[equipKey]
        if (skill.effect && skill.effect.substring(0, 5) === "weak-") {
          weakness[skill.effect.substring(5)] = true
        }
      })
      Object.keys(unitSkills).forEach((equipKey) => {
        let skill = unitSkills[equipKey]
        if (skill.effect && skill.effect.substring(0, 7) === "immune-") {
          weakness[skill.effect.substring(7)] = false
        }
      })
      return weakness
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
    isWeak (unit, unitSkills, weapon) {
      let result = false
      let weakness = this.getMountAndArmorWeakness(unit, unitSkills)
      if (weapon.effective) {
        let effective = weapon.effective.split(" ")
        effective.forEach(eff => {
          if (weakness[eff]) {
            result = true
          }
        })
      }
      return result
    },
    getBattleStats (me, other, myStats, otherStats, myWeapon, otherWeapon, mySkills, otherSkills, attacking) {
      let doubleModifier = this.getDoubleModifier(mySkills, otherSkills)
      let critCancelling = this.countSkillEffect(mySkills, "no-crit") + this.countSkillEffect(otherSkills, "no-crit")
      let weak = this.isWeak(other, otherSkills, myWeapon)
      let weakMultiplier = weak ? 2 : 1
      let hitMultiplier = (attacking && myWeapon.double) ? 2 : 1
      let double = (doubleModifier > 0) || ((doubleModifier == 0) &&
        (myWeapon.spd + myStats.spd > otherWeapon.spd + otherStats.spd + 3))
      let result = {
        mntPhys: weakMultiplier * Math.max(0, myWeapon.atk + myStats.str - otherStats.def),
        mntMag: weakMultiplier * Math.max(0, myWeapon.atk + myStats.mag - otherStats.res),
        weak: weak,
        hit: Math.min(100, Math.max(0, myWeapon.hit + 3 * (myStats.skl - otherStats.skl))),
        crit: (critCancelling > 0) ? 0 : Math.max(0, myWeapon.crit + myStats.lck),
        nbHit: (double ? 2 : 1) * hitMultiplier
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
}
</script>

<style>
</style>