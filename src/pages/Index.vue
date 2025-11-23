<!-- <template>
  <q-page class="flex flex-center">
   
      <q-btn label="Snake" @click="openGame('snake')" />
      <q-btn label="Ninja Jezzball" @click="openGame('jezzball')" />
      <q-btn label="Zombie" @click="openGame('zombie')" />
   
    <q-dialog
      v-model="gameModel"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      style="background: white"
    >
      <div
        v-if="gameModel"
        style="width: 100%; height: 100%; position: relative"
      >
        <template v-if="gameToken" style="overflow: hidden">
          <iframe
            style="
              height: 100%;
              width: 100%;
              overflow: hidden;
            "
            :src="
              this.game_path+'?server=' +
              this.server +
              '&id=46&userId=' +
              this.token.userId +
              '&token=' +
              this.gameToken +
              '&lang=en'
            "
          ></iframe>
        </template>
        <div style="position: absolute; top: 5px; right: 5px;  background-color: gray;">
          <q-btn dense outline icon="close" @click="gameModel = false" />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageIndex",
  setup() {
    const $q = useQuasar();

    return {
      triggerPositive() {
        $q.notify({
          type: "positive",
          message: "Login successfully",
          timeout: 500,
        });
      },
      triggerNegative() {
        $q.notify({
          type: "negative",
          message: "Incorrect username or password",
          timeout: 500,
        });
      },
    };
  },
  data() {
    return {
      gameModel: false,
      token: "",
      gameToken: "",
      selectedSchool: 1,
      username: null,
      password: null,
      game_path:""
    };
  },
  computed: {
    server() {
      // return process.env.BASE_URL.replaceAll('\\"', '').replaceAll('"', '')
      return "https://demo-backend.learning-canvas.com";
    },
    ...mapState({
      token: (state) => state.security.token,
    }),
  },
  methods: {
    logout() {
      this.token = "";
      this.$store.commit("security/setToken", {});
    },
    onSubmit() {
      this.$q.loading.show();
      this.$api
        .post(
          "/api/authenticate",
          this.$qs.stringify({
            username: this.username,
            password: this.password,
            schoolId: this.selectedSchool,
          })
        )
        .then((response) => {
          if (process.env.DEV) {
            //console.log(response);
          }
          if (response.data.success) {
            this.token = response.data.token;
            this.$store.commit("security/setToken", response.data.token);
            this.triggerPositive();
            // this.$q.notify({ message: 'Login successfully', timeout: 1000, color: 'positive' })
          } else {
            this.triggerNegative();
            /*
              this.$q.notify({
                color: 'negative',
                message: 'Incorrect username and password',
                timeout: 500,
              })
              */
          }
        })
        .catch((error) => {
          if (process.env.DEV) {
            console.log(error);
          }
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
    onReset() {
      this.username = null;
      this.password = null;
    },
    openGame(game_n) {
      if (game_n=='snake')
          this.game_path = '/game/godot-snake-html/index.html';
      else if(game_n=='jezzball')
          this.game_path = '/game/godot-jezzball-html/index.html';
      else if(game_n=='zombie')
          this.game_path = '/game/godot-zombie-html/index.html';
      else if(game_n=='slash')
          this.game_path = '/game/godot-slash-html/index.html';
      this.setGameToken();

    },
    setGameToken() {
      this.$q.loading.show();
      this.$api
        .post(
          "/api/getGameToken",
          this.$qs.stringify({ userId: this.token.userId }),
          { headers: { "x-access-token": this.token.id } }
        )
        .then((response) => {
          if (process.env.DEV) {
            //console.log(response);
          }
          if (response.data.success) {
            this.gameToken = response.data.token;

            this.gameModel = true;
          } else {
            if (process.env.DEV) {
              console.log(response.data.message);
            }
          }
        })
        .catch((error) => {
          if (process.env.DEV) {
            console.log(error);
          }
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },
  },
  mounted() {
    //console.log("mounted");
  },
});
</script> -->


<template>
  <q-page class="flex flex-center q-pa-lg column">

    <!-- Game Buttons -->
    <q-btn label="Snake" color="primary" class="q-mb-sm" @click="openGame('snake')" />
    <q-btn label="Ninja Jezzball" color="primary" class="q-mb-sm" @click="openGame('jezzball')" />
    <q-btn label="Zombie" color="primary" class="q-mb-sm" @click="openGame('zombie')" />

    <!-- Game Dialog -->
    <q-dialog
      v-model="gameModel"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <div class="fit bg-white relative-position">

        <!-- Game Frame -->
        <iframe
          v-if="gameToken"
          class="fit"
          frameborder="0"
          :src="`${game_path}?server=${server}&id=46&userId=${token.userId}&token=${gameToken}&lang=en`"
        ></iframe>

        <!-- Close Button -->
        <div class="absolute-top-right q-pa-sm">
          <q-btn dense outline icon="close" color="grey-9" @click="gameModel = false" />
        </div>

      </div>
    </q-dialog>

  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageIndex",
  setup() {
    const $q = useQuasar();
    return {};
  },
  data() {
    return {
      gameModel: false,
      gameToken: "",
      game_path: ""
    };
  },
  computed: {
    server() {
      return "https://demo-backend.learning-canvas.com";
    },
    ...mapState({
      token: (state) => state.security.token,
    }),
  },
  methods: {
    openGame(name) {
      switch (name) {
        case "snake":
          this.game_path = "/game/godot-snake-html/index.html";
          break;
        case "jezzball":
          this.game_path = "/game/godot-jezzball-html/index.html";
          break;
        case "zombie":
          this.game_path = "/game/godot-zombie-html/index.html";
          break;
        case "slash":
          this.game_path = "/game/godot-slash-html/index.html";
          break;
      }

      this.loadGameToken();
    },
    loadGameToken() {
      // Simulate loading
      this.$q.loading.show();

      // Set a dummy token
      this.gameToken = "DUMMY-GAME-TOKEN-12345";

      // Open the game dialog
      this.gameModel = true;

      // Hide loading
      this.$q.loading.hide();
    },

    // loadGameToken() {
    //   this.$q.loading.show();
    //   this.$api
    //     .post(
    //       "/api/getGameToken",
    //       this.$qs.stringify({ userId: this.token.userId }),
    //       { headers: { "x-access-token": this.token.id } }
    //     )
    //     .then((response) => {
    //       if (response.data.success) {
    //         this.gameToken = response.data.token;
    //         this.gameModel = true;
    //       }
    //     })
    //     .finally(() => {
    //       this.$q.loading.hide();
    //     });
    // },
  },
});
</script>

<style>
.fit {
  width: 100%;
  height: 100%;
}
</style>
