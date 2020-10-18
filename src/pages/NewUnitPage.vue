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
        v-model="character.name"
        label="Nom du personnage"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Merci de choisir un nom']"
      />

      <q-input
        filled
        v-model="character.picture"
        label="Image du personnage"
      />

      <up-down
        class=".col"
        label="HP"
        v-model="character.stats.hpMax"
        :min="bounds.hpMax.min"
        :max="bounds.hpMax.max"
      />
      <up-down
        class=".col"
        label="ATQ"
        v-model="character.stats.atk"
        :min="bounds.atk.min"
        :max="bounds.atk.max"
      />
      <up-down
        class=".col"
        label="VIT"
        v-model="character.stats.spd"
        :min="bounds.spd.min"
        :max="bounds.spd.max"
      />
      <up-down
        class=".col"
        label="TEC"
        v-model="character.stats.skl"
        :min="bounds.skl.min"
        :max="bounds.skl.max"
      />
      <up-down
        class=".col"
        label="DEF"
        v-model="character.stats.def"
        :min="bounds.def.min"
        :max="bounds.def.max"
      />
      <up-down
        class=".col"
        label="RES"
        v-model="character.stats.res"
        :min="bounds.res.min"
        :max="bounds.res.max"
      />
      <up-down
        class=".col"
        label="CHA"
        v-model="character.stats.lck"
        :min="bounds.lck.min"
        :max="bounds.lck.max"
      />

      <div class="row justify-end">
        <q-btn
          class=".col"
          label="Créer"
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
  },

  methods: {
    ...mapActions('UnitStore', ['firebaseCreateUnit']),
    onSubmit () {
      this.character.owner = this.userDetails.userId
      this.character.hpCur = this.character.stats.hpMax
      this.firebaseCreateUnit({ character: this.character })
      this.$router.push('/')
    }
  },

  data () {
    return {
      character: {
        name: null,
        picture: null,
        stats: {
          hpMax: 30,
          atk: 25,
          spd: 25,
          skl: 25,
          def: 25,
          res: 25,
          lck: 25,
        }
      },
      bounds: {
        hpMax: { min: 25, max: 35 },
        atk: { min: 22, max: 28 },
        spd: { min: 22, max: 28 },
        skl: { min: 22, max: 28 },
        def: { min: 22, max: 28 },
        res: { min: 22, max: 28 },
        lck: { min: 22, max: 28 },
      }
    }
  },

  mounted () {
    this.character.owner = this.userDetails.userId
  }
}
</script>

<style>
</style>