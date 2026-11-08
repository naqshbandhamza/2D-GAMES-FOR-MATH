<template>
  <q-page class="pixel-page flex flex-center column q-pa-lg">
    <!-- Title -->
    <h1 class="title">Select your game</h1>
    <p class="subtitle">Pick a cartridge to play<span class="cursor">_</span></p>

    <!-- Game cartridges -->
    <div class="grid" role="listbox" aria-label="Games">
      <button
        v-for="(g, i) in games"
        :key="g.id"
        class="cart"
        :class="{ active: selected === i }"
        role="option"
        :aria-selected="selected === i"
        @mouseenter="selected = i"
        @focus="selected = i"
        @click="openGame(g.id)"
      >
        <span class="pointer" aria-hidden="true">▶</span>
        <svg class="sprite" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">
          <template v-for="(row, y) in g.sprite">
            <template v-for="(c, x) in row.split('')">
              <rect
                v-if="c !== '.'"
                :key="`${y}-${x}`"
                :x="x"
                :y="y"
                width="1"
                height="1"
                :fill="palette[c]"
              />
            </template>
          </template>
        </svg>
        <span class="name">{{ g.label }}</span>
        <span class="hint">{{ g.hint }}</span>
      </button>
    </div>

    <p class="press-start">Press enter to start</p>

    <!-- Game Dialog -->
    <q-dialog
      v-model="gameModel"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <div class="fit game-shell relative-position">
        <iframe
          v-if="gameToken"
          class="fit"
          frameborder="0"
          :src="`${game_path}?server=${server}&id=46&userId=${token.userId}&token=${gameToken}&lang=en`"
        ></iframe>

        <button class="close-btn" aria-label="Close game" @click="gameModel = false">X</button>
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
      game_path: "",
      selected: 0,
      palette: {
        0: "#0b2113",
        1: "#1e4d2b",
        2: "#4c9a3c",
        3: "#a8d94a",
        4: "#e9f7b8",
        r: "#d9534f",
      },
      games: [
        {
          id: "snake",
          label: "Snake",
          hint: "Eat. Grow. Don't bite yourself.",
          sprite: [
            "..222222",
            ".2......",
            ".2......",
            "..22222.",
            "......2.",
            "......2.",
            ".222222.",
            "r3......",
          ],
        },
        {
          id: "jezzball",
          label: "Ninja Jezzball",
          hint: "Wall off the bouncing balls.",
          sprite: [
            "33333333",
            "3......3",
            "3.44...3",
            "3.44.2.3",
            "3....2.3",
            "3....2.3",
            "3......3",
            "33333333",
          ],
        },
        {
          id: "zombie",
          label: "Zombie",
          hint: "Survive the horde.",
          sprite: [
            "..2222..",
            ".222222.",
            "22r22r22",
            "22r22r22",
            "22222222",
            "2.0000.2",
            ".222222.",
            "..2..2..",
          ],
        },
      ],
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
  mounted() {
    window.addEventListener("keydown", this.onKey);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKey);
  },
  methods: {
    onKey(e) {
      if (this.gameModel) return;
      const n = this.games.length;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        this.selected = (this.selected + 1) % n;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        this.selected = (this.selected - 1 + n) % n;
      } else if (e.key === "Enter") {
        this.openGame(this.games[this.selected].id);
      }
    },
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
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.fit {
  width: 100%;
  height: 100%;
}

/* ---------- Page ---------- */
.pixel-page {
  --c-bg: #16331f;
  --c-bg-alt: #1a3b25;
  --c-card: #2d5a34;
  --c-card-hi: #3f7a3f;
  --c-dark: #0b2113;
  --c-light: #a8d94a;
  --c-pale: #e9f7b8;
  font-family: "Press Start 2P", ui-monospace, "Courier New", monospace;
  color: var(--c-pale);
  background-color: var(--c-bg);
  background-image:
    linear-gradient(45deg, var(--c-bg-alt) 25%, transparent 25%, transparent 75%, var(--c-bg-alt) 75%),
    linear-gradient(45deg, var(--c-bg-alt) 25%, transparent 25%, transparent 75%, var(--c-bg-alt) 75%);
  background-size: 32px 32px;
  background-position: 0 0, 16px 16px;
  image-rendering: pixelated;
  text-align: center;
}

