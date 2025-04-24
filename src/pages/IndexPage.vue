<template>
  <q-toolbar style="padding: 0">
    <h5 class="text-black text-bold q-mr-lg">Collect Payment</h5>
    <div>
      <q-select
        class="q-field-custom"
        v-model="model"
        :options="options"
        borderless
        bg-color="gray-100"
        standout="bg-gray-100 text-black"
        dropdown-icon="fa-solid fa-chevron-down fa-xs"
        @update:model-value="onInputValue"
      >
        <template v-slot:prepend>
          <q-icon name="place" @click.stop.prevent />
        </template>
      </q-select>
    </div>
  </q-toolbar>
  <q-card flat bordered class="full-card">
    <div class="card-left q-pt-8xl">
      <div class="fit column content-center text-center">
        <p class="text-gray-700 text-lg">Enter Amount</p>
        <p class="text-bold text-7xl">
          <sup class="text-bold text-4xl">
            <i class="fa-solid fa-dollar-sign"></i>
          </sup>
          <span class="text-bold text-7xl">0</span>
        </p>
        <q-input v-model="text" type="textarea" class="custuom-text-area" style="width: 400px" rows="4" filled placeholder="Description (Optional)" />
      </div>
    </div>
    <q-card flat class="card-right q--avoid-card-border">
      <q-card-section>
        <p class="text-bold">Summary</p>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row justify-between q-px-md q-py-sm q-my-xs">
          <p class="text-xs text-gray-700">Subtotal</p>
          <p class="text-xs text-gray-700">$0</p>
        </div>
        <div class="row justify-between q-px-md q-py-sm q-my-xs">
          <p class="text-xs text-gray-700">Tax(6.00%)</p>
          <p class="text-xs text-gray-700">$0</p>
        </div>

        <q-separator color="teal-700" />

        <div class="row justify-between q-px-md q-py-lg">
          <p class="text-xs">Total</p>
          <p class="text-xs">$0</p>
        </div>

        <div class="q-mb-lg">
          <q-btn-toggle
            v-model="paymentMethod"
            text-color="teal-100"
            color="white"
            toggle-color="teal-100"
            style="border: 1px solid #a9d4d6"
            spread
            unelevated
            :options="[
              { value: 'cash', slot: 'cash' },
              { value: 'card', slot: 'card' },
            ]"
          >
            <template v-slot:cash>
              <div class="row items-center no-wrap">
                <q-icon right name="fa-solid fa-sack-dollar fa-sm text-teal-300" />
                <span class="text-teal-700 text-xss">Pay by Cash $0</span>
              </div>
            </template>
            <template v-slot:card>
              <div class="row items-center no-wrap">
                <q-icon right name="fa-solid fa-credit-card fa-sm text-teal-300" />
                <span class="text-teal-700 text-xss">Pay by Card $0</span>
              </div>
            </template>

            <!-- <q-btn icon="fa-solid fa-sack-dollar fa-sm text-teal-300" color="teal-100" text-color="teal-100">
              <span class="text-teal-700 text-xss">Pay by Cash $0</span>
            </q-btn>
            <q-btn outline icon="fa-solid fa-credit-card" color="teal-100" text-color="teal-100">
              <span class="text-teal-700 text-xss">Pay by Card $0</span>
            </q-btn> -->
          </q-btn-toggle>
        </div>

        <q-separator color="teal-700" />

        <div class="row justify-between items-center q-px-md q-py-lg">
          <p class="text-xs">Pay by Cash Total</p>
          <p class="text-xl text-green-500 text-bold">$0</p>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-select
          class="q-field-custom sub"
          style="display: inline-block"
          v-model="model"
          :options="options"
          borderless
          standout="bg-gray-100 text-black"
          dropdown-icon="fa-solid fa-chevron-down fa-xs"
          @update:model-value="onInputValue"
        >
          <template v-slot:prepend>
            <q-icon name="place" @click.stop.prevent />
          </template>
        </q-select>
      </q-card-section>

      <q-card-section class="q-my-sm">
        <q-btn icon="fa-solid fa-money-bill-wave fa-sm" color="orange-400" class="full-width">
          <span class="text-xss">Log Payment</span>
        </q-btn>
      </q-card-section>
    </q-card>
  </q-card>
  <q-page class="flex flex-center"> </q-page>
</template>

<style lang="scss">
.q-field-custom {
  &.sub {
    .q-field__control {
      padding: 0;
    }
  }

  .q-field__control {
    border-radius: 8px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    height: 37px;
    min-height: auto;

    .q-field__native {
      min-height: unset;
      padding: 0;
    }
  }
}

.full-card {
  border-radius: 8px;
  padding: 0;
  height: calc(100vh - 104px);
  display: flex;
}

.card-left {
  width: 100%;
  border-right: 1px solid #e0e0e0;
  height: 100%;

  display: flex;
}

.card-right {
  width: 344px;
  border-left: 1px solid #e0e0e0;
  height: 100%;
  flex: 1 0 344px;
}

.custuom-text-area {
  .q-field__control {
    &::before,
    &::after {
      display: none;
    }
  }
}
</style>

<script setup>
import { ref } from "vue";
const model = ref("New York Clinic");
const paymentMethod = ref("cash");
const onInputValue = (value) => {
  console.log("Selected value:", value);
};

const options = [
  { label: "New York Clinic", value: "1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];
</script>
