<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="index"
      class="item"
      :style="{
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height,
        backgroundImage: `url(${item.video.poster})`
      }"
    >
      <!-- <img alt="poster" class="item__image" :src="item.video.poster" /> -->
    </li>
  </ul>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
</template>

<script>
function generateLayouts(itemCount) {
  const layouts = [];
  for (let colCount = 0; colCount < 1000; colCount++) {
    for (let rowCount = 0; rowCount < 1000; rowCount++) {
      const cellCount = colCount * rowCount;
      if (cellCount < itemCount) continue;
      if (cellCount > itemCount + colCount - 1) break;
      if (cellCount > itemCount + rowCount - 1) break;
      layouts.push({ colCount, rowCount });
    }
  }
  return layouts;
}

function generateItems(items, windowWidth, windowHeight) {
  const wRatio = 1 / 1;
  const itemCount = items.length;
  const layouts = generateLayouts(itemCount);
  const ratios = layouts.map(
    ({ colCount, rowCount }) =>
      windowWidth / colCount / (windowHeight / rowCount)
  );
  const ratioDiffs = ratios.map(r => Math.abs(wRatio - r));
  const bestRatioDiff = Math.min(...ratioDiffs);
  const bestLayoutIndex = ratioDiffs.indexOf(bestRatioDiff);
  const { colCount, rowCount } = layouts[bestLayoutIndex];
  const itemWidth = windowWidth / colCount;
  const itemHeight = windowHeight / rowCount;
  const MIN_GAP = Math.round(Math.min(itemWidth, itemHeight) * 0.2);
  const res = [];

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (row * colCount + col < itemCount) {
        const size = Math.round(Math.min(itemWidth, itemHeight) - MIN_GAP);
        const x = col * itemWidth;
        const y = row * itemHeight;
        const itemIndex = row * colCount + col;
        const item = items[itemIndex];
        res.push({
          video: item,
          left: `${Math.round(x + (itemWidth - size) / 2)}px`,
          top: `${Math.round(y + (itemHeight - size) / 2)}px`,
          width: `${size}px`,
          height: `${size}px`
        });
      }
    }
  }

  return res;
}

// import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {},
  data() {
    return {
      videos: Array(100).fill({
        poster: "https://source.unsplash.com/random"
      }),
      items: []
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    updateItems(event) {
      this.items = generateItems(
        this.videos,
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
      );
      console.log(this.items);
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.updateItems);

      //Init
      this.updateItems();
    });

    setInterval(() => {
      this.counter++;
    }, 1000);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateItems);
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.item {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
}

.item__image {
  width: 100%;
}
</style>
