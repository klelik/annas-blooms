import { defineStore } from 'pinia'

interface UiStore {
  overlayActive: boolean
}

export const useUiStore = defineStore('ui', {
  state: (): UiStore => ({
    overlayActive: false,
  }),

  actions: {
    showOverlay() {
      this.overlayActive = true
    },

    hideOverlay() {
      this.overlayActive = false
    },

    toggleOverlay() {
      this.overlayActive = !this.overlayActive
    },
  },
})
