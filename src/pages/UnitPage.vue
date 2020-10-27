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
              v-for="(mastery, key) in masteries"
              :key="key"
              :unit="unit"
              :mastery="mastery"
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
              v-for="(type, key) in itemTypes"
              :key="key"
              :label="type"
            >
              <q-card>
                <q-card-section>
                  <q-list
                    bordered
                    separator
                  >
                    <q-item
                      v-for="(item, key2) in items[key]"
                      :key="key2"
                    >
                      <q-item-section>
                        <item-card
                          :itemKey="key2"
                          :itemType="key"
                        />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          v-if="!(unit.items[key] && unit.items[key][key2])"
                          dense
                          label="Acheter"
                          color="primary"
                          :disable="unit.owner !== userDetails.userId"
                          @click="buyItem(key, key2)"
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
      itemTypes: {
        weapons: 'Armes',
        armors: 'Armures',
        mounts: 'Montures',
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
    ...mapState('UserStore', ['userDetails']),
    ...mapState('UnitStore', ['units']),
    ...mapState('StaticStore', ['masteries']),
    ...mapState('StaticStore', ['items']),
    ...mapState('StaticStore', ['skills']),
    unit () {
      return this.units[this.$route.params.unitID]
    },
    inventory () {
      if (this.unit === undefined) {
        return {}
      }
      // Items
      let inv = Object.assign({}, this.unit.items)
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
