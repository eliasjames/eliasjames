<script setup>
import Renderer from './Renderer.vue';

const elementsArray = [
  { 
    elementType: 'nav',
    children: [
      { 
        elementType: 'a',
        innerHtml: 'about',
      },
      { 
        elementType: 'a',
        innerHtml: 'creative',
      },
      { 
        elementType: 'a',
        innerHtml: 'contact',
      },
    ]
  }
];
</script>

<template>
  <header>
    <div class="well">
      <a class="home-links" href="./index.html">
        <img class="logo picture"
          alt="Elias James picture"
          src="/assets/headshot.jpg">
        <img class="logo text"
          alt="Elias James logo"
          src="/assets/elias-judas-logo.gif">
      </a>
      <Renderer :elements-array="elementsArray"/>
    </div>
  </header>
</template>
