<template>
  <q-dialog persistent :model-value="props.isReaderOpen" @show="onShow" @hide="onHide" class="full-card">
    <q-card class="q-pt-lg" style="width: 500px; border-radius: 8px">
      <q-card-section class="q-pb-4xl q-px-lg">
        <div class="text-center">
          <img src="src/assets/payment.svg" style="width: 63px" alt="payment" />
        </div>
      </q-card-section>

      <q-card-section class="q-px-lg">
        <p class="text-bold text-center q-mb-sm"><q-icon name="fa-solid fa-eye text-gray-700 q-mr-sm q-mb-xs" />{{ $t("msg.reader.ReviewDetailsWithPatient") }}</p>
        <p class="text-sm text-gray-700 text-center">{{ $t("msg.reader.ReviewDetailsOfThisTransaction") }}</p>
      </q-card-section>

      <q-card-section class="q-px-lg q-pb-lg q-mb-md">
        <p class="text-sm text-teal-900 bg-teal-50 text-center q-py-nm q-mb-xs" style="border-radius: 6px">
          {{ $t("msg.reader.AutoProcessingIn") }} <b>{{ timeout }}{{ $t("common.second_s") }}</b>
        </p>
        <p class="text-xss text-gray-700 text-center" @click="test">{{ $t("msg.reader.OrClickBelow") }}</p>
      </q-card-section>

      <q-separator />

      <q-card-actions align="between" class="q-py-md q-px-lg">
        <q-btn flat no-caps class="custom-btn-action" color="gray-600" label="Cancel" v-close-popup />
        <q-btn unelevated no-caps class="custom-btn-action" color="orange-400" v-close-popup>{{ $t("msg.reader.ProcessPayment") }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
:deep(.custom-btn-action) {
  padding: 8px 16px;
  border-radius: 6px;
}
</style>

<script setup>
import { onBeforeUnmount } from "vue";
import { ref } from "vue";
const props = defineProps({
  isReaderOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:isReaderOpen"]);

const timeout = ref(5);
const timeoutRef = ref(0);

function onShow() {
  emit("update:isReaderOpen", true);
  timeout.value = 5;
  timeoutRef.value = setInterval(() => {
    if (timeout.value > 0) {
      timeout.value--;
    } else {
      clearInterval(timeoutRef.value);
      emit("update:isReaderOpen", false);
    }
  }, 1000);
}

function onHide() {
  emit("update:isReaderOpen", false);
  timeout.value = 5;
  clearInterval(timeoutRef.value);
}

onBeforeUnmount(() => {
  clearInterval(timeoutRef.value);
});
</script>
