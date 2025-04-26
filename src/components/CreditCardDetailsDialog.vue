<template>
  <q-dialog v-model="prompt">
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
                v-model.number="cardNumber"
                class="custom-input"
                input-class="text-black"
                label="Card Number"
                lazy-rules
                :rules="[
                  (val) => {
                    return (val && val > 0) || 'Please type your card number';
                  },
                ]"
              />
            </div>
            <div class="col-6 q-mb-sm" style="padding: 0 6px">
              <q-input
                standout="bg-gray"
                bg-color="gray-50"
                v-model="expirationDate"
                class="custom-input"
                input-class="text-black"
                label="Expiration Date"
                lazy-rules
                :rules="[
                  (val) => {
                    return (val && val > 0) || 'Please type your expiration date';
                  },
                ]"
              />
            </div>
            <div class="col-6 q-mb-sm" style="padding: 0 6px">
              <q-input
                standout="bg-gray"
                bg-color="gray-50"
                v-model.number="cvc"
                class="custom-input"
                input-class="text-black"
                label="CVC"
                lazy-rules
                :rules="[(val) => (val && val > 0) || 'Please type CVC on card']"
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
                v-model.number="zip"
                class="custom-input"
                input-class="text-black"
                label="ZIP"
                lazy-rules
                :rules="[(val) => (val && val > 0) || 'Please type your ZIP code']"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row items-center justify-between">
            <q-btn type="reset" flat class="custom-btn-action" color="gray-600" label="Cancel" />
            <q-btn type="submit" unelevated class="custom-btn-action" color="orange-400"> Pay $27.21 </q-btn>
          </div>
        </q-card-section>
      </q-form>

      <!-- <q-card-actions align="between" class="q-py-md q-px-lg">
        <q-btn flat style="padding: 8px 16px; text-transform: unset; border-radius: 6px" color="gray-600" label="Cancel" v-close-popup />
        <q-btn unelevated style="padding: 8px 16px; text-transform: unset; border-radius: 6px" color="orange-400" v-close-popup> Update </q-btn>
      </q-card-actions> -->
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
  text-transform: unset;
  border-radius: 6px;
}
</style>

<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
const $q = useQuasar();
const prompt = ref(false);
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
  if (!name.value) {
    console.log($q);
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "You need to accept the license and terms first",
    });
  } else {
    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Submitted",
    });
  }
}

function onReset() {
  name.value = null;
  cardNumber.value = null;
  expirationDate.value = null;
  cvc.value = null;
  country.value = null;
  zip.value = null;
}

function open() {
  prompt.value = true;
}

defineExpose({
  open,
});
</script>