.title {
  margin: 0 0 16px;
  font-size: clamp(18px, 4.5vw, 36px);
  line-height: 1.4;
  font-weight: 400;
  color: var(--c-light);
  text-shadow: 4px 4px 0 var(--c-dark);
}

.subtitle {
  margin: 0 0 40px;
  font-size: 11px;
  line-height: 1.8;
  color: var(--c-pale);
}

.cursor {
  animation: blink 1s steps(1) infinite;
}

/* ---------- Cartridges ---------- */
.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 28px;
  max-width: 900px;
}

.cart {
  position: relative;
  width: 230px;
  padding: 28px 16px 20px;
  font: inherit;
  color: var(--c-pale);
  background: var(--c-card);
  border: 0;
  cursor: pointer;
  /* stepped pixel border + hard drop shadow */
  box-shadow:
    -4px 0 0 0 var(--c-dark),
    4px 0 0 0 var(--c-dark),
    0 -4px 0 0 var(--c-dark),
    0 4px 0 0 var(--c-dark),
    inset -4px -4px 0 0 #234a2a,
    inset 4px 4px 0 0 var(--c-card-hi),
    8px 12px 0 0 var(--c-dark);
  transition: transform 0.08s steps(2);
}

.cart:focus-visible {
  outline: 4px dashed var(--c-pale);
  outline-offset: 8px;
}

.cart.active {
  background: var(--c-card-hi);
  transform: translateY(-6px);
  box-shadow:
    -4px 0 0 0 var(--c-light),
    4px 0 0 0 var(--c-light),
    0 -4px 0 0 var(--c-light),
    0 4px 0 0 var(--c-light),
    inset -4px -4px 0 0 #2d5a34,
    inset 4px 4px 0 0 #5a9a4a,
    8px 18px 0 0 var(--c-dark);
}

.cart:active {
  transform: translateY(2px);
}

.pointer {
  position: absolute;
  top: 12px;
  left: 14px;
  font-size: 14px;
  color: var(--c-light);
  visibility: hidden;
}

.cart.active .pointer {
  visibility: visible;
  animation: blink 0.8s steps(1) infinite;
}

.sprite {
  display: block;
  width: 96px;
  height: 96px;
  margin: 0 auto 22px;
  padding: 8px;
  background: var(--c-dark);
  image-rendering: pixelated;
  box-sizing: content-box;
}

.cart.active .sprite {
  animation: hop 0.6s steps(2) infinite;
}

.name {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--c-light);
}

.hint {
  display: block;
  font-size: 9px;
  line-height: 1.8;
  color: var(--c-pale);
  opacity: 0.85;
}

/* ---------- Press start ---------- */
.press-start {
  margin: 56px 0 0;
  font-size: 12px;
  color: var(--c-light);
  text-shadow: 2px 2px 0 var(--c-dark);
  animation: blink 1.2s steps(1) infinite;
}

/* ---------- Game dialog ---------- */
.game-shell {
  background: var(--c-dark, #0b2113);
  border: 8px solid #3f7a3f;
  box-sizing: border-box;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  font-family: "Press Start 2P", monospace;
  font-size: 14px;
  color: #e9f7b8;
  background: #2d5a34;
  border: 0;
  cursor: pointer;
  box-shadow:
    -3px 0 0 0 #0b2113,
    3px 0 0 0 #0b2113,
    0 -3px 0 0 #0b2113,
    0 3px 0 0 #0b2113,
    inset 3px 3px 0 0 #3f7a3f;
}

.close-btn:hover {
  background: #a8d94a;
  color: #0b2113;
}

.close-btn:focus-visible {
  outline: 3px dashed #e9f7b8;
  outline-offset: 6px;
}

/* ---------- Motion ---------- */
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes hop {
  0% { transform: translateY(0); }
  100% { transform: translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .cursor,
  .press-start,
  .cart.active .pointer,
  .cart.active .sprite {
    animation: none;
  }
}

@media (max-width: 600px) {
  .cart { width: 100%; max-width: 260px; }
}
</style>