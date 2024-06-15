<template>
   <div class="main-container">
    <div class="content-container">
      <div class="map-container" ref="mapContainer"></div>

      <div v-if="weather" class="weather-info">
        <div class="weather-header">
          <h3>Clima en {{ weather.location.name }}</h3>
          <img :src="weather.current.condition.icon" alt="Weather Icon" class="weather-icon">
        </div>
        <p><strong>Temperatura:</strong> {{ weather.current.temp_c }}°C</p>
        <p><strong>Clima:</strong> {{ weather.current.condition.text }}</p>
      </div>

      <!-- search field -->
      <form class="search-form">
        <div class="search-wrapper">
          <i class="fa-solid fa-magnifying-glass p-2 text-indigo-600"></i>
          <input
            type="text"
            placeholder="Buscar un lugar"
            class="search-input"
            v-model="searchTerm.query"
            @input="handleSearch"
          />
        </div>
      </form>

      <!-- search suggestions -->
      <div class="search-results">
        <div class="bg-white rounded-lg shadow-lg" v-if="searchTerm.results !== null">
          <div v-for="place in searchTerm.results" :key="place.id">
            <button @click="getWeather(place)" class="result-item">
              {{ place.name }}, {{ place.region }}, {{ place.country }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZW5hcmFuam9iIiwiYSI6ImNseGM1djJkODA4Y3cya3B0NGMwZXphNzAifQ.tvAnJzoveRGOl7xXzslhGA';

const mapContainer = ref<HTMLDivElement | null>(null);
const weather = ref<any>(null);
const apiKey = '8c411658664941e48bb10118243105';

const searchTerm = reactive({
  query: "",
  timeout: null,
  results: null
});

const handleSearch = debounce(async () => {
  if (searchTerm.query !== "") {
    const res = await fetch(
      `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchTerm.query}`
    );

    const data = await res.json();
    searchTerm.results = data;
    console.log(searchTerm.results);
  } else {
    searchTerm.results = null;
  }
}, 500);

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const getWeather = async (place) => {
  const res = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${place.name}&days=3&aqi=no&alerts=no`
  );

  const data = await res.json();
  weather.value = data;
  console.log(weather.value);

  searchTerm.query = '';
  searchTerm.results = null;

  // Move the map to the selected location
  const map = mapInstance.value;
  if (map) {
    map.flyTo({ center: [data.location.lon, data.location.lat], zoom: 10 });
  }
}

const mapInstance = ref<mapboxgl.Map | null>(null);

onMounted(() => {
  const map = new mapboxgl.Map({
    container: mapContainer.value!,
    style: 'mapbox://styles/mapbox/streets-v9',
    projection: 'globe' as mapboxgl.ProjectionOptions,
    zoom: 1,
    center: [30, 15]
  });

  mapInstance.value = map;

  map.addControl(new mapboxgl.NavigationControl());
  map.scrollZoom.disable();

  map.on('style.load', () => {
    map.setFog({});
  });

  const secondsPerRevolution = 240;
  const maxSpinZoom = 5;
  const slowSpinZoom = 3;

  let userInteracting = false;
  const spinEnabled = true;

  function spinGlobe() {
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.getCenter();
      center.lng -= distancePerSecond;
      map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }

  map.on('mousedown', () => {
    userInteracting = true;
  });
  map.on('dragstart', () => {
    userInteracting = true;
  });

  map.on('moveend', () => {
    spinGlobe();
  });

  spinGlobe();
});
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: radial-gradient(circle, rgba(22,29,36,1) 0%, rgba(33,43,54,1) 100%)
}

.header {
  background-color: rgb(255, 255, 255);
  padding: 10px 0;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.menu {
  display: flex;
  gap: 20px;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.map-container {
  width: 80%;
  height: 60vh;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
} 

.weather-info {
  position: absolute;
  top: 128px;
  right: 185px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 1.2em;
  line-height: 1.5;
  width: 300px;
  transition: transform 0.3s ease-in-out;
}

.weather-info h3 {
  margin-bottom: 10px;
  font-size: 1.4em;
}

.weather-info p {
  margin: 5px 0;
}

.search-form {
  width: 100%;
  max-width: 400px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
}

.search-results {
  width: 100%;
  max-width: 400px;
}
.result-item {
  width: 100%;
  text-align: left;
  padding: 10px;
  border: none;
  background-color: white;
  cursor: pointer;
}
.result-item:hover {
  background-color: #f0f0f0;
}


.menu {
  display: flex;
  gap: 20px;
  background-color: #3366ff; /* Cambia el color de fondo del menú */
  padding: 10px; /* Añade un poco de espacio alrededor del menú */
  border-radius: 8px; /* Redondea las esquinas */
}

.menu-link {
  /* Estilos opcionales para los enlaces dentro del menú */
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
}

.menu-link:hover {
  background-color: #254b80; /* Color de fondo al pasar el ratón */
}


</style>
