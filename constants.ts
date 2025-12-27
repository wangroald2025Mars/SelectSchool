
import { Program } from './types';

export const COUNTRIES = ['英国', '美国', '新加坡', '中国香港', '澳洲', '瑞士', '加拿大'];
export const RANKING_TYPES = ['QS 世界排名', 'US News 排名'];
// 更新为区间段选择
export const RANKING_BRACKETS = ['1-10', '11-50', '51-100', '101-200', '201-500'];
export const COST_BRACKETS = ['15万以下', '15-30万', '30-50万', '50万以上'];
export const DEGREE_TYPES = ['本科', '硕士', '博士'];
export const DURATION_OPTIONS = ['1 年', '2 年', '3 年', '4 年'];

export const MAJOR_STRUCTURE = [
  {
    name: '商科',
    subMajors: ['商业分析', '金融', '市场营销', '管理学', '会计学']
  },
  {
    name: '工科',
    subMajors: ['土木工程', '材料科学', '航空航天', '能源工程', '环境工程']
  },
  {
    name: '计算机',
    subMajors: ['人工智能', '数据科学', '软件工程', '网络安全']
  },
  {
    name: '理科',
    subMajors: ['物理学', '化学', '生物学', '数学统计']
  },
  {
    name: '艺术设计',
    subMajors: ['平面设计', '纯艺术', '数字媒体', '工业设计']
  }
];

const DEFAULT_LOGO = 'https://api.a0.dev/assets/image?text=university%20crest%20blue%20orange%20lion%20shield%20academic&seed=42';

export const MOCK_PROGRAMS: Program[] = [
  {
    id: '1',
    universityName: '南洋理工大学',
    universityEnName: 'Nanyang Technological University',
    logo: DEFAULT_LOGO,
    majorName: '人工智能理学硕士',
    majorEnName: 'MSc in Artificial Intelligence',
    college: '计算机科学与工程学院',
    tuition: 'S$ 58,000 / 全程',
    tuitionValue: 310000, 
    duration: '1.5 年',
    qsRanking: 15,
    usNewsRanking: 33,
    country: '新加坡',
    countryFlag: '🇸🇬',
    category: '人工智能',
    tags: ['顶尖AI研究', '就业率极高'],
    recentCases: 15,
    applicationStatus: '正在接受申请',
    degreeType: '硕士',
    studyMode: 'Full-time',
    views: 12500
  },
  {
    id: '1-2',
    universityName: '南洋理工大学',
    universityEnName: 'NTU',
    logo: DEFAULT_LOGO,
    majorName: '商业分析硕士',
    majorEnName: 'MSc Business Analytics',
    college: '南洋商学院',
    tuition: 'S$ 62,000 / 全程',
    tuitionValue: 330000,
    duration: '1 年',
    qsRanking: 15,
    usNewsRanking: 33,
    country: '新加坡',
    countryFlag: '🇸🇬',
    category: '商业分析',
    tags: ['实战导向', '大厂青睐'],
    recentCases: 12,
    applicationStatus: '录取中',
    degreeType: '硕士',
    studyMode: 'Full-time',
    views: 8900
  },
  {
    id: '2',
    universityName: '伦敦政治经济学院',
    universityEnName: 'LSE',
    logo: DEFAULT_LOGO,
    majorName: '金融与经济学硕士',
    majorEnName: 'MSc Finance and Economics',
    college: '金融系',
    tuition: '£ 34,128 / 年',
    tuitionValue: 315000, 
    duration: '1 年',
    qsRanking: 45,
    usNewsRanking: 230,
    country: '英国',
    countryFlag: '🇬🇧',
    category: '金融',
    tags: ['投行目标校', '金融核心区'],
    recentCases: 8,
    applicationStatus: 'Rolling 录取中',
    degreeType: '硕士',
    studyMode: 'Full-time',
    views: 15000
  },
  {
    id: '3',
    universityName: '苏黎世联邦理工学院',
    universityEnName: 'ETH Zurich',
    majorName: '能源工程硕士',
    majorEnName: 'MSc Energy Science and Technology',
    logo: DEFAULT_LOGO,
    college: '信息技术与电气工程系',
    tuition: 'CHF 1,460 / 学期',
    tuitionValue: 25000, 
    duration: '2 年',
    qsRanking: 7,
    usNewsRanking: 26,
    country: '瑞士',
    countryFlag: '🇨🇭',
    category: '能源工程',
    tags: ['学费低廉', '学术声誉极高'],
    recentCases: 5,
    applicationStatus: '春季批次开放中',
    degreeType: '硕士',
    studyMode: 'Full-time',
    views: 4200
  },
  {
    id: '4',
    universityName: '帝国理工学院',
    universityEnName: 'Imperial College London',
    majorName: '高级计算硕士',
    majorEnName: 'MSc in Advanced Computing',
    logo: DEFAULT_LOGO,
    college: '计算机系',
    tuition: '£ 39,400',
    tuitionValue: 360000,
    duration: '1 年',
    qsRanking: 6,
    usNewsRanking: 13,
    country: '英国',
    countryFlag: '🇬🇧',
    category: '人工智能',
    tags: ['顶级实验室', '高强度教学'],
    recentCases: 10,
    applicationStatus: '录取中',
    degreeType: '硕士',
    studyMode: 'Full-time',
    views: 21000
  },
  {
    id: '5',
    universityName: '伦敦大学学院',
    universityEnName: 'UCL',
    majorName: '管理学硕士',
    majorEnName: 'MSc Management',
    logo: DEFAULT_LOGO,
    college: '管理学院',
    tuition: '£ 35,100',
    tuitionValue: 320000,
    duration: '1 年',
    qsRanking: 9,
    usNewsRanking: 12,
    country: '英国',
    countryFlag: '🇬🇧',
    category: '管理学',
    tags: ['G5名校', '跨专业友好'],
    recentCases: 25,
    applicationStatus: '录取中',
    degreeType: '硕士',
    studyMode: 'Full-time',
    views: 18500
  },
  {
    id: '6',
    universityName: '新加坡国立大学',
    universityEnName: 'NUS',
    majorName: '数据科学理学硕士',
    majorEnName: 'MSc Data Science and Machine Learning',
    logo: DEFAULT_LOGO,
    college: '理学院',
    tuition: 'S$ 55,000',
    tuitionValue: 295000,
    duration: '2 年',
    qsRanking: 8,
    usNewsRanking: 26,
    country: '新加坡',
    countryFlag: '🇸🇬',
    category: '数据科学',
    tags: ['亚洲第一', '数据驱动'],
    recentCases: 30,
    applicationStatus: '开放中',
    degreeType: '硕士',
    studyMode: 'Full-time',
    views: 19800
  }
];
