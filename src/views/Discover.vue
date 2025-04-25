<template>
  <div class="discover-page">
    <CommunityDiscover />
  </div>
</template>

<script>
import CommunityDiscover from '@/components/CommunityDiscover.vue';

export default {
  components: {
    CommunityDiscover
  }
}
</script>

<style>
.discover-page {
  max-width: 1200px;
  margin: 0 auto;
  -padding: 20px;
}
</style>