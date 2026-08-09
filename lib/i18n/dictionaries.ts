import type { Locale } from './config';

export type Dictionary = {
  navigation: {
    home: string;
    about: string;
    devices: string;
    projects: string;
  };
  common: {
    allPosts: string;
    allTags: string;
    latestPosts: string;
    loading: string;
    backHome: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  'zh-TW': {
    navigation: {
      home: '首頁',
      about: '關於',
      devices: '裝置',
      projects: '作品',
    },
    common: {
      allPosts: '所有文章',
      allTags: '所有標籤',
      latestPosts: '最新文章',
      loading: '載入中...',
      backHome: '返回首頁',
    },
  },
  en: {
    navigation: {
      home: 'Home',
      about: 'About',
      devices: 'Devices',
      projects: 'Projects',
    },
    common: {
      allPosts: 'All posts',
      allTags: 'All tags',
      latestPosts: 'Latest posts',
      loading: 'Loading...',
      backHome: 'Back home',
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
