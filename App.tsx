
import React, { useState, useMemo, useEffect } from 'react';
import { Program, FilterState, FavoriteList, ThemeConfig } from './types';
import { 
  MOCK_PROGRAMS, 
  COUNTRIES, 
  RANKING_TYPES, 
  COST_BRACKETS, 
  DEGREE_TYPES, 
  DURATION_OPTIONS,
  MAJOR_STRUCTURE 
} from './constants';
import { getAiConsultation } from './services/geminiService';
import { 
  Sparkles, 
  Search, 
  X, 
  ChevronDown,
  RotateCcw,
  MapPin,
  Heart,
  GraduationCap,
  Settings2,
  Trophy,
  Clock,
  ArrowRight,
  ListFilter,
  School,
  Plus,
  CheckCircle2,
  Palette,
  Globe2,
  BookOpen,
  DollarSign,
  BarChart3,
  Layers,
  CalendarDays,
  Minus
} from 'lucide-react';

// --- Morandi Color Palette ---
const MORANDI = {
  text: '#5B6D76',        
  blue: '#D6E0E6',        
  green: '#C4D1C2',       
  rose: '#E6D6D6',        
  sand: '#E6E0D6',        
  purple: '#DAD6E6',      
  border: '#CFD8DC',
  deepText: '#4A5A62',    
  sidebarIcon: '#64748B'  
};

// --- Sub-components ---

