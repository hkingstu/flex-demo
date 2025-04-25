<template>
  <div class="media-player">
    <video 
      v-if="type === 'video'"
      ref="mediaElement"
      :src="src"
      :poster="poster"
      controls
      playsinline
      @click="togglePlay"
    ></video>
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
  methods: {
    togglePlay() {
      const media = this.$refs.mediaElement;
      media.paused ? media.play() : media.pause();
    }
  }
}
</script>

<style scoped>
.media-player {
  width: 100%;
  height: 100%;
}

video, audio {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #000;
}
</style>