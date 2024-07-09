<template>
  <div class="medicine-component p-4 relative">
    <div class="flex items-center mb-2">
      <input 
        v-model="searchQuery" 
        @input="filterMedicines" 
        @focus="showDropdown" 
        @blur="hideDropdownWithDelay" 
        placeholder="Type to search or create" 
        class="border p-2 rounded mr-2 flex-grow" 
      />
      <button @click="addNewMedicine" class="bg-blue-500 text-white p-2 rounded flex-shrink-0">+</button>
    </div>
    <ul v-if="dropdownVisible && filteredMedicines.length > 0" class="border rounded absolute bg-white w-full z-10 max-h-60 overflow-y-auto">
      <li 
        v-for="medicine in filteredMedicines" 
        :key="medicine" 
        class="flex items-center justify-between p-2 border-b cursor-pointer hover:bg-gray-100"
        @mousedown.prevent="selectMedicine(medicine)"
        draggable="true"
        @dragstart="dragStart($event, medicine)"
        @dragover.prevent
        @drop="drop($event, medicine)"
      >
        <span class="truncate mr-2">{{ medicine }}</span>
        <!-- Icons removed from the search list -->
        <div class="flex items-center space-x-2 flex-shrink-0">
          <!-- No icons in the search list -->
        </div>
      </li>
    </ul>
    <p v-if="filteredMedicines.length === 0 && searchQuery.trim() !== '' && dropdownVisible" class="p-2 text-gray-500">No results found</p>
    <p v-if="filteredMedicines.length === 0 && searchQuery.trim() === '' && dropdownVisible" class="p-2 text-gray-500">Start typing to search or create a medicine</p>
    
    <!-- Display selected medicines list -->
    <div v-if="selectedMedicines.length > 0 || filteredMedicines.length === 0" class="selected-medicines">
      <p class="font-bold mb-1">Selected Medicines:</p>
      <ul class="selected-list">
        <li 
          v-for="(medicine, index) in selectedMedicines" 
          :key="medicine" 
          class="selected-item" 
          draggable="true"
          @dragstart="dragStart($event, medicine, index)"
          @dragover.prevent
          @drop="drop($event, index)"
        >
          <span class="truncate mr-2">{{ medicine }}</span>
          <!-- Icon for favorite -->
          <button @click="toggleFavorite(medicine)" class="text-lg">
            <i :class="isFavorite(medicine) ? 'filled-star' : 'outlined-star'">⭐</i>
          </button>
          <!-- Icon for delete -->
          <button @click="removeSelectedMedicine(medicine)" class="text-red-500 text-lg ml-2">
            🗑️
          </button>
          <!-- Drag handle icon -->
          <span class="drag-handle cursor-move text-lg">☰</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMedicineStore } from '../stores/medicineStore';

const store = useMedicineStore();
const searchQuery = ref('');
const dropdownVisible = ref(false);
const selectedMedicines = ref([]); // Track selected medicines

const filteredMedicines = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return store.medicines.slice(); // Return all medicines if search query is empty
  } else {
    return store.medicines.filter(medicine =>
      medicine.toLowerCase().includes(query)
    );
  }
});

const addNewMedicine = () => {
  const trimmedQuery = searchQuery.value.trim();
  if (trimmedQuery !== '' && !store.medicines.includes(trimmedQuery)) {
    store.addMedicine(trimmedQuery);
    searchQuery.value = '';
    dropdownVisible.value = false;
  }
};

const deleteMedicine = (medicine) => {
  store.deleteMedicine(medicine);
};

const toggleFavorite = (medicine) => {
  store.toggleFavorite(medicine);
};

const isFavorite = (medicine) => {
  return store.isFavorite(medicine);
};

const showDropdown = () => {
  dropdownVisible.value = true;
};

const hideDropdownWithDelay = () => {
  setTimeout(() => {
    dropdownVisible.value = false;
  }, 200);
};

const selectMedicine = (medicine) => {
  if (!store.medicines.includes(medicine)) {
    store.addMedicine(medicine);
  }
  searchQuery.value = medicine;
  dropdownVisible.value = false;
  if (!selectedMedicines.value.includes(medicine)) {
    selectedMedicines.value.push(medicine); // Add selected medicine to the list
  }
};

const removeSelectedMedicine = (medicine) => {
  const index = selectedMedicines.value.indexOf(medicine);
  if (index !== -1) {
    selectedMedicines.value.splice(index, 1); // Remove selected medicine from the list
  }
};

let draggedMedicine = null;
let dragIndex = null;

const dragStart = (event, medicine, index) => {
  draggedMedicine = medicine;
  dragIndex = index;
};

const drop = (event, targetIndex) => {
  event.preventDefault();
  if (draggedMedicine !== null && dragIndex !== null && targetIndex !== null) {
    const removed = selectedMedicines.value.splice(dragIndex, 1)[0];
    selectedMedicines.value.splice(targetIndex, 0, removed);
    store.reorderMedicines(draggedMedicine, selectedMedicines.value[targetIndex]);
  }
};
</script>

<style scoped>
.medicine-component {
  position: relative;
  width: 100%;
  max-width: 400px; /* Adjust this value as needed */
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.flex.items-center.space-x-2 {
  gap: 0.5rem;
}
.selected-medicines {
  margin-top: 10px;
}
.selected-list {
  padding: 0;
}
.selected-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.selected-item button {
  border: none;
  background: none;
  cursor: pointer;
}
.drag-handle {
  cursor: move;
  user-select: none;
}
</style>
