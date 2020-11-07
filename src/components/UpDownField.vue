<template>
  <div class="row">
    <q-input
      class="col"
      filled
      :readonly="!editable"
      :label="label"
      v-model="myvalue"
    />
    <q-list
      class=".col"
      bordered
      vertical
    >
      <q-item
        class="q-pa-none"
        dense
      >
        <q-btn
          flat
          padding="none sm"
          icon="keyboard_arrow_up"
          @click="function() { if(!max || myvalue<max){myvalue += 1} }"
        />
      </q-item>
      <q-item
        class="q-pa-none"
        dense
      >
        <q-btn
          flat
          padding="none sm"
          icon="keyboard_arrow_down"
          @click="function() { if(!min || myvalue>min){myvalue -= 1} }"
        />
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  props: ['value', 'label', 'min', 'max', 'editable'],
  computed: {
    myvalue: {
      get () {
        return this.value;
      },
      set (val) {
        this.$emit('input', val);
      }
    }
  }
}
</script>

<style>
</style>