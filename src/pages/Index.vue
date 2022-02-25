<template>
  <q-page class="flex flex-center">
    <template v-if="token">
      <q-btn label="Snake" @click="openGame" />
      <q-btn label="Ninja Jezzball" @click="openGame" />
      <q-btn label="Logout" @click="logout" />
    </template>
    <template v-else>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          v-model="username"
          label="Username"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please enter username']"
          autocorrect="off"
          autocapitalize="none"
        />

        <q-input
          filled
          v-model="password"
          label="Password"
          lazy-rules
          type="password"
          autocomplete="off"
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter passsword',
          ]"
        />
        <div>
          <q-btn no-caps label="Submit" type="submit" color="primary" />
          <q-btn
            no-caps
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </template>
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
          <!-- <iframe
            style="background: white;"
            width="100%" height="100%" frameBorder="0"
            :src="'/game/index.html?server=' + this.server + '&id=46&userId=' + this.token.userId + '&token=' + this.gameToken"
          />-->
          <iframe
            style="
              height: 100%;
              width: 100%;

              
              overflow: hidden;
            "
            :src="
              '/game/godot-snake-html/index.html?server=' +
              this.server +
              '&id=46&userId=' +
              this.token.userId +
              '&token=' +
              this.gameToken +
              '&lang=zh'
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
    openGame() {
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
</script>
