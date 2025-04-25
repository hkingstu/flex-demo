export const fetchCommunityData = (params) => {
  // 实际项目中替换为真实API调用
  return new Promise(resolve => {
    setTimeout(() => {
      const { page, type } = params;
      const data = Array.from({length: 10}, (_, i) => ({
        id: `${page}-${i}`,
        title: `API数据 ${type} ${page}-${i}`,
        description: `来自API的描述 ${type} ${page}-${i}`,
        type,
        content: type === 'image' 
          ? `https://picsum.photos/400/600?random=${page}${i}`
          : 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
      }));
      resolve(data);
    }, 500);
  });
};

// 支持两种URL参数格式
export const parseUrlParams = () => {
  // 格式1: ?page=1&type=image
  // 格式2: ?params={"page":1,"type":"video"}
  const search = window.location.search.substring(1);
  
  try {
    // 尝试解析为JSON格式
    return JSON.parse(search);
  } catch {
    // 解析为普通参数格式
    return Object.fromEntries(new URLSearchParams(search));
  }
};