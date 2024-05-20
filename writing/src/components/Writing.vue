<script setup>
import Renderer from './Renderer.vue';

const elementsArray = [
  { 
    elementType: 'h2',
    innerHtml: 'writing',
  },
  { 
    elementType: 'ul',
    children: [
      { 
        elementType: 'li',
        innerHtml: 'article',
      },
      { 
        elementType: 'li',
        innerHtml: 'essay',
      },
      { 
        elementType: 'li',
        innerHtml: 'contact',
      },
    ]
  }
];
console.log(elementsArray,
  'wiritng');
</script>

<template>
      <Renderer :elements-array="elementsArray"/>
</template>
