<script setup>
import Renderer from './components/Renderer.vue'
import Header from './components/Header.vue'

const footerElementsArray = [];
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Renderer :elements-array="footerElementsArray"/>
</template>
