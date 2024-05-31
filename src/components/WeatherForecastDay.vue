<script setup>
import { defineProps } from 'vue';

// Definimos las props que el componente espera recibir
const props = defineProps({
  day: Object
});
</script>

<template>
  <div class="mb-2 flex items-center justify-between">
    <table class="w-full">
      <tr>
        <!-- Día de la semana -->
        <td class="w-1/3">
          {{ new Date(props.day.date).toLocaleDateString('en-us', { weekday: 'long' }) }}
        </td>

        <!-- Icono -->
        <td class="w-1/3">
          <img :src="props.day.day.condition.icon" alt="icon" width="30" class="mx-auto" />
        </td>

        <!-- Temperatura alta/baja -->
        <td class="w-1/3 text-right">
          {{ Math.round(props.day.day.maxtemp_c) }}°C / {{ Math.round(props.day.day.mintemp_c) }}°C
        </td>
      </tr>
    </table>
  </div>
</template>
