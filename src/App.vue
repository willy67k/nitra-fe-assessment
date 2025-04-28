<template>
  <router-view />
</template>

<script setup>
import { useCommonStore } from "./stores/common-store";

// initialize the store
const commonStore = useCommonStore();
commonStore.initOrganization();
commonStore.initLocations();
commonStore.initPaymentReaders();
</script>
