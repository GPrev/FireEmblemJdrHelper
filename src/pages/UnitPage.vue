<template>
  <div class="col">
    <unit-card :unit="unit" />

    <q-card>
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
          <div class="text-h6">Mails</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
    </q-card>
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
      tab: 'shop',
      itemTypes: {
        weapons: 'Armes',
        armour: 'Armures',
        mounts: 'Montures',
      }
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
