<template>
  <q-toolbar style="padding: 0">
    <h5 class="text-black text-bold q-mr-lg">{{ $t("msg.home.CollectPayment") }}</h5>
    <div>
      <q-select
        class="q-field-custom"
        v-model="location"
        :options="locationOptions"
        borderless
        bg-color="gray-100"
        standout="bg-gray-100 text-black"
        dropdown-icon="fa-solid fa-chevron-down text-gray-600"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-location-dot" class="text-gray-600" @click.stop.prevent />
        </template>
      </q-select>
    </div>
    <q-slide-transition>
      <div v-show="isTouched" style="margin-left: auto">
        <q-btn flat no-caps @click="reset" class="custom-btn-reset text-sm text-red-400" color="red-400" label="Reset Payment" />
      </div>
    </q-slide-transition>
  </q-toolbar>
  <q-card flat bordered class="full-card">
    <div class="card-left q-pt-8xl">
      <div class="row column items-center full-width">
        <p class="text-gray-700 text-lg q-mb-lg">{{ $t("msg.home.EnterAmount") }}</p>
        <div class="q-mb-6xl" style="position: relative">
          <sup style="position: relative; right: 4px; top: -16px">
            <i class="text-black text-bold text-4xl fa-solid fa-dollar-sign"></i>
          </sup>
          <input type="number" :value="amount" @input="onInputValue" @blur="isTouched = true" class="custom-input text-black text-bold text-7xl" :style="{ width: inputWidth + 'px' }" />
          <span ref="inputShadow" class="text-black text-bold text-7xl" style="position: absolute; visibility: hidden; white-space: pre">{{ amount }}</span>
        </div>
        <div style="width: 100%; max-width: 400px" class="q-px-md q-pb-md">
          <q-input v-model="description" type="textarea" class="custom-text-area" rows="4" filled placeholder="Description (Optional)" />
        </div>
      </div>
    </div>
    <q-card flat class="card-right q--avoid-card-border">
      <q-card-section>
        <p class="text-bold">{{ $t("common.Summary") }}</p>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row justify-between q-px-md q-py-nm">
          <p class="text-xs text-gray-700">{{ $t("common.Subtotal") }}</p>
          <p class="text-xs text-gray-700">${{ amount }}</p>
        </div>
        <div class="row justify-between q-px-md q-py-nm">
          <p class="text-xs text-gray-700">{{ $t("common.Tax") }}({{ fixedTax }}%)</p>
          <p class="text-xs text-gray-700">${{ fixedTaxPrice }}</p>
        </div>

        <q-separator color="teal-700" />

        <div class="row justify-between q-px-md q-py-lg">
          <p class="text-xs">{{ $t("common.Total") }}</p>
          <p class="text-xs">${{ afterTaxPrice }}</p>
        </div>

        <div class="q-mb-lg">
          <q-btn-toggle
            v-model="paymentMethod"
            text-color="teal-100"
            color="white"
            toggle-color="teal-100"
            style="border: 1px solid #a9d4d6; border-radius: 6px"
            no-caps
            spread
            unelevated
            :options="[
              { value: PaymentMethodEnum.Cash, slot: 'cash' },
              { value: PaymentMethodEnum.Card, slot: 'card' },
            ]"
          >
            <template v-slot:cash>
              <div class="row items-center no-wrap">
                <q-icon right class="custom-icon" name="fa-solid fa-sack-dollar text-teal-500" />
                <span class="text-teal-700 text-xss">{{ $t("msg.home.PaybyCash") }} ${{ afterTaxPrice }}</span>
              </div>
            </template>
            <template v-slot:card>
              <div class="row items-center no-wrap">
                <q-icon right class="custom-icon" name="fa-solid fa-credit-card text-teal-500" />
                <span class="text-teal-700 text-xss">{{ $t("msg.home.PaybyCard") }} ${{ payByCardFee }}</span>
              </div>
            </template>
          </q-btn-toggle>
        </div>

        <q-slide-transition>
          <div v-show="paymentMethod === PaymentMethodEnum.Card">
            <div class="row justify-between q-px-md q-pb-lg">
              <p class="text-xs text-gray-700">
                {{ $t("msg.home.PatientCardProcessingFee") }} <u @click="() => (isFeeOpen = true)" class="text-teal-400 q-ml-nm" style="cursor: pointer">{{ $t("common.Edit") }}</u>
              </p>
              <p class="text-xs">${{ patientPayFee }}</p>
            </div>
          </div>
        </q-slide-transition>

        <q-separator color="teal-700" />

        <div class="row justify-between items-center q-px-md q-py-lg">
          <p v-if="paymentMethod === PaymentMethodEnum.Cash" class="text-xs">{{ $t("msg.home.PaybyCashTotal") }}</p>
          <p v-else class="text-xs">{{ $t("msg.home.PaybyCardTotal") }}</p>
          <p :class="`text-xl text-bold ${isTouched && isBelowMinimum ? 'text-red-400' : 'text-green-500'}`">${{ totalAmount }}</p>
        </div>
        <q-slide-transition>
          <p v-show="isTouched && isBelowMinimum" class="text-xss text-red-500 q-px-md" style="position: absolute; margin-top: -20px">
            {{ $t("msg.home.TotalAmountFallsBelowTheRequiredMinimumOf") }} ${{ commonStore.minimumAmount.toFixed(2) }}
          </p>
        </q-slide-transition>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-select
          class="q-field-custom sub"
          style="display: inline-block"
          v-model="location"
          :options="locationOptions"
          borderless
          standout="bg-gray-100 text-black"
          dropdown-icon="fa-solid fa-chevron-down fa-xs"
        >
          <template v-slot:prepend>
            <q-icon name="place" @click.stop.prevent />
          </template>
        </q-select>

        <q-select
          v-if="paymentMethod === PaymentMethodEnum.Card"
          standout="bg-gray"
          bg-color="gray-50"
          v-model="reader"
          class="custom-select"
          input-class="text-black"
          :options="readerOptions"
          :label="$t('msg.home.DeviceReader')"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section style="flex: auto">
                <q-icon v-if="scope.opt.status === 'online'" name="fa-solid fa-circle-dot text-green-500" />
                <q-icon v-else name="fa-solid fa-circle-xmark text-gray-400" />
              </q-item-section>
              <q-item-section style="margin-left: 12px">
                <q-item-label>{{ scope.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-section class="q-my-sm">
        <q-slide-transition>
          <div v-show="paymentMethod === PaymentMethodEnum.Cash">
            <div v-if="paymentMethod === PaymentMethodEnum.Cash">
              <q-btn @click="() => null" unelevated no-caps icon="fa-solid fa-money-bill-wave" color="orange-400" class="custom-btn full-width q-mb-nm">
                <span class="text-sm">{{ $t("msg.home.LogPayment") }}</span>
              </q-btn>
            </div>
          </div>
        </q-slide-transition>
        <q-slide-transition>
          <div v-show="paymentMethod === PaymentMethodEnum.Card">
            <div v-if="paymentMethod === PaymentMethodEnum.Card">
              <q-btn @click="() => (isReaderOpen = true)" unelevated no-caps icon="fa-solid fa-mobile-screen" color="orange-400" class="custom-btn full-width q-mb-nm" :disable="!reader">
                <span class="text-sm">{{ $t("msg.home.InitiatePaymentOnReader") }}</span>
              </q-btn>
              <q-btn @click="() => (isCreditOpen = true)" unelevated no-caps icon="fa-solid fa-credit-card text-orange-300" color="orange-50" class="custom-btn full-width q-mb-nm">
                <span class="text-sm text-orange-400">{{ $t("msg.home.InputCardNumberManually") }}</span>
              </q-btn>
            </div>
          </div>
        </q-slide-transition>
      </q-card-section>
    </q-card>
  </q-card>

  <edit-merchant-processing-fee-dialog v-model:is-fee-open="isFeeOpen" />
  <credit-card-details-dialog v-model:is-credit-open="isCreditOpen" :totalAmount="totalAmount" />
  <payment-reader-dialog v-model:is-reader-open="isReaderOpen" />
</template>

<style lang="scss" scoped>
:deep(.q-field-custom) {
  &.sub {
    .q-field__control {
      padding: 0;
      background-color: transparent;
    }
  }

  .q-field__prepend {
    padding-right: 8px;
    font-size: 12px;
    opacity: 0.4;
  }

  .q-field__append {
    padding-left: 4px;
    font-size: 12px;
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
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0;
  height: calc(100vh - 104px);
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
    height: auto;
  }
}
.q-card {
  .card-left {
    width: 100%;
    border-right: 1px solid #e0e0e0;
    border-radius: 0px !important;
    height: 100%;
    display: flex;

    @media screen and (max-width: 767px) {
      border-bottom: 1px solid #e0e0e0 !important;
      border-right: none;
    }
  }

  .card-right {
    width: 344px;
    height: 100%;
    flex: 1 0 344px;

    @media screen and (max-width: 767px) {
      width: 100%;
    }
  }
}

.custom-icon {
  font-size: 12px;
  margin-right: 8px;
  margin-left: 0px;
}

.custom-input {
  height: 55px;
  outline: none;
  border: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
    -webkit-appearance: none; /* WebKit-based browsers */
    appearance: none;
  }
}

:deep(.custom-text-area) {
  width: 100%;

  .q-field__control {
    &::before,
    &::after {
      display: none;
    }
  }

  textarea {
    max-height: 400px;
  }
}

:deep(.custom-btn) {
  border-radius: 6px;
  .q-icon {
    margin-right: 8px;
    font-size: 16px;
  }
}

:deep(.custom-btn-reset) {
  padding: 8px 16px;
  border-radius: 6px;
}

:deep(.custom-select) {
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
</style>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import numeral from "numeral";
import EditMerchantProcessingFeeDialog from "components/EditMerchantProcessingFeeDialog.vue";
import CreditCardDetailsDialog from "components/CreditCardDetailsDialog.vue";
import PaymentReaderDialog from "components/PaymentReaderDialog.vue";
import { PaymentMethodEnum } from "src/enums/payment-method";
import { useCommonStore } from "src/stores/common-store";
import { useAmountStore } from "src/stores/amount-store";
import { storeToRefs } from "pinia";

const commonStore = useCommonStore();
const amountStore = useAmountStore();

const { paymentMethod, amount, description, isTouched, location, reader, fixedTaxPrice, afterTaxPrice, patientPayFee } = storeToRefs(amountStore);

const inputShadow = ref(null);
const inputWidth = ref(60);

const onInputValue = async ($event) => {
  let value = $event.target.value;
  value = value
    .replace(/[^\d.]/g, "")
    .replace(/^(\d*)\.(\d*)\.(.*)/, "$1.$2")
    .replace(/^0+(\d)/, "$1");
  if (value.includes(".")) {
    const parts = value.split(".");
    parts[1] = parts[1].slice(0, 2);
    value = parts.join(".");
  }

  amount.value = +value;

  await nextTick();

  inputWidth.value = inputShadow.value.offsetWidth + 40;
};

watch(amount, () => {
  if (!amount.value || amount.value < 0) {
    amount.value = 0;
  }
  amount.value = amount.value.toString();
  if (amount.value.includes(".")) {
    const parts = amount.value.split(".");
    parts[1] = parts[1].slice(0, 2);
    amount.value = parts.join(".");
  }
  amount.value;
});

const reset = () => {
  amount.value = 0;
  isTouched.value = false;
  reader.value = null;
  amountStore.reset();
};

const locationOptions = computed(() => {
  return commonStore.locations.map((location) => ({ label: location.name, value: location.id, taxRate: location.taxRate }));
});

watch(locationOptions, () => {
  location.value = locationOptions.value.length != 0 ? locationOptions.value[0] : null;
});

const readerOptions = computed(() => {
  if (!location.value)
    return [
      {
        label: "No Device Reader Available",
        value: 0,
        disable: true,
      },
    ];
  return commonStore.paymentReaders
    .filter((reader) => reader.locationId === location.value.value)
    .map((reader) => ({
      label: reader.label,
      value: reader.readerId,
      status: reader.status,
      locationId: reader.locationId,
      disable: reader.status !== "online" && true,
    }));
});

watch(location, () => {
  reader.value = null;
});

const fixedTax = computed(() => {
  return location.value ? numeral(location.value.taxRate).multiply(100).format("0.00") : 0;
});

const totalAmount = computed(() => {
  if (paymentMethod.value === PaymentMethodEnum.Cash) {
    return numeral(afterTaxPrice.value).format("0.00");
  }
  return payByCardFee.value;
});

const isBelowMinimum = computed(() => {
  return totalAmount.value < commonStore.minimumAmount;
});

const payByCardFee = computed(() => {
  return numeral(afterTaxPrice.value).add(patientPayFee.value).format("0.00");
});

const isFeeOpen = ref(false);
const isCreditOpen = ref(false);
const isReaderOpen = ref(false);
</script>
