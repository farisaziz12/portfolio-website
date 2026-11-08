<script setup lang="ts">
import ArchitectureFlow from './ArchitectureFlow.vue'
withDefaults(defineProps<{ step?: number }>(), { step: 11 })
</script>
<template><ArchitectureFlow variant="client" :step="step" /></template>
