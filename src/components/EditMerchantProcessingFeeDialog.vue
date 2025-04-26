<template>
  <q-dialog v-model="prompt" persistent>
    <q-card style="width: 500px; border-radius: 8px">
      <q-card-section class="q-pt-lg q-px-lg q-pb-xs">
        <div class="row items-center justify-between q-mb-md">
          <h5 class="text-bold">Edit Merchant Processing Fee</h5>
          <q-btn class="text-gray-300" icon="close" flat round dense v-close-popup />
        </div>
        <p class="text-xs text-gray-700">Only applies to this transaction</p>
      </q-card-section>

      <q-card-section class="q-px-lg">
        <q-slider
          class="custom-slider q-mt-xl"
          style="padding: 0 20px"
          v-model="firstModel"
          color="teal"
          :label-value="`${firstModel}%\n$0.25`"
          label-always
          marker-labels
          :min="0"
          :max="3.5"
          :step="0.01"
        >
          <template v-slot:marker-label-group="scope">
            <div :class="[`text-gray-800`, scope.markerList[0].classes]" :style="{ ...scope.markerList[0].style, cursor: 'pointer' }" @click="firstModel = scope.markerList[0].value">
              <span class="text-gray-800 text-sm">
                {{ scope.markerList[0].value }}
              </span>
            </div>
            <div
              :class="[`text-gray-800`, scope.markerList[scope.markerList.length - 1].classes]"
              :style="{ ...scope.markerList[scope.markerList.length - 1].style, cursor: 'pointer' }"
              @click="firstModel = scope.markerList[scope.markerList.length - 1].value"
            >
              <span class="text-gray-800 text-sm"> {{ scope.markerList[scope.markerList.length - 1].value }}% </span>
            </div>
          </template>
        </q-slider>
      </q-card-section>

      <q-card-section class="q-px-lg q-pt-none q-pb-xs">
        <q-separator />
      </q-card-section>

      <q-card-section class="q-px-lg">
        <div class="row items-center no-wrap q-mb-sm q-pb-xs" style="white-space: nowrap">
          <p class="text-sm text-gray-900 q-mr-sm q-pr-xs">Merchant processing fee</p>
          <q-input
            type="number"
            v-model.number="numberA"
            min="0"
            step="0.05"
            class="custom-input q-mr-sm"
            input-class="text-bold text-black text-md"
            bg-color="gray-50"
            standout="bg-gray"
            :dense="true"
          >
            <template v-slot:append>
              <span class="text-md">%</span>
            </template>
          </q-input>
          <p class="text-xss text-gray-700">/ 3.5%</p>
          <i class="fa-solid fa-plus text-xs text-gray-700 q-mx-xs" style="opacity: 0.4"></i>
          <q-input
            type="number"
            v-model.number="numberA"
            min="0"
            step="0.05"
            class="custom-input q-mr-sm"
            input-class="text-bold text-black text-md text-right"
            bg-color="gray-50"
            standout="bg-gray"
            :dense="true"
          >
            <template v-slot:prepend>
              <span class="text-md">$</span>
            </template>
          </q-input>
          <p class="text-xss text-gray-700">/ $0.10</p>
        </div>
        <div class="row items-center no-wrap q-mb-sm q-pb-xs" style="white-space: nowrap">
          <p class="text-sm text-gray-900 q-mr-sm q-pr-xs">Patient processing fee</p>
          <q-input
            type="number"
            v-model.number="numberA"
            min="0"
            step="0.05"
            class="custom-input q-mr-sm"
            input-class="text-bold text-black text-md"
            bg-color="gray-50"
            standout="bg-gray"
            :dense="true"
          >
            <template v-slot:append>
              <span class="text-md">%</span>
            </template>
          </q-input>
          <p class="text-xss text-gray-700">/ 3.5%</p>
          <i class="fa-solid fa-plus text-xs text-gray-700 q-mx-xs" style="opacity: 0.4"></i>
          <q-input
            type="number"
            v-model.number="numberA"
            min="0"
            step="0.05"
            class="custom-input q-mr-sm"
            input-class="text-bold text-black text-md text-right"
            bg-color="gray-50"
            standout="bg-gray"
            :dense="true"
          >
            <template v-slot:prepend>
              <span class="text-md">$</span>
            </template>
          </q-input>
          <p class="text-xss text-gray-700">/ $0.10</p>
        </div>
        <div class="text-center q-mb-md">
          <u class="text-teal-400 text-xs" style="cursor: pointer">Set patient processing fee to 0</u>
        </div>
        <div class="">
          <p class="text-sm text-bold text-justify">On this $25.00 transaction, you pay $0.32, and patient pays $0.71</p>
        </div>
      </q-card-section>

      <q-card-actions align="between" class="q-py-md q-px-lg">
        <q-btn flat style="padding: 8px 16px; text-transform: unset; border-radius: 6px" color="gray-600" label="Cancel" v-close-popup />
        <q-btn unelevated style="padding: 8px 16px; text-transform: unset; border-radius: 6px" color="orange-400" v-close-popup> Update </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.custom-slider {
  .q-slider__track-container {
    margin-bottom: 10px;

    &::before,
    &::after {
      content: "";
      width: 1px;
      height: 15px;
      display: inline-block;
      background: #c6cdd0;
      position: absolute;
    }

    &::before {
      left: 20px;
      top: 16px;
    }
    &::after {
      right: 20px;
      top: 16px;
    }
  }

  .q-slider__text {
    white-space: pre;
  }
}

.custom-input {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
    -webkit-appearance: none; /* WebKit-based browsers */
    appearance: none;
  }
  .q-field__control,
  .q-field__marginal {
    height: 32px;
  }
  &.q-field--highlighted {
    .q-field__control {
      background-color: #ebeeef;
      box-shadow: none;
    }
    .q-field__marginal {
      color: #5c6970;
    }
  }
}
</style>

<script setup>
import { ref } from "vue";
const prompt = ref(true);
const firstModel = ref(1);
const numberA = ref("");
</script>
