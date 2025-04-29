<template>
  <q-dialog persistent :model-value="props.isFeeOpen" @show="onShow" @hide="onHide">
    <q-card style="width: 500px; border-radius: 8px">
      <q-card-section class="q-pt-lg q-px-lg q-pb-xs">
        <div class="row items-center justify-between q-mb-md">
          <h5 class="text-bold">{{ $t("msg.merchant.EditMerchantProcessingFee") }}</h5>
          <q-btn class="text-gray-300" icon="close" flat round dense v-close-popup />
        </div>
        <p class="text-xs text-gray-700">{{ $t("msg.merchant.OnlyAppliesToThisTransaction") }}</p>
      </q-card-section>

      <q-card-section class="q-px-lg">
        <q-slider
          class="custom-slider q-mt-xl"
          style="padding: 0 20px"
          v-model.number="merchantFeePercentage"
          color="teal"
          :label-value="`${merchantFeePercentageDisplay}%\n$${merchantAfterPercentage}`"
          label-always
          marker-labels
          :min="0"
          :max="+totalProcessingFeePercentage"
          :step="0.01"
        >
          <template v-slot:marker-label-group="scope">
            <div :class="[`text-gray-800`, scope.markerList[0].classes]" :style="{ ...scope.markerList[0].style, cursor: 'pointer' }" @click="merchantFeePercentage = scope.markerList[0].value">
              <span class="text-gray-800 text-sm">
                {{ scope.markerList[0].value }}
              </span>
            </div>
            <div
              :class="[`text-gray-800`, scope.markerList[scope.markerList.length - 1].classes]"
              :style="{ ...scope.markerList[scope.markerList.length - 1].style, cursor: 'pointer' }"
              @click="merchantFeePercentage = scope.markerList[scope.markerList.length - 1].value"
            >
              <span class="text-gray-800 text-sm"> {{ scope.markerList[scope.markerList.length - 1].value }}% </span>
            </div>
          </template>
        </q-slider>
      </q-card-section>

      <q-card-section class="q-px-lg q-pt-none q-pb-xs">
        <q-separator />
      </q-card-section>

      <q-card-section class="q-px-lg q-pb-sm">
        <div class="row items-center no-wrap q-mb-nm" style="white-space: nowrap">
          <p class="text-sm text-gray-900 q-mr-nm">{{ $t("msg.merchant.MerchantProcessingFee") }}</p>
          <q-input
            type="number"
            v-model.number="merchantFeePercentageDisplay"
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
          <p class="text-xss text-gray-700">/ {{ totalProcessingFeePercentage }}%</p>
          <i class="fa-solid fa-plus text-xs text-gray-700 q-mx-xs" style="opacity: 0.4"></i>
          <q-input
            type="number"
            v-model.number="merchantFeeAmount"
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
          <p class="text-xss text-gray-700">/ ${{ totalProcessingFeeFixed }}</p>
        </div>
        <div class="row items-center no-wrap q-mb-nm" style="white-space: nowrap">
          <p class="text-sm text-gray-900 q-mr-nm">{{ $t("msg.merchant.PatientProcessingFee") }}</p>
          <q-input
            type="number"
            v-model.number="patientFeePercentage"
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
          <p class="text-xss text-gray-700">/ {{ totalProcessingFeePercentage }}%</p>
          <i class="fa-solid fa-plus text-xs text-gray-700 q-mx-xs" style="opacity: 0.4"></i>
          <q-input
            type="number"
            v-model.number="patientFeeAmount"
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
          <p class="text-xss text-gray-700">/ ${{ totalProcessingFeeFixed }}</p>
        </div>
        <div class="text-center q-mb-md">
          <u class="text-teal-400 text-xs" style="cursor: pointer" @click="() => setPatientFee(0)">{{ $t("msg.merchant.SetPatientProcessingFeeTo") }} 0</u>
        </div>
        <div class="">
          <p class="text-sm text-bold" style="min-height: 42px">
            {{
              $t("msg.merchant.OnThisTransactionYouPayAndpatientPays", {
                amountFixed,
                merchantPayFee,
                patientPayFee,
              })
            }}
          </p>
        </div>
      </q-card-section>

      <q-card-actions align="between" class="q-py-md q-px-lg">
        <q-btn flat no-caps class="custom-btn-action" color="gray-600" :label="$t('common.Cancel')" v-close-popup @click="amountStore.resetToOldValue" />
        <q-btn unelevated no-caps class="custom-btn-action" color="orange-400" v-close-popup>{{ $t("common.Update") }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
:deep(.custom-slider) {
  .q-slider__track-container {
    margin-bottom: 10px;

    svg {
      color: white;
      filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3));
    }

    .q-slider__pin {
      filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3));

      &::before {
        border-top: 6px solid #ffffff;
      }
    }

    .q-slider__text-container {
      background: #ffffff;
    }

    .q-slider__text {
      color: #2e3538;
    }

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

