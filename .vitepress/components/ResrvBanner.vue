<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const isHome = frontmatter.value.layout === 'home'
</script>

<template>
  <div class="resrv-banner-wrapper" :class="{ 'is-home': isHome }">
    <div class="resrv-banner-container">
      <div class="resrv-banner">
        <a
          class="resrv-link"
          title="Reservation system for Laravel"
          href="https://resrv.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="resrv-logo"
            src="/resrv-logo.svg"
            alt="Resrv logo"
          >
          <span class="resrv-text">
            We also built Resrv,
            <span class="resrv-text-bold">a fully featured reservations add-on</span>
            for Statamic
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resrv-banner-wrapper {
  margin-top: 3rem;
}

/* Home page: match VPFeatures container */
.resrv-banner-wrapper.is-home {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .resrv-banner-wrapper.is-home {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .resrv-banner-wrapper.is-home {
    padding: 0 64px;
  }
}

.resrv-banner-wrapper.is-home .resrv-banner-container {
  margin: 0 auto;
  max-width: 1152px;
}

/* Doc pages: full width within doc container */
.resrv-banner-container {
  margin: 0 auto;
}

.resrv-banner {
  background: linear-gradient(to right, #ffdd9d, #F56B3C);
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
}

.resrv-link {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
}

.resrv-logo {
  width: 9rem;
}

.resrv-text {
  margin-top: 0.5rem;
  color: #000;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
}

.resrv-text-bold {
  font-weight: 700;
}

@media (min-width: 1024px) {
  .resrv-link {
    flex-direction: row;
  }

  .resrv-text {
    margin-top: 0;
    margin-left: 1rem;
    text-align: left;
  }
}

@media (min-width: 1280px) {
  .resrv-text {
    margin-left: 1.5rem;
  }
}

@media (max-width: 768px) {
  .resrv-container {
    padding: 0 1rem;
  }
}
</style>
