<template>
  <div
    class="q-pa-md"
    style="max-width: 400px"
  >

    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="unit.name"
        label="Nom du personnage"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Merci de choisir un nom']"
      />

      <div class="row">
        <q-img
          class="col-2 q-mr-xs"
          spinner-color="white"
          :src="unit.picture"
        >
          <template v-slot:error>
            <q-icon
              class="absolute-center"
              size="md"
              name="image_not_supported"
              color="primary"
            />
          </template>
        </q-img>
        <q-input
          class="col"
          filled
          v-model="unit.picture"
          label="Image du personnage"
        />
      </div>

      <up-down
        class=".col"
        label="PV"
        v-model="unit.stats.hpMax"
        :min="bounds.hpMax.min"
        :max="bounds.hpMax.max"
      />
      <up-down
        class=".col"
        label="FOR"
        v-model="unit.stats.str"
        :min="bounds.str.min"
        :max="bounds.str.max"
      />
      <up-down
        class=".col"
        label="MAG"
        v-model="unit.stats.mag"
        :min="bounds.mag.min"
        :max="bounds.mag.max"
      />
      <up-down
        class=".col"
        label="VIT"
        v-model="unit.stats.spd"
        :min="bounds.spd.min"
        :max="bounds.spd.max"
      />
      <up-down
        class=".col"
        label="TEC"
        v-model="unit.stats.skl"
        :min="bounds.skl.min"
        :max="bounds.skl.max"
      />
      <up-down
        class=".col"
        label="DEF"
        v-model="unit.stats.def"
        :min="bounds.def.min"
        :max="bounds.def.max"
      />
      <up-down
        class=".col"
        label="RES"
        v-model="unit.stats.res"
        :min="bounds.res.min"
        :max="bounds.res.max"
      />
      <up-down
        class=".col"
        label="CHA"
        v-model="unit.stats.lck"
        :min="bounds.lck.min"
        :max="bounds.lck.max"
      />

      <div class="row justify-end">
        <q-btn
          class=".col"
          :label="editMode?'Modifier':'Créer'"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'up-down': require('components/UpDownField.vue').default
  },

  computed: {
    ...mapState('UserStore', ['userDetails']),
    ...mapState('UnitStore', ['units']),
    editMode () {
      return (this.$route.params.unitID) ? true : false
    }
  },

  methods: {
    ...mapActions('UnitStore', ['firebaseCreateUnit', 'firebaseUpdateUnit']),
    onSubmit () {
      if (this.editMode) {
        let payload = {
          key: this.unit.id,
          unit: {
            'name': this.unit.name,
            'picture': this.unit.picture,
            'stats': this.unit.stats
          }
        }
        this.firebaseUpdateUnit(payload)
      }
      else {
        this.unit.owner = this.userDetails.userId
        this.unit.hpCur = this.unit.stats.hpMax
        this.firebaseCreateUnit({ unit: this.unit })
      }
      this.$router.push('/')
    }
  },

  data () {
    return {
      unit: {
        name: null,
        picture: null,
        stats: {
          hpMax: 30,
          str: 30,
          mag: 30,
          spd: 30,
          skl: 30,
          def: 30,
          res: 30,
          lck: 5,
          mov: 3
        },
        masteries: { sword: 0 },
        items: {
          weapons: { none: true },
          armors: { none: true },
          mounts: { none: true }
        },
        equipment: { weapon: 'none' },
      },
      bounds: {
        hpMax: { min: 25, max: 35 },
        str: { min: 27, max: 33 },
        mag: { min: 27, max: 33 },
        spd: { min: 27, max: 33 },
        skl: { min: 27, max: 33 },
        def: { min: 27, max: 33 },
        res: { min: 27, max: 33 },
        lck: { min: 5, max: 5 },
      }
    }
  },

  mounted () {
    if (this.editMode) {
      // Edit
      let editedUnit = this.units[this.$route.params.unitID]
      this.unit.name = editedUnit.name
      this.unit.id = editedUnit.id
      this.unit.picture = editedUnit.picture
      this.unit.stats = Object.assign(this.unit.stats, editedUnit.stats)
    }
    else {
      // New
      this.unit.owner = this.userDetails.userId
    }
  }
}
</script>

<style>
</style>