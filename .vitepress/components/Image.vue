<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
})
</script>

<template>
    <figure class="code-image-container">
        <a :href="src" target="_blank" rel="noopener noreferrer">
            <img :src="src" :alt="alt" class="code-image" />
        </a>
        <figcaption v-if="alt" class="code-image-caption">{{ alt }}</figcaption>
    </figure>
</template>

<style scoped>
.code-image-container {
  background-color: var(--vp-c-bg-soft);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.code-image {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.25rem;
  box-shadow: var(--vp-shadow-2);
}

.code-image-caption {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--vp-c-text-1);
  line-height: 1;
}
</style>