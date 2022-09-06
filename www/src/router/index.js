import { createRouter, createWebHistory } from "vue-router";
import StatusView from "../views/StatusView.vue";
import ConfigView from "../views/ConfigView.vue";
import ConfigGimp from "../components/ConfigGimp.vue";
import ConfigTwitch from "../components/ConfigTwitch.vue";
import ConfigHelp from "../components/ConfigHelp.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      component: StatusView
    },
    {
      path: "/config",
      component: ConfigView,
      children: [
        {
          path: 'gimp',
          component: ConfigGimp,
        },
        {
          path: 'twitch',
          component: ConfigTwitch,
        },
      ]
    }
  ],
});

export default router;

