<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useCommonStore } from "./stores/common-store";

// initialize the store
const commonStore = useCommonStore();
onMounted(() => {
  commonStore.initOrganization();
  commonStore.initLocations();
  commonStore.initPaymentReaders();
});
</script>
