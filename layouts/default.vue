<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>Hotel Management</v-app-bar-title>
      <v-spacer />
      <v-btn to="/guests" variant="text">
        Guests
      </v-btn>
      <v-btn to="/rooms" variant="text">
        Rooms
      </v-btn>
      <v-btn to="/reservations" variant="text">
        Reservations
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script> 