import "./assets/main.css"

import { createApp } from "vue"
import { createVuestic } from "vuestic-ui"
import { createPinia } from "pinia"
import { VueFire, VueFireAuth } from "vuefire"
import App from "./App.vue"
import router from "./router"
import vuesticConfig from "../vuestic.config"
import { firebaseApp } from "./firebase"

const pinia = createPinia()
const vuestic = createVuestic({ config: vuesticConfig })
const vfireConfig = { firebaseApp, modules: [VueFireAuth()] }
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuestic)
app.use(VueFire, vfireConfig)
app.mount("#app")
