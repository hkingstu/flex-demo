<template>
  <div class="media-player">
    <canvas
      v-if="type === 'video'"
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="togglePlay"
      class="video-canvas"
    ></canvas>
    <div v-if="type === 'video'" class="video-controls" @click.stop="togglePlay">
      <span v-if="!playing" class="play-btn">&#9654;</span>
      <span v-else class="pause-btn">&#10073;&#10073;</span>
    </div>
    <audio
      v-else-if="type === 'audio'"
      ref="mediaElement"
      :src="src"
      controls
      @click="togglePlay"
    ></audio>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    poster: String,
    type: {
      type: String,
      default: 'video',
      validator: value => ['video', 'audio'].includes(value)
    }
  },
  data() {
    return {
      playing: false,
      video: null,
      canvasWidth: 400,
      canvasHeight: 300,
      animationId: null
    }
  },
  mounted() {
    if (this.type === 'video') {
      this.initCanvasVideo();
    }
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.video) {
      this.video.pause();
      this.video.src = '';
      this.video = null;
    }
  },
  methods: {
    initCanvasVideo() {
      // 创建隐藏video元素
      this.video = document.createElement('video');
      this.video.src = this.src;
      this.video.crossOrigin = 'anonymous';
      this.video.playsInline = true;
      this.video.preload = 'auto';
      this.video.poster = this.poster;
      this.video.addEventListener('loadedmetadata', () => {
        // 固定16:9比例
        const baseWidth = this.video.videoWidth || 400;
        this.canvasWidth = baseWidth;
        this.canvasHeight = Math.round(baseWidth * 9 / 16);
        this.drawFrame();
      });
      this.video.addEventListener('pause', () => {
        this.playing = false;
      });
      this.video.addEventListener('play', () => {
        this.playing = true;
        this.drawFrame();
      });
      // 显示首帧
      this.video.addEventListener('loadeddata', () => {
        this.drawFrame();
      });
    },
    drawFrame() {
      if (!this.video) return;
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  
      // 视频已加载到可用帧
      if (this.video.readyState >= 2) {
        ctx.drawImage(this.video, 0, 0, this.canvasWidth, this.canvasHeight);
        if (!this.video.paused && !this.video.ended) {
          this.animationId = requestAnimationFrame(this.drawFrame);
        }
      } else if (this.poster) {
        // 视频未加载到关键帧时，绘制封面
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = this.poster;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
        };
      }
    },
    togglePlay() {
      if (!this.video) return;
      if (this.video.paused) {
        this.video.play();
        this.playing = true;
        this.drawFrame();
      } else {
        this.video.pause();
        this.playing = false;
      }
    }
  }
}
</script>

<style scoped>
.media-player {
  width: 100%;
  height: 100%;
  position: relative;
}
.video-canvas {
  width: 100%;
  height: 100%;
  background: #000;
  display: block;
  border-radius: 8px;
  aspect-ratio: 16 / 9;
}
.video-controls {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: auto;
  user-select: none;
}
.play-btn, .pause-btn {
  font-size: 48px;
  color: rgba(255,255,255,0.85);
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.play-btn:hover, .pause-btn:hover {
  background: rgba(0,0,0,0.5);
}
</style>