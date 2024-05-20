<script setup>
import Renderer from './Renderer.vue'
const props = defineProps({
  elementsArray: Array
});
</script>

<template>
<template v-for="eachEl in props.elementsArray">
  <a v-if="eachEl.elementType === 'a'"
    :class="eachEl.class"   
    :href="eachEl.href"   
  >
    {{ eachEl.innerHtml }}
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </a>
  <div v-if="eachEl.elementType === 'div'"
    :class="eachEl.class"   
  >
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </div>
  <header v-if="eachEl.elementType === 'header'"
  >
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </header>
  <h1 v-if="eachEl.elementType === 'h1'"
  >
    {{ eachEl.innerHtml }}
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </h1>
  <h2 v-if="eachEl.elementType === 'h2'"
  >
    {{ eachEl.innerHtml }}
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </h2>
  <img v-if="eachEl.elementType === 'img'"
    :alt="eachEl.alt"   
    :class="eachEl.class"   
    :src="eachEl.src"   
  />
  <li v-if="eachEl.elementType === 'li'"
  >
    {{ eachEl.innerHtml }}
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </li>
  <nav v-if="eachEl.elementType === 'nav'">
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </nav>
  <section v-if="eachEl.elementType === 'section'"
    :class="eachEl.class"
    :id="eachEl.id"
  >
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </section>
  <ul v-if="eachEl.elementType === 'ul'"
  >
    {{ eachEl.innerHtml }}
    <Renderer v-if="eachEl.children" :elements-array="eachEl.children" />
  </ul>
</template>
</template>
