'use client';

import React, { useState } from 'react';
import { Play, Lock, CheckCircle2, Music, BookOpen, Layers, ShieldCheck, Sparkles, X } from 'lucide-react';

const COURSES = [
  {
    id: 'c1',
    title: '零基础钢琴指法与键盘速通系统课',
    subtitle: '从坐姿手型到双手协调，专为成年人与零基础设计的阶梯式系统训练',
    category: 'systematic',
    categoryLabel: '阶段系统课',
    level: '零基础入门',
    price: 399,
    originalPrice: 699,
    totalLessons: 24,
    sheetMusicIncluded: true,
    lessons: [
      { id: 'l1-1', title: '第1讲：正确的触键力道与手型避坑指南', duration: '12:30', isFreePreview: true },
      { id: 'l1-2', title: '第2讲：双手的独立性与非连音慢练法', duration: '15:45', isFreePreview: true },
      { id: 'l1-3', title: '第3讲：穿指与跨指练习（含哈农变形）', duration: '18:20', isFreePreview: false },
      { id: 'l1-4', title: '第4讲：调性感知与简易和弦连接', duration: '21:10', isFreePreview: false },
    ]
  },
  {
    id: 'c2',
    title: '五线谱与流行和弦即兴实用乐理',
    subtitle: '告别死记硬背，用几何图形与听觉逻辑看懂五线谱与常用伴奏和弦套路',
    category: 'theory',
    categoryLabel: '基础乐理',
    level: '全阶段通用',
    price: 99,
    originalPrice: 199,
    totalLessons: 8,
    sheetMusicIncluded: true,
    lessons: [
      { id: 'l2-1', title: '第1讲：高低音谱号的快速地标定位法', duration: '08:50', isFreePreview: true },
      { id: 'l2-2', title: '第2讲：音程色彩与万能流行和弦套路', duration: '14:15', isFreePreview: false },
    ]
  },
  {
    id: 'c3',
    title: '《卡农》(Canon in D) 唯美演奏级精讲',
    subtitle: '分段拆解左右手节奏难点，附赠定制简化版与完整演奏版高清指法谱',
    category: 'single',
    categoryLabel: '单曲教学',
    level: '经典名曲',
    price: 49,
    originalPrice: 89,
    totalLessons: 5,
    sheetMusicIncluded: true,
    lessons: [
      { id: 'l3-1', title: '第1节：主旋律情感表达与踏板运用技巧', duration: '10:15', isFreePreview: true },
      { id: 'l3-2', title: '第2节：华彩变奏段落的双手交替练习', duration: '16:40', isFreePreview: false },
    ]
  }
];

