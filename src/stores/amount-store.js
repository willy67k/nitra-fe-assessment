import numeral from "numeral";
import { defineStore, acceptHMRUpdate } from "pinia";
import { PaymentMethodEnum } from "src/enums/payment-method";

export const useAmountStore = defineStore("amount", {
  state: () => {
    return {
      paymentMethod: PaymentMethodEnum.Cash,
      amount: 0,
      description: "",
      isTouched: false,
      reader: null,
      location: null,

      merchantFeePercentage: 0,
      merchantFeeAmount: 0,
      patientFeePercentage: 0,
      patientFeeAmount: 0,

      oldPatientFeeAmount: 0,
      oldPatientFeePercentage: 0,
    };
  },
  getters: {
    fixedTaxPrice: (state) => {
      return state.location
        ? numeral(Math.ceil(+numeral(state.amount).multiply(state.location.taxRate).multiply(100).value()))
            .divide(100)
            .value()
        : 0;
    },
    afterTaxPrice(state) {
      return numeral(state.amount).add(this.fixedTaxPrice).value();
    },

    patientPayFee(state) {
      return numeral(this.afterTaxPrice).multiply(state.patientFeePercentage).divide(100).add(state.patientFeeAmount).format("0.00");
    },
  },
  actions: {
    setOldValue() {
      this.oldPatientFeePercentage = this.patientFeePercentage;
      this.oldPatientFeeAmount = this.patientFeeAmount;
    },
    resetToOldValue() {
      this.patientFeePercentage = this.oldPatientFeePercentage;
      this.patientFeeAmount = this.oldPatientFeeAmount;
    },
    reset() {
      this.patientFeePercentage = 0;
      this.patientFeeAmount = 0;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAmountStore, import.meta.hot));
}
