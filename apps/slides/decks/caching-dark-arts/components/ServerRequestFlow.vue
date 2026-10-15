<script setup lang="ts">
import ArchitectureFlow from './ArchitectureFlow.vue'
defineProps<{ variant: 'bff' | 'query' | 'prefetch'; step?: number }>()
</script>
<template><ArchitectureFlow :variant="variant" :step="step" /></template>
