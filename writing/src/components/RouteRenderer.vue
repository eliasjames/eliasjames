<script setup>
import Renderer from './Renderer.vue';

console.log(
  'home');
const elementsArray = [
  { 
    elementType: 'nav',
    children: [
      { 
        elementType: 'a',
        innerHtml: 'aboot',
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
  <section class="banner">
    <img src="/assets/banner-office.jpg"  alt="portrait of Elias in his office with computer and guitars"/>
  </section>
  <section id="about" class="well">
    <h2>#about</h2>
    <p>Polymath/multi-hyphenate. Everything I learn in one discipline I apply to the others. See the results in the <a href="#creative">creative</a> section.</p>
    <p>
      Full bio <a href="/full-bio">here</a>.
    </p>
  </section>
  <section id="creative" class="well">
    <h2>#creative</h2>
    <p>Writer, musician, team builder, software developer.</p>
    <h3>writer</h3>
    <RouterLink to="/writing" > to="/writing" </RouterLink>
    Read the latest on
      <a href="https://eliaspractices.substack.com/">Substack</a> or
      <a href="https://eliaspractices.medium.com/">Medium</a>
    <h3>musician</h3>
    <ul>
      <li>
        Videos on <a href="https://www.youtube.com/channel/UCo90TSZZQYNIDh4vneV6-iQ">Youtube</a>
      </li>
      <li>
        Studio albums on <a href="https://eliasjames.bandcamp.com/album/solo-electric">Bandcamp</a>
      </li>
      <li>
        Latest demos & live recordings on <a href="https://www.reverbnation.com/eliasjames">ReverbNation</a>
      </li>
    </ul>
    <h3>teambuilder</h3>
    Mentor, manager, teacher. More info on <a href="https://www.linkedin.com/in/eliascarlston/">LinkedIn</a><br/>
    Volunteer at <a href="https://www.portlandbikeparty.com/">Portland Bike Party</a>
    <h3>software developer</h3>
    Repos on <a href="https://github.com/eliasjames/">GitHub</a><br/>
    Resume on <a href="https://www.linkedin.com/in/eliascarlston/">LinkedIn</a><br/>
  </section>
  <section id="contact" class="well">
    <h2>#contact</h2>
    Get in touch!
    <ul>
      <li>
        <a href="mailto:elias@eliasjames.com">email</a>
      </li>
      <li>
        <a href="https://www.instagram.com/eliaspractices/">Instagram</a>
      </li>
      <li>
        <a href="https://www.facebook.com/eliaspractices">Facebook</a>
      </li>
    </ul>
  </section>
</template>
