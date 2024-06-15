<template>
  <div>
    <HeaderA />

    <main>
      <router-view></router-view>
    </main>

    <FooterA />
  </div>
</template>

<script setup>
import HeaderA from './components/HeaderA.vue';
import FooterA from './components/FooterA.vue';
</script>

<style>
/* Estilos globales */
body {
  background: url(https://www.xtrafondos.com/wallpapers/montanas-con-nieve-en-el-bosque-3934.jpg);
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
  font-family: 'Montserrat Alternates', sans-serif;
}
</style>
