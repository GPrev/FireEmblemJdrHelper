<template>
  <q-card class="my-card">
    <q-card-section horizontal>
      <q-img
        class="col-5"
        src="https://cdn.quasar.dev/img/parallax1.jpg"
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
            {{unit.owner}}
          </div>
        </div>
        <div>
          HP : {{unit.hpCur}}/{{unit.hpMax}}
        </div>
        <div class="row">
          <div class="col">
            ATQ : {{unit.atk}}
          </div>
          <div class="col">
            VIT : {{unit.vit}}
          </div>
          <div class="col">
            TEC : {{unit.tec}}
          </div>
        </div>
        <div class="row">
          <div class="col">
            DEF : {{unit.def}}
          </div>
          <div class="col">
            RES : {{unit.res}}
          </div>
          <div class="col">
            CHA : {{unit.cha}}
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ['unit']
}
</script>
