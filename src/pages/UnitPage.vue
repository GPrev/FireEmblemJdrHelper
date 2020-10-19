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
                      {{i}}
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
                        <q-item-label>{{item.name}}</q-item-label>
                        <q-item-label
                          caption
                          v-if="key == 'weapons'"
                        >ATQ {{item.atk}} PRC {{item.hit}}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          v-if="!unit.items[key][key2]"
                          dense
                          label="Acheter"
                          color="primary"
                          :disable="unit.owner !== userDetails.userId"
                          @click="buyItem(key, key2)"
                        />
                        <div v-else>
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
  },
  data () {
    return {
      tab: 'equip',
      itemTypes: {
        weapons: 'Armes',
        armour: 'Armures',
        mounts: 'Montures',
      },
      equipTemplate: [
        { name: 'Arme', type: 'items', subtype: 'weapons', count: 1 },
        { name: 'Armure', type: 'items', subtype: 'armours', count: 1 },
        { name: 'Monture', type: 'items', subtype: 'mounts', count: 1 },
        { name: 'Styles', type: 'skills', subtype: 'styles', count: 2 },
        { name: 'Compétences', type: 'skills', subtype: 'skills', count: 2 },
      ]
    }
  },
  computed: {
    ...mapState('UserStore', ['userDetails']),
    ...mapState('UnitStore', ['units']),
    ...mapState('StaticStore', ['masteries']),
    ...mapState('StaticStore', ['items']),
    unit () {
      return this.units[this.$route.params.unitID]
    },
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
    }
  }
}
</script>
