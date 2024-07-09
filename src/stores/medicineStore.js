import { defineStore } from 'pinia';

export const useMedicineStore = defineStore('medicineStore', {
  state: () => ({
    medicines: ['Medicine A', 'Medicine B', 'Medicine C'], // Initial list of medicines
    favorites: [],
    order: [], // New state to keep track of custom order
  }),
  actions: {
    addMedicine(medicine) {
      if (!this.medicines.includes(medicine)) {
        this.medicines.push(medicine);
        this.order.push(medicine);
      }
    },
    deleteMedicine(medicine) {
      this.medicines = this.medicines.filter(m => m !== medicine);
      this.order = this.order.filter(m => m !== medicine);
      this.favorites = this.favorites.filter(m => m !== medicine);
    },
    toggleFavorite(medicine) {
      if (this.favorites.includes(medicine)) {
        this.favorites = this.favorites.filter(m => m !== medicine);
      } else {
        this.favorites.push(medicine);
      }
    },
    reorderMedicines(draggedMedicine, targetMedicine) {
      const draggedIndex = this.medicines.indexOf(draggedMedicine);
      const targetIndex = this.medicines.indexOf(targetMedicine);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        this.medicines.splice(draggedIndex, 1);
        this.medicines.splice(targetIndex, 0, draggedMedicine);
        
        // Update order
        this.order = [...this.medicines];
      }
    },
  },
  getters: {
    filteredMedicines: (state) => (query) => {
      return state.medicines.filter(medicine =>
        medicine.toLowerCase().includes(query.toLowerCase())
      );
    },
    isFavorite: (state) => (medicine) => {
      return state.favorites.includes(medicine);
    },
    orderedMedicines: (state) => {
      // Use the custom order if available, otherwise use the original order
      const orderedList = state.order.length ? state.order : state.medicines;
      
      return orderedList.slice().sort((a, b) => {
        const aFav = state.favorites.includes(a);
        const bFav = state.favorites.includes(b);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return orderedList.indexOf(a) - orderedList.indexOf(b);
      });
    },
  },
});
