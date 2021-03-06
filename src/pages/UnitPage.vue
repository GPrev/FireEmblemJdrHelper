<template>
  <div class="col">
    <unit-card :unit="unit" />

    <div>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          name="equip"
          label="Equipement"
        />
        <q-tab
          name="train"
          label="Entrainement"
        />
        <q-tab
          name="shop"
          label="Magasin"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel name="equip">
          <q-list
            v-if="unit"
            bordered
            separator
          >
            <q-item
              v-for="template in equipTemplate"
              :key="template.subtype"
            >
              <q-item-section>
                <q-item-label>
                  {{template.name}}
                </q-item-label>
                <q-list>
                  <q-item
                    class="q-px-none"
                    v-for="i in template.count"
                    :key="template.subtype + i"
                  >
                    <q-card class="full-width">
                      <q-expansion-item group="equipgroup">
                        <template v-slot:header>
                          <q-item-section>
                            <item-card
                              v-if="template.type === 'items'"
                              :itemType="template.subtype"
                              :itemKey="unit.equipment[template.subtype+'-'+i]"
                            />
                            <skill-card
                              v-else
                              :skillKey="unit.equipment[template.subtype+'-'+i]"
                            />
                          </q-item-section>
                        </template>

                        <q-list
                          v-if="unit && unit.owner && unit.owner === userDetails.userId"
                          bordered
                          separator
                        >
                          <q-item
                            clickable
                            v-ripple
                            v-for="(itemval, itemkey) in inventory[template.subtype]"
                            :key="template.subtype+i+itemkey"
                            @click="equip(template.subtype, i, itemkey)"
                          >
                            <item-card
                              v-if="template.type === 'items'"
                              :itemKey="itemkey"
                              :itemType="template.subtype"
                            />
                            <skill-card
                              v-else
                              :skillKey="itemkey"
                            >
                            </skill-card>
                          </q-item>
                        </q-list>
                      </q-expansion-item>
                    </q-card>
                  </q-item>
                </q-list>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="train">
          <div class="row justify-around">
            <mastery-card
              class="col-3"
              v-for="masteryKey in masteriesOrder"
              :key="masteryKey"
              :unit="unit"
              :mastery="masteries[masteryKey]"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="shop">
          <q-list
            bordered
            separator
          >
            <q-expansion-item
              group="shopgroup"
              header-class="text-primary"
              v-for="category in itemCategories"
              :key="category.key"
              :label="category.name"
            >
              <q-card>
                <q-card-section>
                  <q-list
                    bordered
                    separator
                  >
                    <q-item
                      v-for="(item, itemKey) in itemsCategorized[category.key]"
                      :key="itemKey"
                    >
                      <q-item-section>
                        <item-card
                          :itemKey="itemKey"
                          :itemType="category.subtype"
                        />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          v-if="!(unit.items[category.subtype] && unit.items[category.subtype][itemKey])"
                          dense
                          label="Acheter"
                          color="primary"
                          :disable="unit.owner !== userDetails.userId"
                          @click="buyItem(category.subtype, itemKey)"
                        />
                        <div
                          v-else
                          class="q-mx-xs"
                        >
                          Acheté
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'unit-card': require('components/UnitCard.vue').default,
    'mastery-card': require('components/MasteryCard.vue').default,
    'item-card': require('components/ItemCard.vue').default,
    'skill-card': require('components/SkillCard.vue').default,
  },
  data () {
    return {
      tab: 'equip',
      itemCategories: [
        { key: 'sword', subtype: 'weapons', name: 'Epées' },
        { key: 'lance', subtype: 'weapons', name: 'Lances' },
        { key: 'axe', subtype: 'weapons', name: 'Haches' },
        { key: 'brawl', subtype: 'weapons', name: 'Gantelets' },
        { key: 'bow', subtype: 'weapons', name: 'Arcs' },
        { key: 'dagger', subtype: 'weapons', name: 'Dagues' },
        { key: 'anima', subtype: 'weapons', name: 'Tomes anima' },
        { key: 'light', subtype: 'weapons', name: 'Tomes de lumière' },
        { key: 'dark', subtype: 'weapons', name: 'Tomes de ténèbres' },
        { key: 'heavy', subtype: 'armors', name: 'Armures lourdes' },
        { key: 'magic', subtype: 'armors', name: 'Armures magiques' },
        { key: 'horse', subtype: 'mounts', name: 'Chevaux' },
        { key: 'pegasus', subtype: 'mounts', name: 'Pégases' },
        { key: 'wyvern', subtype: 'mounts', name: 'Wyvernes' },
      ],
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
    ...mapState('UserStore', ['userDetails']),
    ...mapState('UnitStore', ['units']),
    ...mapState('StaticStore', ['masteries']),
    ...mapState('StaticStore', ['items']),
    ...mapState('StaticStore', ['skills']),
    unit () {
      return this.units[this.$route.params.unitID]
    },
    masteriesOrder () {
      let myMasteries = {}
      Object.keys(this.masteries).forEach((masteryKey) => {
        let mastery = this.masteries[masteryKey]
        if (mastery.index) {
          myMasteries[mastery.index] = masteryKey
        }
      })
      return myMasteries
    },
    itemsCategorized () {
      let myitems = {}
      Object.keys(this.items).forEach((itemType) => {
        Object.keys(this.items[itemType]).forEach((itemKey) => {
          let item = this.items[itemType][itemKey]
          if (!item.hidden) {
            let category = item.type ? item.type : itemType
            if (myitems[category] === undefined) {
              myitems[category] = {}
            }
            myitems[category][itemKey] = item
          }
        })
      })
      return myitems
    },
    inventory () {
      if (this.unit === undefined) {
        return {}
      }
      let inv = {}
      // Items
      Object.keys(this.unit.items).forEach((itemType) => {
        inv[itemType] = Object.assign({}, this.unit.items[itemType])
      })
      // Skills
      Object.keys(this.unit.masteries).forEach((masteryKey) => {
        let masteryLevel = this.unit.masteries[masteryKey]
        for (var i = 1; i <= masteryLevel; i++) {
          let masterySkills = this.masteries[masteryKey].skills["lv" + i]
          for (var skillIndex in masterySkills) {
            let skillKey = masterySkills[skillIndex]
            let skill = this.skills[skillKey]

            if (skill && skill.type !== undefined) {
              if (inv[skill.type] === undefined) {
                inv[skill.type] = { none: true }
              }
              inv[skill.type][skillKey] = true
            }
          }
        }
      })
      // Deal with the "none" item
      Object.keys(inv).forEach((categoryKey) => {
        // Delete "none"
        if (inv[categoryKey].hasOwnProperty("none")) {
          delete inv[categoryKey]["none"]
        }
        // Replace it. This way it will be displayed at the bottom
        inv[categoryKey]["none"] = true
      })
      // Return
      return inv
    }
  },
  methods: {
    ...mapActions('UnitStore', ['firebaseUpdateUnit']),
    buyItem (itemType, item) {
      let payload = {
        key: this.unit.id,
        unit: {}
      }
      let path = 'items/' + itemType + '/' + item
      payload.unit[path] = true
      this.firebaseUpdateUnit(payload)
    },
    equip (subtype, i, itemkey) {
      let payload = {
        key: this.unit.id,
        unit: {}
      }
      let path = 'equipment/' + subtype + '-' + i
      payload.unit[path] = itemkey
      this.firebaseUpdateUnit(payload)
    }
  }
}
</script>
