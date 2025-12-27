
export interface Program {
  id: string;
  universityName: string;
  universityEnName: string;
  logo: string;
  majorName: string;
  majorEnName: string;
  college: string;
  tuition: string; 
  tuitionValue: number; 
  duration: string;
  qsRanking: number;
  usNewsRanking?: number;
  country: string;
  countryFlag: string;
  category: string;
  tags: string[];
  admissionBatch?: string;
  recentCases: number;
  applicationStatus: string;
  degreeType: '本科' | '硕士' | '博士';
  studyMode: 'Full-time' | 'Part-time';
  views: number;
}

export interface FavoriteList {
  id: string;
  name: string;
  programIds: string[];
}

export interface ThemeConfig {
  sidebarBg: string;
  mainBg: string;
  accentColor: string;
}

export interface FilterState {
  countries: string[];
  categories: string[];
  rankingType: string;
  minRank: string;
  maxRank: string;
  costRanges: string[];
  degreeTypes: string[];
  studyModes: string[];
  durations: string[];
  searchQuery: string;
}
