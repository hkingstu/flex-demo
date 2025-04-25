<template>
  <div
    class="discover-container"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- 下拉刷新区域 -->
    <div
      class="refresh-tip"
      :style="{ transform: `translateY(${pullDistance}px)`, opacity: isDragging || isRefreshing ? 1 : 0 }"
      v-show="isDragging || isRefreshing"
    >
      <van-loading size="24px" v-if="isRefreshing">刷新中...</van-loading>
      <div v-else class="refresh-text">
        {{ pullDistance > refreshThreshold ? '↑ 释放刷新' : '↓ 下拉刷新' }}
      </div>
    </div>
    
    <!-- 瀑布流内容区域 -->
    <div class="waterfall">
      <div class="column" v-for="(col, index) in columns" :key="index">
        <div 
          class="item" 
          v-for="item in col" 
          :key="item.id"
          @click="handleItemClick(item)"
        >
          <div class="media-container">
            <MediaPlayer 
              v-if="item.type === 'video' || item.type === 'audio'"
              :src="item.content"
              :poster="item.poster"
              :type="item.type"
            />
            <img v-else :src="item.content" :alt="item.title">
          </div>
          <div class="content">
            <h3>{{ item.title }}</h3>
            <p class="desc">{{ item.description }}</p>
            <div class="footer">
              <span class="author">{{ item.author }}</span>
              <span class="likes">{{ item.likes }} 赞</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 上拉加载提示 -->
    <div class="load-more" v-show="isLoading">
      <van-loading size="24px">加载中...</van-loading>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import MediaPlayer from './MediaPlayer.vue';

export default {
  data() {
    return {
      columns: [[], []],
      page: 1,
      isLoading: false,
      isRefreshing: false,
      allData: [],
      // 新增下拉刷新相关
      isDragging: false,
      pullDistance: 0,
      touchStartY: 0,
      refreshThreshold: 80
    }
  },
  mounted() {
    this.fetchData();
    this.setupScrollListener();
  },
  methods: {
    // 下拉刷新事件
    onTouchStart(e) {
      if (window.scrollY === 0 && !this.isRefreshing) {
        this.isDragging = true;
        this.touchStartY = e.touches[0].clientY;
        this.pullDistance = 0;
      }
    },
    onTouchMove(e) {
      if (!this.isDragging) return;
      const distance = e.touches[0].clientY - this.touchStartY;
      if (distance > 0) {
        e.preventDefault();
        this.pullDistance = distance > 150 ? 150 : distance;
      } else {
        this.isDragging = false;
        this.pullDistance = 0;
      }
    },
    onTouchEnd() {
      if (!this.isDragging) return;
      if (this.pullDistance > this.refreshThreshold) {
        this.isRefreshing = true;
        this.handleRefresh();
      }
      this.isDragging = false;
      this.pullDistance = 0;
    },
    async fetchData() {
      this.isLoading = true;
      try {
        const mockData = this.generateMockData(this.page);
        this.allData = [...this.allData, ...mockData];
        this.distributeData();
        if (this.isRefreshing) {
          Toast.success('刷新成功');
        }
      } catch (error) {
        Toast.fail('加载失败');
      } finally {
        this.isLoading = false;
        this.isRefreshing = false;
      }
    },

    distributeData() {
      this.columns = [[], []];
      this.allData.forEach((item, index) => {
        this.columns[index % 2].push(item);
      });
    },
    
    generateMockData(page) {
      const types = ['image', 'video'];
      const authors = ['游戏达人', '攻略大神', '233玩家', '电竞选手', '手游专家'];
      const tags = ['#新手攻略', '#装备推荐', '#关卡技巧', '#角色培养', '#活动指南'];
      const gameTitles = [
        '最新版本攻略',
        '隐藏关卡揭秘',
        '角色培养指南',
        '装备搭配推荐',
        '每日任务技巧'
      ];
      
      return Array.from({length: 10}, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const isImage = type === 'image';
        const ratio = isImage ? (Math.random() * 0.5 + 0.8) : 1.77;
        
        return {
          id: `${page}-${i}`,
          title: gameTitles[Math.floor(Math.random() * gameTitles.length)],
          description: `${tags[Math.floor(Math.random() * tags.length)]} ${this.generateGameDescription()}`,
          type,
          content: isImage 
            ? `https://picsum.photos/${Math.floor(400 * ratio)}/${Math.floor(600 * ratio)}?random=${page}${i}`
            : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          poster: isImage ? '' : `https://picsum.photos/400/600?random=${page}${i}`,
          author: authors[Math.floor(Math.random() * authors.length)],
          likes: Math.floor(Math.random() * 1000)
        };
      });
    },
    
    generateGameDescription() {
      const descs = [
        '最新版本最强角色培养攻略，助你快速通关！',
        '隐藏关卡解锁方法大公开，错过就亏大了',
        '装备搭配推荐，让你的角色战力翻倍',
        '每日任务速通技巧，节省时间拿奖励',
        '活动副本高分打法，轻松拿满奖励'
      ];
      return descs[Math.floor(Math.random() * descs.length)];
    },
    setupScrollListener() {
      window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100 && !this.isLoading) {
          this.page++;
          this.fetchData();
        }
      });
    },
    
    handleRefresh() {
      this.isRefreshing = true;
      this.page = 1;
      this.allData = [];
      // 增加2秒定时器模拟请求
      setTimeout(() => {
        this.fetchData();
      }, 2000);
    },
    
    handleItemClick(item) {
      // 处理点击事件
      console.log('点击了:', item);
    }
  }
}
</script>

