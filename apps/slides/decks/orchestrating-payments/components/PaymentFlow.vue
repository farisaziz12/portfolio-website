<script setup lang="ts">
defineProps<{ stage: 'initialize' | 'prioritize' }>()
</script>

<template>
  <div v-if="stage === 'initialize'" class="payment-flow" aria-label="Checkout initializes the orchestration layer, which consumes global state and rules for country, experiments and currencies">
    <div class="payment-flow__step"><span class="payment-flow__number">01</span><h2>User opens<br>checkout</h2></div>
    <span class="payment-flow__arrow" aria-hidden="true">→</span>
    <div class="payment-flow__step"><span class="payment-flow__number">02</span><h2>Init orchestration<br>layer</h2></div>
    <span class="payment-flow__arrow" aria-hidden="true">→</span>
    <div class="payment-flow__step"><span class="payment-flow__number">03</span><h2>Consume global<br>state &amp; rules</h2>
      <ul><li>User country</li><li>A/B tests</li><li>Currency list</li></ul>
    </div>
  </div>
  <div v-else class="payment-flow" aria-label="User country, A/B tests and currency list feed a decision tree that prioritizes payment service providers">
    <div class="payment-flow__step"><span class="payment-flow__number">INPUTS</span><ul><li>User country</li><li>A/B tests</li><li>Currency list</li></ul></div>
    <span class="payment-flow__arrow" aria-hidden="true">→</span>
    <div class="payment-flow__step"><span class="payment-flow__number">RULES</span><h2>Decision<br>tree</h2></div>
    <span class="payment-flow__arrow" aria-hidden="true">→</span>
    <div class="payment-flow__step"><span class="payment-flow__number">OUTPUT</span><h2>Prioritize<br>PSPs</h2></div>
  </div>
</template>
