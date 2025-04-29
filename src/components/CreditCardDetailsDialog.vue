<template>
  <q-dialog :model-value="props.isCreditOpen" @show="onShow" @hide="onHide">
    <q-card style="width: 500px; border-radius: 8px">
      <q-card-section class="q-pt-lg q-px-lg q-pb-xs">
        <div class="row items-center justify-between q-mb-md">
          <h5 class="text-bold">Credit Card Details</h5>
          <q-btn class="text-gray-300" icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>
      <q-form @submit="onSubmit" @reset="onReset">
        <q-card-section class="q-px-lg q-pb-xs">
          <div class="row" style="margin: 0 -6px">
            <div class="col-12 q-mb-sm" style="padding: 0 6px">
              <q-input
                standout="bg-gray"
                bg-color="gray-50"
                v-model="name"
                class="custom-input"
                input-class="text-black"
                label="Name on Card"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Please type your name on card']"
              />
            </div>
            <div class="col-12 q-mb-sm" style="padding: 0 6px">
              <q-input
                standout="bg-gray"
                bg-color="gray-50"
                v-model="cardNumber"
                @update:model-value="onUpdateCardNumber"
                class="custom-input"
                input-class="text-black"
                label="Card Number"
                lazy-rules
                :rules="[
                  (val) => {
                    return (val && val.length > 18) || 'Please type your card number';
                  },
                ]"
              />
            </div>
            <div class="col-6 q-mb-sm" style="padding: 0 6px">
              <q-input
                standout="bg-gray"
                bg-color="gray-50"
                v-model="expirationDate"
                @update:model-value="onUpdateExpirationDate"
                class="custom-input"
                input-class="text-black"
                label="Expiration Date"
                lazy-rules
                :rules="[
                  (val) => {
                    return (val && val.length > 4) || 'Please type your expiration date';
                  },
                ]"
              />
            </div>
            <div class="col-6 q-mb-sm" style="padding: 0 6px">
              <q-input
                standout="bg-gray"
                bg-color="gray-50"
                v-model="cvc"
                @update:model-value="(value) => onUpdateOnlyNumber(value, 'cvc')"
                class="custom-input"
                input-class="text-black"
                label="CVC"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Please type CVC on card']"
              />
            </div>
            <div class="col-6 q-mb-sm" style="padding: 0 6px">
              <q-select
                standout="bg-gray"
                bg-color="gray-50"
                v-model="country"
                class="custom-input"
                input-class="text-black"
                :options="options"
                label="Country"
                :rules="[(val) => val || 'Please type your country']"
              />
            </div>
            <div class="col-6 q-mb-sm" style="padding: 0 6px">
              <q-input
                standout="bg-gray"
                bg-color="gray-50"
                v-model="zip"
                @update:model-value="(value) => onUpdateOnlyNumber(value, 'zip')"
                class="custom-input"
                input-class="text-black"
                label="ZIP"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Please type your ZIP code']"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row items-center justify-between">
            <q-btn flat no-caps class="custom-btn-action" color="gray-600" label="Cancel" v-close-popup />
            <q-btn type="submit" unelevated no-caps class="custom-btn-action" color="orange-400"> Pay ${{ totalAmount }} </q-btn>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
:deep(.custom-input) {
  &.q-field--highlighted {
    .q-field__control {
      background-color: #ebeeef;
      box-shadow: none;
    }
    .q-field__marginal {
      color: #5c6970;
    }
  }

  .q-field__native .ellipsis {
    color: #000000;
  }
}

:deep(.custom-btn-action) {
  padding: 8px 16px;
  border-radius: 6px;
}
</style>

<script setup>
import { reactive, ref } from "vue";
const props = defineProps({
  isCreditOpen: {
    type: Boolean,
    default: false,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:isCreditOpen"]);

const name = ref(null);
const cardNumber = ref(null);
const expirationDate = ref(null);
const cvc = ref(null);
const country = ref(null);
const zip = ref(null);
const options = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "Mexico", value: "mx" },
];
function onSubmit() {
  onReset();
  onHide();
}

function onUpdateCardNumber(value) {
  value = value.replace(/\D/g, "");
  value = value.slice(0, 16);
  value = value.match(/.{1,4}/g)?.join(" ") || "";
  cardNumber.value = value;
}

function onUpdateExpirationDate(value) {
  value = value.replace(/\D/g, "");
  value = value.slice(0, 4);
  if (value.length > 2) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }
  expirationDate.value = value;
}

const obj = reactive({ cvc, zip });

function onUpdateOnlyNumber(value, target) {
  value = value.replace(/\D/g, "");
  obj[target] = value;
}

function onReset() {
  name.value = null;
  cardNumber.value = null;
  expirationDate.value = null;
  cvc.value = null;
  country.value = null;
  zip.value = null;
}

function onShow() {
  emit("update:isCreditOpen", true);
}

function onHide() {
  emit("update:isCreditOpen", false);
}
</script>
