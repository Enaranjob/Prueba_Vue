<script setup>
import SearchInput from './components/SearchInput.vue';
import WeatherCard from './components/WeatherCard.vue';
import { ref } from 'vue';

const places = ref([]);

const addPlace = (data) => {
  if (data && data.location && data.current) {
    places.value.push(data);
  } else {
    console.error("Invalid place data:", data);
  }
};

const deletePlace = (name) => {
  places.value = places.value.filter(p => p.location.name !== name);
};
</script>

<template>
  <main>
    <!-- Date -->
    <div class="text-center mb-6">
      {{ new Date().toLocaleDateString('en-us', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) }}
    </div>

    <!-- Search -->
    <div>
      <SearchInput @place-data="addPlace" />
    </div>

    <!-- Weather Cards -->
    <div class="grid grid-cols-2 gap-4">
      <div v-for="(place, idx) in places" :key="idx">
        <WeatherCard :place="place" @delete-place="deletePlace" />
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Agrega aquí tus estilos si es necesario */
</style>