const ThemeSettings: React.FC<{
  theme: ThemeConfig;
  onThemeChange: (newTheme: Partial<ThemeConfig>) => void;
  onReset: () => void;
  onClose: () => void;
}> = ({ theme, onThemeChange, onReset, onClose }) => {
  const presets = [
    { name: '精英学者', sidebar: '#F8FAFC', main: '#FFFFFF', accent: '#003399' },
    { name: '午夜实验室', sidebar: '#0F172A', main: '#1E293B', accent: '#3B82F6' },
    { name: '牛津砖红', sidebar: '#FDFCFB', main: '#FFFAF8', accent: '#991B1B' },
    { name: '森林学院', sidebar: '#F0F9FF', main: '#F0FFF4', accent: '#065F46' },
  ];

  return (
    <div className="fixed top-20 right-8 z-[120] w-80 glass-effect rounded-[2rem] shadow-2xl border border-white p-6 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Palette size={16} className="text-blue-600" /> 个性化界面
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={16} /></button>
      </div>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">官方预设方案</span>
          <div className="grid grid-cols-2 gap-3">
            {presets.map(p => (
              <button key={p.name} onClick={() => onThemeChange({ sidebarBg: p.sidebar, mainBg: p.main, accentColor: p.accent })} className="flex flex-col gap-2 p-2 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all bg-white shadow-sm group">
                <div className="h-10 w-full rounded-lg flex overflow-hidden border border-slate-100">
                  <div className="w-1/3" style={{ backgroundColor: p.sidebar }} />
                  <div className="w-2/3" style={{ backgroundColor: p.main }} />
                </div>
                <span className="text-[10px] font-bold text-slate-600 text-center">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">精密色彩调节</span>
          <div className="space-y-2">
            {[ { label: '侧边栏', key: 'sidebarBg' }, { label: '工作区', key: 'mainBg' } ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                <input type="color" value={(theme as any)[item.key]} onChange={(e) => onThemeChange({ [item.key]: e.target.value })} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={onReset} className="w-full py-2.5 rounded-xl border border-slate-200 text-[11px] font-black text-slate-500 hover:bg-slate-50 transition-all">重置默认</button>
      </div>
    </div>
  );
};

const FilterDrawer: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isOpen, onToggle, children }) => (
  <div className="rounded-2xl border border-slate-100 bg-white/70 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-200">
    <button 
      onClick={onToggle} 
      className={`w-full flex items-center justify-between px-5 py-4 text-[12px] font-black text-slate-700 hover:bg-white transition-colors ${isOpen ? 'bg-slate-50/40' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
          {icon}
        </div>
        <span className="tracking-wide text-slate-800">{title}</span>
      </div>
      <ChevronDown size={16} className={`transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
    </button>
    <div 
      className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
    >
      <div className="p-5 border-t border-slate-50 bg-white/40">
        {children}
      </div>
    </div>
  </div>
);

const HorizontalProgramCard: React.FC<{ 
  program: Program; 
  currentRankType: string; 
  isNested?: boolean;
  lists: FavoriteList[];
  onToggleFavorite: (programId: string, listId: string) => void;
  onCreateAndAdd: (programId: string, name: string) => void;
  onOpenManager: () => void;
}> = ({ program, currentRankType, isNested, lists, onToggleFavorite, onCreateAndAdd, onOpenManager }) => {
  const [showFavoritePop, setShowFavoritePop] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  const isQS = currentRankType.includes('QS');
  const rank = isQS ? program.qsRanking : (program.usNewsRanking || 'NA');
  const isFavoritedAnywhere = lists.some(l => l.programIds.includes(program.id));

  return (
    <div className={`premium-card relative rounded-[1.2rem] border overflow-hidden ${isNested ? 'border-slate-100 bg-white/40 p-3' : 'border-slate-100 bg-white p-4'}`}>
      <div className="flex gap-5 items-center">
        <div className="flex flex-col items-center shrink-0 w-20">
          <div className="w-20 h-20 rounded-xl bg-white p-2.5 flex items-center justify-center border border-slate-100 mb-1.5 shadow-sm group-hover:border-blue-200 transition-colors">
            <img src={program.logo} alt={program.universityName} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100/60 rounded-md text-[9px] font-black text-slate-600 border border-slate-200/50">
             <span>{program.country}</span>
             <Globe2 size={9} className="text-blue-500" />
          </div>
        </div>

        <div className="flex-1 min-w-0 border-l border-slate-100 pl-5 flex flex-col justify-center">
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex flex-col min-w-0 text-left">
              <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{program.universityName}</h3>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{program.universityEnName}</span>
            </div>
            
            <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100/50 shadow-sm">
              <Trophy size={13} className="text-emerald-600" />
              <span className="text-[11px] font-black tracking-tighter uppercase opacity-80">QS</span>
              <span className="text-[15px] font-black leading-none">{rank}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2.5 text-left">
            <h4 className="text-md font-bold leading-tight" style={{ color: MORANDI.deepText }}>
              {program.majorName}
            </h4>
            <div className="flex items-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block" />
               <span className="text-[11px] font-medium text-slate-400 italic">
                 {program.majorEnName}
               </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1 py-1 px-2 rounded-md border border-white/40 shadow-sm transition-colors" style={{ backgroundColor: MORANDI.green }}>
              <GraduationCap size={12} className="text-slate-700" />
              <span className="text-[10px] font-black text-slate-800">{program.college}</span>
            </div>
            <div className="flex items-center gap-1 py-1 px-2 rounded-md border border-white/40 shadow-sm transition-colors" style={{ backgroundColor: MORANDI.green }}>
              <span className="text-[10px] font-black text-slate-800">{program.degreeType}</span>
            </div>
            <div className="flex items-center gap-1 py-1 px-2 rounded-md border border-white/40 shadow-sm transition-colors" style={{ backgroundColor: MORANDI.green }}>
              <Clock size={11} className="text-slate-700" />
              <span className="text-[10px] font-black text-slate-800">时长: {program.duration}</span>
            </div>
          </div>
        </div>

        <div className="w-48 flex flex-col justify-between items-end border-l border-slate-100 pl-5 shrink-0 py-1">
          <div className="flex items-center justify-end w-full gap-4 mb-4 text-left">
            <div className="relative">
              <button 
                onClick={() => setShowFavoritePop(!showFavoritePop)} 
                className={`p-1.5 rounded-full transition-all border shadow-sm ${isFavoritedAnywhere ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-50 text-slate-300 border-slate-100 hover:bg-rose-50 hover:text-rose-400'}`}
              >
                <Heart size={18} fill={isFavoritedAnywhere ? "white" : "none"} stroke={isFavoritedAnywhere ? "white" : "currentColor"} strokeWidth={isFavoritedAnywhere ? 0 : 2} />
              </button>
              {showFavoritePop && (
                <div className="absolute top-8 right-0 z-50 w-56 glass-effect rounded-2xl shadow-2xl border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-500 uppercase">加入心愿单</span>
                    <button onClick={() => setShowFavoritePop(false)}><X size={12} /></button>
                  </div>
                  <div className="max-h-40 overflow-y-auto mb-3 space-y-1 custom-scrollbar">
                    {lists.map(l => (
                      <button key={l.id} onClick={() => onToggleFavorite(program.id, l.id)} className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${l.programIds.includes(program.id) ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-[11px] font-black truncate">{l.name}</span>
                          <span className={`text-[8px] font-bold ${l.programIds.includes(program.id) ? 'text-blue-100' : 'text-slate-400'}`}>{l.programIds.length} 个项目</span>
                        </div>
                        {l.programIds.includes(program.id) && <CheckCircle2 size={12} />}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input type="text" placeholder="新建名称..." className="w-full text-[10px] bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-2 pr-8 outline-none font-bold" value={newListName} onChange={(e) => setNewListName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && newListName.trim() && (onCreateAndAdd(program.id, newListName), setNewListName(''))} />
                    <button onClick={() => newListName.trim() && (onCreateAndAdd(program.id, newListName), setNewListName(''))} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500"><Plus size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full text-right">
            <div className="flex items-baseline justify-end gap-1.5 mb-3">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">费用预算</span>
              <span className="text-lg font-black text-slate-800 tracking-tighter leading-none">{program.tuition}</span>
            </div>
            
            <button 
              className="w-full py-2 bg-slate-900 text-white rounded-[0.8rem] text-[11px] font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 group/btn border border-slate-800"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = MORANDI.deepText)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
            >
              查看详情 <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('app_theme');
    return saved ? JSON.parse(saved) : { sidebarBg: '#F8FAFC', mainBg: '#FFFFFF', accentColor: '#003399' };
  });
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'program' | 'school'>('program');
  const [sortMode, setSortMode] = useState<'ranking' | 'views' | 'cost'>('ranking');
  const [showFavoriteManager, setShowFavoriteManager] = useState(false);
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>(() => {
    const saved = localStorage.getItem('favorite_lists');
    return saved ? JSON.parse(saved) : [{ id: 'default', name: '我的第一志愿', programIds: [] }];
  });

  const [filters, setFilters] = useState<FilterState>({
    countries: [], categories: [], rankingType: 'QS 世界排名', minRank: '', maxRank: '', costRanges: [], degreeTypes: [], studyModes: [], durations: [], searchQuery: '',
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    discipline: true,
    country: true,
    ranking: true,
    degree: false,
    duration: false,
    cost: false
  });

  const [expandedDisciplines, setExpandedDisciplines] = useState<string[]>(['商科']);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => localStorage.setItem('favorite_lists', JSON.stringify(favoriteLists)), [favoriteLists]);
  useEffect(() => localStorage.setItem('app_theme', JSON.stringify(theme)), [theme]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredPrograms = useMemo(() => {
    let result = MOCK_PROGRAMS.filter(p => {
      const matchCountry = filters.countries.length === 0 || filters.countries.includes(p.country);
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(p.category);
      const matchSearch = p.universityName.toLowerCase().includes(filters.searchQuery.toLowerCase()) || p.majorName.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const currentRank = filters.rankingType.includes('QS') ? p.qsRanking : (p.usNewsRanking || 999);
      const min = filters.minRank === '' ? 0 : Number(filters.minRank);
      const max = filters.maxRank === '' ? 9999 : Number(filters.maxRank);
      const matchRank = currentRank >= min && currentRank <= max;

      const matchCost = filters.costRanges.length === 0 || filters.costRanges.some(cr => {
        if (cr.includes('以下')) return p.tuitionValue < 150000;
        if (cr.includes('15-30')) return p.tuitionValue >= 150000 && p.tuitionValue <= 300000;
        if (cr.includes('30-50')) return p.tuitionValue > 300000 && p.tuitionValue <= 500000;
        return p.tuitionValue > 500000;
      });

      const matchDegree = filters.degreeTypes.length === 0 || filters.degreeTypes.includes(p.degreeType);
      const matchDuration = filters.durations.length === 0 || filters.durations.some(d => p.duration.includes(parseInt(d).toString()));

      return matchCountry && matchCategory && matchSearch && matchRank && matchCost && matchDegree && matchDuration;
    });
    result.sort((a, b) => sortMode === 'ranking' ? (filters.rankingType.includes('QS') ? a.qsRanking - b.qsRanking : (a.usNewsRanking || 999) - (b.usNewsRanking || 999)) : sortMode === 'views' ? b.views - a.views : a.tuitionValue - b.tuitionValue);
    return result;
  }, [filters, sortMode]);

  const handleAiAsk = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    try {
      const insight = await getAiConsultation(filters, filteredPrograms);
      setAiInsight(insight || "智选分析已就绪。");
    } catch (error) {
      setAiInsight("连接失败，请重新尝试生成。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-700 bg-[#FDFCFB]">
      <nav className="sticky top-0 z-[100] h-16 w-full glass-effect border-b border-slate-100 flex items-center justify-between px-8">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Globe2 className="text-white" size={22} />
             </div>
             <div className="flex flex-col -space-y-1 text-left">
               <h1 className="font-serif text-xl font-black text-slate-900">GlobalSelect</h1>
               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-600">Elite Admissions</span>
             </div>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">
             <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Master Navigator</a>
             <a href="#" className="hover:text-slate-900 transition-colors">Universities</a>
             <a href="#" className="hover:text-slate-900 transition-colors">Scholarships</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setShowThemeSettings(!showThemeSettings)} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all">
             <Palette size={18} />
           </button>
           <button onClick={() => setShowFavoriteManager(true)} className="flex items-center gap-2 px-4 py-2.5 border border-slate-100 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all">
             <Heart size={16} />
             <span className="text-[11px] font-black">心愿单</span>
           </button>
           <button onClick={handleAiAsk} disabled={isAiLoading} className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-[11px] font-black shadow-xl transition-all hover:scale-105 active:scale-95 ${isAiLoading ? 'ai-active-border' : 'bg-slate-900'}`}>
             {isAiLoading ? <RotateCcw size={14} className="animate-spin" /> : <Sparkles size={14} className="text-amber-400" />}
             <span>{isAiLoading ? '深度分析中...' : '生成智选报告'}</span>
           </button>
        </div>
      </nav>

      <div className="flex-1 flex w-full relative">
        <aside className="w-[340px] shrink-0 border-r border-slate-100 p-6 transition-colors duration-500 hidden lg:block overflow-y-auto custom-scrollbar bg-slate-50/30" style={{ backgroundColor: theme.sidebarBg }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Settings2 size={18} className="text-blue-600" /> 全维度筛选
              </h2>
              <button 
                onClick={() => setFilters({ countries: [], categories: [], rankingType: 'QS 世界排名', minRank: '', maxRank: '', costRanges: [], degreeTypes: [], studyModes: [], durations: [], searchQuery: '' })} 
                className="text-[10px] font-black text-slate-300 hover:text-blue-600 transition-colors"
              >
                重置筛选
              </button>
            </div>

            <FilterDrawer title="学术领域分类" icon={<BookOpen size={16} />} isOpen={openSections.discipline} onToggle={() => toggleSection('discipline')}>
              <div className="space-y-2">
                {MAJOR_STRUCTURE.map(cat => (
                  <div key={cat.name} className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <button onClick={() => setExpandedDisciplines(p => p.includes(cat.name) ? p.filter(x => x !== cat.name) : [...p, cat.name])} className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50">
                      <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${expandedDisciplines.includes(cat.name) ? 'bg-blue-600' : 'bg-slate-200'}`} />{cat.name}</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${expandedDisciplines.includes(cat.name) ? 'rotate-180 text-blue-600' : 'text-slate-300'}`} />
                    </button>
                    {expandedDisciplines.includes(cat.name) && (
                      <div className="px-4 pb-3 grid grid-cols-1 gap-1 text-left border-t border-slate-50 pt-2">
                        {cat.subMajors.map(sub => (
                          <label key={sub} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-blue-50/40 cursor-pointer group transition-colors">
                            <div className="relative flex items-center justify-center">
                              <input type="checkbox" className="peer appearance-none w-3.5 h-3.5 rounded border border-slate-200 bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" checked={filters.categories.includes(sub)} onChange={() => setFilters(f => ({...f, categories: f.categories.includes(sub) ? f.categories.filter(x => x !== sub) : [...f.categories, sub]}))} />
                              <CheckCircle2 className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" size={9} />
                            </div>
                            <span className={`text-[10px] font-bold transition-colors ${filters.categories.includes(sub) ? 'text-blue-600' : 'text-slate-500'}`}>{sub}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FilterDrawer>

            <FilterDrawer title="全球目的地选择" icon={<MapPin size={16} />} isOpen={openSections.country} onToggle={() => toggleSection('country')}>
              <div className="grid grid-cols-2 gap-2">
                {COUNTRIES.map(c => (
                  <button key={c} onClick={() => setFilters(f => ({...f, countries: f.countries.includes(c) ? f.countries.filter(x => x !== c) : [...f.countries, c]}))} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black border transition-all ${filters.countries.includes(c) ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>{c}</button>
                ))}
              </div>
            </FilterDrawer>

            <FilterDrawer title="根据排名筛选" icon={<BarChart3 size={16} />} isOpen={openSections.ranking} onToggle={() => toggleSection('ranking')}>
              <div className="space-y-4">
                 <div className="flex bg-slate-100 p-1 rounded-xl">
                    {RANKING_TYPES.map(t => (
                      <button key={t} onClick={() => setFilters(f => ({...f, rankingType: t}))} className={`flex-1 py-1.5 text-[9px] font-black rounded-lg transition-all ${filters.rankingType === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                    ))}
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="flex-1">
                     <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block text-left">最低排名</label>
                     <input type="number" placeholder="1" className="w-full bg-white border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold outline-none focus:border-blue-300" value={filters.minRank} onChange={(e) => setFilters(f => ({...f, minRank: e.target.value}))} />
                   </div>
                   <Minus size={14} className="mt-5 text-slate-300 shrink-0" />
                   <div className="flex-1">
                     <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block text-left">最高排名</label>
                     <input type="number" placeholder="500" className="w-full bg-white border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-bold outline-none focus:border-blue-300" value={filters.maxRank} onChange={(e) => setFilters(f => ({...f, maxRank: e.target.value}))} />
                   </div>
                 </div>
              </div>
            </FilterDrawer>

            <FilterDrawer title="学位类型筛选" icon={<Layers size={16} />} isOpen={openSections.degree} onToggle={() => toggleSection('degree')}>
              <div className="grid grid-cols-1 gap-1.5">
                {DEGREE_TYPES.map(d => (
                  <button key={d} onClick={() => setFilters(f => ({...f, degreeTypes: f.degreeTypes.includes(d) ? f.degreeTypes.filter(x => x !== d) : [...f.degreeTypes, d]}))} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-[10px] font-black transition-all ${filters.degreeTypes.includes(d) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                    <span>{d}</span>
                    {filters.degreeTypes.includes(d) && <CheckCircle2 size={12} />}
                  </button>
                ))}
              </div>
            </FilterDrawer>

            <FilterDrawer title="项目时长筛选" icon={<CalendarDays size={16} />} isOpen={openSections.duration} onToggle={() => toggleSection('duration')}>
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map(d => (
                  <button key={d} onClick={() => setFilters(f => ({...f, durations: f.durations.includes(d) ? f.durations.filter(x => x !== d) : [...f.durations, d]}))} className={`py-2.5 rounded-xl border text-[10px] font-black transition-all ${filters.durations.includes(d) ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>{d}</button>
                ))}
              </div>
            </FilterDrawer>

            <FilterDrawer title="留学成本预算" icon={<DollarSign size={16} />} isOpen={openSections.cost} onToggle={() => toggleSection('cost')}>
              <div className="space-y-1.5">
                {COST_BRACKETS.map(r => (
                  <button key={r} onClick={() => setFilters(f => ({...f, costRanges: f.costRanges.includes(r) ? f.costRanges.filter(x => x !== r) : [...f.costRanges, r]}))} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-[10px] font-black transition-all ${filters.costRanges.includes(r) ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                    <span>{r}</span>
                    {filters.costRanges.includes(r) && <CheckCircle2 size={12} />}
                  </button>
                ))}
              </div>
            </FilterDrawer>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-10 relative transition-colors duration-500 overflow-y-auto custom-scrollbar" style={{ backgroundColor: theme.mainBg }}>
          <div className="absolute inset-0 bg-grid pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <header className="mb-8">
               <div className="flex items-center gap-2 mb-4 text-left">
                 <div className="h-0.5 w-12 bg-blue-600 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600/60">Admission Intelligence Platform</span>
               </div>
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
                 <div>
                   <h2 className="font-serif text-5xl font-black text-slate-900 mb-4 leading-none">寻找您的理想 <span className="text-blue-700 italic">学术起点</span></h2>
                   <p className="text-[13px] font-medium text-slate-400 max-w-xl leading-relaxed">GlobalSelect 实时整合 3000+ 顶尖项目动态。不仅仅是搜索，更是基于全球学术趋势的深度匹配。 </p>
                 </div>
                 <div className="flex bg-white/60 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                   <button onClick={() => setViewMode('program')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black transition-all ${viewMode === 'program' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}><ListFilter size={14}/>按项目列表</button>
                   <button onClick={() => setViewMode('school')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black transition-all ${viewMode === 'school' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}><School size={14}/>按大学聚合</button>
                 </div>
               </div>
            </header>

            <div className="mb-6 glass-effect p-4 rounded-3xl border border-white shadow-xl shadow-slate-200/40">
               <div className="flex flex-col md:flex-row gap-4 items-center">
                 <div className="relative flex-1 group w-full text-left">
                   <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                   <input type="text" placeholder="输入大学、学院或研究方向..." className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white border border-slate-100 text-sm font-bold focus:border-blue-300 outline-none transition-all" value={filters.searchQuery} onChange={(e) => setFilters(f => ({...f, searchQuery: e.target.value}))} />
                 </div>
                 <div className="flex items-center gap-6 shrink-0 bg-slate-50 px-6 h-14 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">排序逻辑</span>
                    <div className="flex items-center gap-2">
                       {['ranking', 'views', 'cost'].map(m => (
                         <button key={m} onClick={() => setSortMode(m as any)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${sortMode === m ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
                           {m === 'ranking' ? '权威排名' : m === 'views' ? '趋势热度' : '留学成本'}
                         </button>
                       ))}
                    </div>
                 </div>
               </div>
            </div>

            <div className="space-y-4 text-left">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map(p => (
                  <HorizontalProgramCard key={p.id} program={p} currentRankType={filters.rankingType} lists={favoriteLists} onToggleFavorite={(pid, lid) => setFavoriteLists(prev => prev.map(l => l.id === lid ? { ...l, programIds: l.programIds.includes(pid) ? l.programIds.filter(x => x !== pid) : [...l.programIds, pid] } : l))} onCreateAndAdd={(pid, name) => setFavoriteLists(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name, programIds: [pid] }])} onOpenManager={() => setShowFavoriteManager(true)} />
                ))
              ) : (
                <div className="py-40 flex flex-col items-center opacity-40"><Search size={80} strokeWidth={1} className="mb-6 text-slate-300" /><h4 className="text-2xl font-serif">未发现符合标准的学术项目</h4><p className="mt-2 text-sm">尝试放宽排名或预算限制以获取更多结果。</p></div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showThemeSettings && <ThemeSettings theme={theme} onThemeChange={(t) => setTheme(prev => ({ ...prev, ...t }))} onReset={() => setTheme({ sidebarBg: '#F8FAFC', mainBg: '#FFFFFF', accentColor: '#003399' })} onClose={() => setShowThemeSettings(false)} />}
      
      {aiInsight && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 glass-effect animate-in fade-in duration-300 text-left">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setAiInsight(null)} />
          <div className="relative w-full max-w-5xl h-[80vh] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex overflow-hidden border border-white animate-in zoom-in-95 duration-500">
             <div className="w-80 bg-slate-900 p-10 text-white flex flex-col justify-between">
                <div>
                   <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-10"><Sparkles size={32} /></div>
                   <h3 className="font-serif text-3xl font-bold mb-6 text-left">AI 学术咨询<br/>全景报告</h3>
                   <div className="h-1 w-12 bg-blue-600 rounded-full mb-8" />
                   <div className="space-y-4 text-slate-400 text-[11px] font-bold text-left">
                      <div className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> 2025 年度申请趋势对标</div>
                      <div className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> 动态风险评估模型</div>
                      <div className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> 多维专业契合度分析</div>
                   </div>
                </div>
                <p className="text-[10px] text-slate-500 italic text-left">报告生成基于 Gemini 3 Flash 模型实时推演。</p>
             </div>
             <div className="flex-1 flex flex-col">
                <div className="h-20 border-b border-slate-50 flex items-center justify-between px-10">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Insight Report Analysis Ready</span>
                   <button onClick={() => setAiInsight(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                   <div className="prose prose-slate prose-lg max-w-none text-left">
                      <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{aiInsight}</div>
                   </div>
                </div>
                <div className="h-24 border-t border-slate-50 flex items-center justify-end px-10">
                   <button onClick={() => setAiInsight(null)} className="px-10 py-3 bg-slate-900 text-white rounded-2xl text-[12px] font-black hover:bg-blue-600 transition-colors shadow-lg">确认并保存分析结果</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
