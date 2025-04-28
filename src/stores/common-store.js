import { defineStore, acceptHMRUpdate } from "pinia";
import { getLocations, getOrganization, getPaymentReaders } from "src/mock";

export const useCommonStore = defineStore("common", {
  state: () => {
    return {
      minimumAmount: 0.5,
      organization: {},
      locations: [],
      paymentReaders: [],
    };
  },
  actions: {
    async initOrganization() {
      try {
        const { data } = await getOrganization();
        this.organization = data;
      } catch (error) {
        throw new Error(error);
      }
    },
    async initLocations() {
      try {
        const { data } = await getLocations();
        this.locations = data;
      } catch (error) {
        throw new Error(error);
      }
    },
    async initPaymentReaders() {
      try {
        const { data } = await getPaymentReaders();
        this.paymentReaders = data;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommonStore, import.meta.hot));
}