:deep(.custom-input) {
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

:deep(.custom-btn-action) {
  padding: 8px 16px;
  border-radius: 6px;
}
</style>

<script setup>
import numeral from "numeral";
import { storeToRefs } from "pinia";
import { useAmountStore } from "src/stores/amount-store";
import { useCommonStore } from "src/stores/common-store";
import { computed, watch } from "vue";
const props = defineProps({
  isFeeOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:isFeeOpen"]);
const commonStore = useCommonStore();
const amountStore = useAmountStore();

const { amount, afterTaxPrice, merchantFeePercentage, merchantFeeAmount, patientFeePercentage, patientFeeAmount, patientPayFee } = storeToRefs(amountStore);

const amountFixed = computed(() => {
  return numeral(amount.value).format("0.00");
});

const totalProcessingFeePercentage = computed(() => {
  if (!commonStore.organization) return 0;
  return numeral(commonStore.organization.totalProcessingFeePercentage).multiply(100).format("0.0");
});

const totalProcessingFeeFixed = computed(() => {
  if (!commonStore.organization) return 0;
  return numeral(commonStore.organization.totalProcessingFeeFixed).format("0.00");
});

watch(totalProcessingFeePercentage, () => {
  merchantFeePercentage.value = +(totalProcessingFeePercentage.value - 0);
  patientFeePercentage.value = 0;
});

watch(totalProcessingFeeFixed, () => {
  merchantFeeAmount.value = totalProcessingFeeFixed.value - 0;
  patientFeeAmount.value = 0;
});

watch(merchantFeePercentage, () => {
  if (+merchantFeePercentage.value < 0) {
    merchantFeePercentage.value = 0;
  }
  if (!commonStore.organization) return;
  if (+merchantFeePercentage.value > +totalProcessingFeePercentage.value) {
    merchantFeePercentage.value = +totalProcessingFeePercentage.value;
  }
  patientFeePercentage.value = numeral(totalProcessingFeePercentage.value).subtract(merchantFeePercentage.value).format("0.00");
});

watch(patientFeePercentage, () => {
  if (+patientFeePercentage.value < 0) {
    patientFeePercentage.value = numeral(0).format("0.00");
  }
  if (!commonStore.organization) return;
  if (+patientFeePercentage.value > +totalProcessingFeePercentage.value) {
    merchantFeePercentage.value = +totalProcessingFeePercentage.value;
  }
  merchantFeePercentage.value = numeral(totalProcessingFeePercentage.value).subtract(patientFeePercentage.value).value();
});

watch(merchantFeeAmount, () => {
  if (+merchantFeeAmount.value < 0) {
    merchantFeeAmount.value = numeral(0).format("0.00");
  }
  if (!commonStore.organization) return;
  if (+merchantFeeAmount.value > +totalProcessingFeeFixed.value) {
    merchantFeeAmount.value = totalProcessingFeeFixed.value;
  }
  patientFeeAmount.value = numeral(totalProcessingFeeFixed.value).subtract(merchantFeeAmount.value).format("0.00");
});

watch(patientFeeAmount, () => {
  if (+patientFeeAmount.value < 0) {
    patientFeeAmount.value = numeral(0).format("0.00");
  }
  if (!commonStore.organization) return;
  if (+patientFeeAmount.value > +totalProcessingFeeFixed.value) {
    patientFeeAmount.value = totalProcessingFeeFixed.value;
  }
  merchantFeeAmount.value = numeral(totalProcessingFeeFixed.value).subtract(patientFeeAmount.value).format("0.00");
});

const merchantFeePercentageDisplay = computed({
  get() {
    return numeral(merchantFeePercentage.value).format("0.00");
  },
  set(value) {
    merchantFeePercentage.value = value;
  },
});

const merchantAfterPercentage = computed(() => {
  return numeral(merchantFeePercentage.value).multiply(amount.value).divide(100).format("0.00");
});

const merchantPayFee = computed(() => {
  return numeral(afterTaxPrice.value).multiply(merchantFeePercentage.value).divide(100).add(merchantFeeAmount.value).format("0.00");
});

function setPatientFee(value) {
  patientFeePercentage.value = value;
  patientFeeAmount.value = value;
}

function onShow() {
  emit("update:isFeeOpen", true);
  amountStore.setOldValue();
}

function onHide() {
  emit("update:isFeeOpen", false);
}
</script>
