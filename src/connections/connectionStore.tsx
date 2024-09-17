import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connections', {
  state: () => ({
    mqttConnected: false,
    ports: [],
    dejaConnected: false,
    dccExConnected: false,
    serialConnected: false,
    cloudConnected: false,
    isEmulated: false,
    layoutId: localStorage.getItem('@DEJA/layoutId') || null
  }),
  actions: {
    connect(connType: string, layoutId?: string) {
      this.disconnect()
      switch (connType) {
        case 'cloud':
          this.cloudConnected = true
          break
        case 'deja':
          this.dejaConnected = true
          break
        case 'serial':
          this.serialConnected = true
          break
        case 'emulator':
          this.isEmulated = true
          break
        default:
          console.error('Unknown connection type:', connType)
          break
      }
      if (layoutId) {
        this.layoutId = layoutId
        localStorage.setItem('@DEJA/layoutId', layoutId)
      }
    },
    connectDccEx() {
      this.dccExConnected = true
    },
    disconnect() {
      this.ports = []
      this.mqttConnected = false
      this.layoutId = null
      this.dejaConnected = false
      this.cloudConnected = false
      this.dccExConnected = false
      this.serialConnected = false
      this.isEmulated = false
      localStorage.removeItem('@DEJA/layoutId')
    }
  }
})

export default useConnectionStore
