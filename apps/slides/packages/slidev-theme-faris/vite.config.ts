// Slidev merges this into every deck's Vite config. Allow ngrok tunnels to
// reach the dev server so a talk can be previewed on another device.
export default {
  server: {
    allowedHosts: ['.ngrok-free.app'],
  },
}