<style scoped>
.refresh-tip {
  position: fixed;
  top: 12px;
  left: 33%;
  transform: translate(-50%, 0);
  min-width: 140px;
  max-width: 80vw;
  padding: 12px 28px;
  border-radius: 24px;
  background: linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%);
  box-shadow: 0 4px 16px rgba(60, 120, 240, 0.08), 0 1.5px 6px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #3a4a6b;
  font-weight: 500;
  z-index: 100;
  transition: 
    transform 0.25s cubic-bezier(.23,1.01,.32,1),
    opacity 0.2s;
  opacity: 1;
  pointer-events: none;
}

.refresh-tip .van-loading {
  margin-right: 8px;
}

.refresh-text {
  font-size: 16px;
  letter-spacing: 1px;
  color: #3a4a6b;
  font-weight: 600;
  text-shadow: 0 1px 2px #fff, 0 0.5px 1px #e0e7ef;
  transition: color 0.2s;
}
.discover-container {
  padding-top: 40px; /* 为下拉刷新提示留出空间 */
}

.discover-container {
  max-width: 100%;
  padding: 0 8px;
  background-color: #f5f5f5;
}

.waterfall {
  display: flex;
  gap: 8px;
}

.column {
  flex: 1;
  min-width: 0; /* 新增：防止内容溢出 */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  break-inside: avoid; /* 新增：防止内容被分割 */
}

.media-container {
  position: relative;
  width: 100%;
  padding-top: 133%; /* 调整为4:3比例 */
  overflow: hidden;
}

.media-container img,
.media-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 12px;
}

h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.desc {
  font-size: 12px;
  color: #999;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author {
  font-size: 12px;
  color: #666;
}

.likes {
  font-size: 12px;
  color: #ff2442;
}

.refresh-tip,
.load-more {
  text-align: center;
  padding: 16px 0;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .discover-container {
    padding: 0 4px;
  }
  
  .waterfall {
    flex-direction: row; /* 保持两列布局 */
  }
  
  .column {
    width: calc(50% - 3px); /* 精确计算宽度 */
  }
  
  .item {
    border-radius: 8px;
  }
  
  h3 {
    font-size: 13px;
  }
  
  .desc, .footer {
    font-size: 10px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 375px) {
  .column {
    width: calc(50% - 2px);
    gap: 6px;
  }
  
  .content {
    padding: 6px;
  }
}
</style>