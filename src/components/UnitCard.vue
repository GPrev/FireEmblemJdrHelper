<template>
  <q-card class="my-card">
    <q-card-section horizontal>
      <q-img
        class="col-5"
        :src="picture"
      />
      <q-card-section
        vertical
        class="col"
      >
        <div class="row justify-between">
          <div>
            {{unit.name}}
          </div>
          <div>
            {{ownerID}}
          </div>
        </div>
        <div>
          HP : {{unit.hpCur}}/{{unit.stats.hpMax}}
        </div>
        <div class="row">
          <div class="col">
            ATQ : {{unit.stats.atk}}
          </div>
          <div class="col">
            VIT : {{unit.stats.spd}}
          </div>
          <div class="col">
            TEC : {{unit.stats.skl}}
          </div>
        </div>
        <div class="row">
          <div class="col">
            DEF : {{unit.stats.def}}
          </div>
          <div class="col">
            RES : {{unit.stats.res}}
          </div>
          <div class="col">
            CHA : {{unit.stats.lck}}
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['unit'],
  computed: {
    ...mapState('UserStore', ['users']),
    ownerID () {
      if (this.unit.owner && this.users[this.unit.owner]) {
        return this.users[this.unit.owner].name
      }
      else return ""
    },
    picture () {
      if (this.unit.picture) {
        return this.unit.picture
      }
      else return ""
    }
  },
}
</script>
