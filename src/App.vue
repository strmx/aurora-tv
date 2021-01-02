<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="index"
      @click="onItemClick(item)"
      class="item"
      :style="{
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height,
        backgroundImage: `url(${item.data.poster})`
      }"
    >
      <!-- <img alt="poster" class="item__image" :src="item.video.poster" /> -->
    </li>
  </ul>
  <div class="video-container" v-if="selectedVideoUrl" @click="onVideoClick()">
    <video class="video" autoplay @ended="onVideoEnded()" playsinline>
      <source :src="selectedVideoUrl" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
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

function generateItems(data, windowWidth, windowHeight) {
  const wRatio = 1 / 1;
  const itemCount = data.length;
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
        const dataIndex = row * colCount + col;
        const dataItem = data[dataIndex];
        res.push({
          data: dataItem,
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
      // data: Array(10).fill({ poster: "https://source.unsplash.com/random" }),
      data: [],
      items: [],
      selectedVideoUrl: null
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    updateItems(event) {
      if (!this.data || !this.data.length) return;

      this.items = generateItems(
        this.data,
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
      );
    },
    onItemClick(item) {
      console.log(item.data.video);
      this.selectedVideoUrl = item.data.video;
    },
    onVideoClick() {
      this.selectedVideoUrl = null;
    },
    onVideoEnded() {
      this.selectedVideoUrl = null;
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.updateItems);
    });
    fetch(`${location.protocol}//${location.hostname}:8888/data.json`)
      .then(response => response.json())
      .then(data => {
        this.data = data.data;
        this.updateItems();
      })
      .catch(err => alert(err));
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

.video-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
}

.video {
  max-width: 100%;
  min-width: 90%;
  max-height: 100%;
}
</style>