export default function PianoAcademy() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentCourse, setCurrentCourse] = useState(COURSES[0]);
  const [activeLesson, setActiveLesson] = useState(COURSES[0].lessons[0]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);

  const filteredCourses = selectedCategory === 'all' 
    ? COURSES 
    : COURSES.filter(c => c.category === selectedCategory);

  const isPurchased = purchasedCourses.includes(currentCourse.id);

  const handleSelectLesson = (lesson: any) => {
    if (lesson.isFreePreview || isPurchased) {
      setActiveLesson(lesson);
    } else {
      setShowPayModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
              🎹
            </span>
            <div>
              <span className="font-bold text-base tracking-wider text-neutral-100">
                蓝味甜 · 钢琴课堂
              </span>
              <span className="text-[10px] font-normal text-amber-400/90 ml-2 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                官方独立网校
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-xs px-3.5 py-2 rounded-full border border-neutral-700 hover:border-neutral-500 transition text-neutral-300">
              已购课程
            </button>
            <button 
              onClick={() => setShowPayModal(true)}
              className="text-xs px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 font-semibold text-neutral-950 transition"
            >
              自主下单
            </button>
          </div>
        </div>
      </header>

      {/* Hero 宣传横幅 */}
      <section className="py-12 border-b border-neutral-900 bg-gradient-to-b from-neutral-900/60 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            支持电脑/手机随时回放 · 附赠高清指法曲谱 PDF
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-100">
            用科学的方法，弹奏出心中的旋律
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base mb-6">
            讲师：蓝味甜 | 涵盖阶段系统大课、经典单曲演奏级拆解与实用乐理速成
          </p>

          {/* 分类筛选 */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: '全部课程', icon: Layers },
              { id: 'systematic', label: '阶段系统课', icon: BookOpen },
              { id: 'single', label: '单曲精讲', icon: Music },
              { id: 'theory', label: '实用乐理', icon: ShieldCheck },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategory === tab.id
                      ? 'bg-neutral-100 text-neutral-950 shadow'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 核心功能区 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左侧：播放器与课程介绍 (占 8 列) */}
          <div className="lg:col-span-8 space-y-5">
            {/* 播放器容器 */}
            <div className="relative aspect-video rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl flex items-center justify-center group">
              {/* 动态防录屏跑马灯水印 */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none opacity-20 text-xs text-neutral-200 font-mono tracking-widest rotate-[-10deg]">
                蓝味甜钢琴工作室 · 正版授权试看
              </div>

              {/* 播放界面主体 */}
              <div className="text-center p-6 z-10">
                <div 
                  onClick={() => handleSelectLesson(activeLesson)}
                  className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-amber-400 ml-1" />
                </div>
                <h3 className="font-semibold text-base text-neutral-100 mb-1">{activeLesson.title}</h3>
                <p className="text-xs text-neutral-400">
                  {activeLesson.isFreePreview || isPurchased ? '🟢 正在试看/播放中' : '🔒 该节需解锁后观看正片'}
                </p>
              </div>

              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between px-4 text-xs text-neutral-400">
                <span>时长：{activeLesson.duration}</span>
                <span className="text-amber-400/90">支持 1.25x / 1.5x 倍速播放</span>
              </div>
            </div>

            {/* 课程详细卡片 */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 mr-2">
                    {currentCourse.categoryLabel}
                  </span>
                  <span className="text-xs text-neutral-400">阶段：{currentCourse.level}</span>
                  <h2 className="text-xl font-bold text-neutral-100 mt-2">{currentCourse.title}</h2>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-neutral-500 line-through">原价 ¥{currentCourse.originalPrice}</div>
                  <div className="text-2xl font-extrabold text-amber-400">¥{currentCourse.price}</div>
                </div>
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed mb-5">
                {currentCourse.subtitle}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-neutral-300">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>包含 {currentCourse.totalLessons} 节高清精讲</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>附赠高清可打印曲谱</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>永久回放 · 微信答疑</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：章节列表与自主下单 (占 4 列) */}
          <div className="lg:col-span-4 space-y-5">
            {/* 购买卡片 */}
            <div className="bg-gradient-to-b from-amber-500/10 to-neutral-900/60 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-semibold text-neutral-200">解锁当前全部课程</span>
                <span className="text-xl font-bold text-amber-400">¥{currentCourse.price}</span>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                支付后系统自动开通，支持手机/电脑随时随地观看。
              </p>
              <button 
                onClick={() => setShowPayModal(true)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition shadow-lg shadow-amber-500/10"
              >
                {isPurchased ? '已成功开通本课程' : '立即扫码自主下单'}
              </button>
            </div>

            {/* 目录列表 */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-3.5 border-b border-neutral-800 flex items-center justify-between">
                <h4 className="font-semibold text-xs text-neutral-200">课时目录 ({currentCourse.lessons.length} 讲)</h4>
                <span className="text-[11px] text-neutral-500">点击直接试看</span>
              </div>

              <div className="divide-y divide-neutral-800/50">
                {currentCourse.lessons.map((lesson, idx) => {
                  const isActive = activeLesson.id === lesson.id;
                  const canPlay = lesson.isFreePreview || isPurchased;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`w-full text-left p-3 flex items-center justify-between gap-3 transition ${
                        isActive 
                          ? 'bg-amber-500/10 border-l-2 border-amber-500 text-amber-300' 
                          : 'hover:bg-neutral-800/40 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-xs text-neutral-500 font-mono">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                        <span className="text-xs truncate">{lesson.title}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {canPlay ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            {lesson.isFreePreview ? '试看' : '已解锁'}
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-neutral-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 切换课程专辑 */}
            <div className="space-y-2">
              <div className="text-xs text-neutral-400 font-medium px-1">切换其他系列：</div>
              <div className="space-y-1.5">
                {filteredCourses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setCurrentCourse(course);
                      setActiveLesson(course.lessons[0]);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                      currentCourse.id === course.id
                        ? 'border-amber-500/50 bg-neutral-900 text-neutral-100'
                        : 'border-neutral-800 bg-neutral-950 hover:bg-neutral-900/40 text-neutral-400'
                    }`}
                  >
                    <div className="font-medium text-neutral-200 truncate">{course.title}</div>
                    <div className="flex justify-between items-center mt-1 text-[11px] text-neutral-500">
                      <span>{course.categoryLabel} · {course.totalLessons}讲</span>
                      <span className="text-amber-400 font-semibold">¥{course.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* 扫码支付弹窗 */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button 
              onClick={() => setShowPayModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-base text-neutral-100 mb-1">微信 / 支付宝 自助下单</h3>
            <p className="text-xs text-neutral-400 mb-4">{currentCourse.title}</p>

            {/* 二维码展示区 */}
            <div className="w-44 h-44 mx-auto bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-inner mb-4">
              <div className="w-full h-full border-2 border-dashed border-neutral-300 rounded flex flex-col items-center justify-center text-neutral-800 text-xs gap-1.5">
                <span className="text-2xl">📱</span>
                <span className="font-medium">扫码直接付款</span>
                <span className="font-bold text-amber-600 text-lg">¥{currentCourse.price}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">
              扫码支付成功后，系统将在 3 秒内自动解锁全套高清视频与课件网盘
            </p>

            <button
              onClick={() => {
                setPurchasedCourses(prev => [...prev, currentCourse.id]);
                setShowPayModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-neutral-950 transition"
            >
              模拟测试：点击直接视为已付款开通
            </button>
          </div>
        </div>
      )}
    </div>
  );
}