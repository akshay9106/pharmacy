<template>
  <div id="app">
    <header>
      <h1>My Medicine App</h1>
    </header>
    <main>
      <MedicineComponent />
    </main>
  </div>
</template>

<script setup>
import MedicineComponent from './components/MedicineComponent.vue';
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
