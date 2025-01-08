<template>
  <v-card class="mx-auto mt-4" max-width="600">
    <v-card-title class="text-h5">
      Welcome to Hotel Management System
    </v-card-title>
    <v-card-text>
      <p class="mb-4">Please use the navigation menu to manage:</p>
      <v-list>
        <v-list-item to="/guests" prepend-icon="mdi-account-group" title="Guests" />
        <v-list-item to="/rooms" prepend-icon="mdi-door" title="Rooms" />
        <v-list-item to="/reservations" prepend-icon="mdi-calendar-check" title="Reservations" />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script> 