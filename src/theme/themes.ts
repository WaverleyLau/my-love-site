// 主题类型定义
export interface Theme {
  name: string;
  label: string;
  colors: {
    // 背景色
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    backgroundCard: string;
    backgroundNavbar: string;
    
    // 文本色
    textPrimary: string;
    textSecondary: string;
    textDescription: string;
    textLight: string;
    
    // 强调色
    accentPrimary: string;
    accentSecondary: string;
    accentLight: string;
    
    // 边框和阴影
    borderColor: string;
    shadowColor: string;
    modalOverlay: string;
    
    // 特殊元素
    timelineLine: string;
    timelineDot: string;
    buttonHover: string;
  };
}

// 深色主题（默认）
export const darkTheme: Theme = {
  name: 'dark',
  label: '深色主题',
  colors: {
    // 背景色
    background: '#1a1a1a',
    backgroundSecondary: '#242424',
    backgroundTertiary: '#3a3a3a',
    backgroundCard: '#2a2a2a',
    backgroundNavbar: '#0f0f0f',
    
    // 文本色
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
    textDescription: '#aaa',
    textLight: '#666',
    
    // 强调色
    accentPrimary: '#4a9eff',
    accentSecondary: '#64b5f6',
    accentLight: 'rgba(74, 158, 255, 0.1)',
    
    // 边框和阴影
    borderColor: '#3a3a3a',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    modalOverlay: 'rgba(0, 0, 0, 0.9)',
    
    // 特殊元素
    timelineLine: '#3a3a3a',
    timelineDot: '#4a9eff',
    buttonHover: 'rgba(255, 255, 255, 0.1)'
  }
};

// 白色主题
export const whiteTheme: Theme = {
  name: 'white',
  label: '白色主题',
  colors: {
    // 背景色
    background: '#f8f9fa',
    backgroundSecondary: '#ffffff',
    backgroundTertiary: '#e9ecef',
    backgroundCard: '#ffffff',
    backgroundNavbar: '#ffffff',
    
    // 文本色
    textPrimary: '#212529',
    textSecondary: '#495057',
    textDescription: '#6c757d',
    textLight: '#adb5bd',
    
    // 强调色
    accentPrimary: '#007bff',
    accentSecondary: '#0056b3',
    accentLight: 'rgba(0, 123, 255, 0.1)',
    
    // 边框和阴影
    borderColor: '#dee2e6',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    modalOverlay: 'rgba(0, 0, 0, 0.7)',
    
    // 特殊元素
    timelineLine: '#dee2e6',
    timelineDot: '#007bff',
    buttonHover: 'rgba(0, 123, 255, 0.05)'
  }
};

// 温馨主题
export const warmTheme: Theme = {
  name: 'warm',
  label: '温馨主题',
  colors: {
    // 背景色
    background: '#fff8f0',
    backgroundSecondary: '#fff5eb',
    backgroundTertiary: '#ffe8cc',
    backgroundCard: '#ffffff',
    backgroundNavbar: '#f8e4c9',
    
    // 文本色
    textPrimary: '#6d4c41',
    textSecondary: '#8d6e63',
    textDescription: '#a1887f',
    textLight: '#bcaaa4',
    
    // 强调色
    accentPrimary: '#ff9800',
    accentSecondary: '#f57c00',
    accentLight: 'rgba(255, 152, 0, 0.1)',
    
    // 边框和阴影
    borderColor: '#e0e0e0',
    shadowColor: 'rgba(248, 228, 201, 0.3)',
    modalOverlay: 'rgba(109, 76, 65, 0.8)',
    
    // 特殊元素
    timelineLine: '#ffe0b2',
    timelineDot: '#ff9800',
    buttonHover: 'rgba(255, 152, 0, 0.05)'
  }
};

// 海洋主题
export const oceanTheme: Theme = {
  name: 'ocean',
  label: '海洋主题',
  colors: {
    // 背景色
    background: '#e0f7fa',
    backgroundSecondary: '#b2ebf2',
    backgroundTertiary: '#80deea',
    backgroundCard: '#ffffff',
    backgroundNavbar: '#80deea',
    
    // 文本色
    textPrimary: '#006064',
    textSecondary: '#00838f',
    textDescription: '#26a69a',
    textLight: '#4db6ac',
    
    // 强调色
    accentPrimary: '#00bcd4',
    accentSecondary: '#0097a7',
    accentLight: 'rgba(0, 188, 212, 0.1)',
    
    // 边框和阴影
    borderColor: '#b2ebf2',
    shadowColor: 'rgba(178, 235, 242, 0.3)',
    modalOverlay: 'rgba(0, 96, 100, 0.8)',
    
    // 特殊元素
    timelineLine: '#80deea',
    timelineDot: '#00bcd4',
    buttonHover: 'rgba(0, 188, 212, 0.05)'
  }
};

// 所有主题列表
export const themes: Theme[] = [darkTheme, whiteTheme, warmTheme, oceanTheme];

// 获取主题
export const getTheme = (name: string): Theme => {
  return themes.find(theme => theme.name === name) || darkTheme;
};

// 保存主题到localStorage
export const saveTheme = (themeName: string): void => {
  localStorage.setItem('theme', themeName);
};

// 从localStorage加载主题
export const loadTheme = (): string => {
  return localStorage.getItem('theme') || 'dark';
};
