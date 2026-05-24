# 加州公证人考试备考网站 - 设计文档

## 概述

面向美国加州（California）公证人（Notary Public）执业资格考试的在线备考平台。首版聚焦加州，后续扩展纽约等州。

## 目标用户

- 准备参加加州公证人考试的考生（加州公证员考试需求大、华人多）
- 希望利用碎片时间在手机/电脑上备考的用户
- 免费试用后再决定是否付费

## 功能范围

### 免费部分

1. **首页** — 考试介绍、学习流程说明、用户评价展示
2. **章节学习（预览）** — 前 2 章完整开放，其余章节仅显示标题和第一张卡片
3. **章节练习（预览）** — 前 2 章练习题完整开放
4. **博客** — SEO 内容营销文章（如"2025 加州公证员考试最新变化"）
5. **用户评价** — 已付费用户的评分和评论展示

### 付费部分（一次性付费，如 $14.99）

1. **全部章节学习** — 解锁全部 7 章知识点卡片
2. **全部章节练习** — 解锁全部题库
3. **模拟考试** — 随机抽题，45 分钟倒计时，考后展示分数和薄弱点
4. **错题本** — 做错的题自动收集，可针对性重练
5. **进度追踪** — 各章节完成百分比，整体学习进度可视化

### 不包含（第一版）

- 多州支持（架构预留）
- 后台管理系统（直接用 Supabase 控制台管理）

## 技术方案

| 项目 | 选型 | 说明 |
|------|------|------|
| 框架 | Next.js 14 (App Router) + TypeScript | SSR/SSG 支持 SEO，博客静态生成 |
| 样式 | Tailwind CSS | 手机端优先 |
| 后端/数据库 | Supabase | 用户认证、题库存储、进度同步、评价系统 |
| 认证 | Supabase Auth | 邮箱注册 + Google 登录 |
| 支付 | Paddle | 支持中国个人身份，处理美国税务 |
| 部署 | Vercel（前端） + Supabase 美国区域 | |
| CDN | Cloudflare | 绑定自定义域名 |

## 页面结构

```
/                  首页
/chapters          章节列表
/chapter/[id]      章节学习（知识点卡片）
/quiz/[id]         章节练习
/exam              模拟考试
/history           错题本 + 历史成绩
/blog              博客文章列表
/blog/[slug]       博客文章详情
/pricing           付费页面
/login              登录
/signup             注册
```

## 组件树

```
App
├── Layout（导航栏、页脚含免责声明）
├── HomePage
│   ├── Hero
│   ├── Features
│   ├── Testimonials（用户评价）
│   └── CTABanner
├── ChaptersPage
│   └── ProgressBar
├── ChapterPage
│   └── KnowledgeCard
├── QuizPage
│   └── QuestionCard
├── ExamPage
│   ├── Timer
│   └── ExamResult
├── HistoryPage
├── BlogPage
├── BlogPostPage
├── PricingPage
├── LoginPage
├── SignupPage
```

## 数据模型（Supabase 表）

```sql
-- 章节
chapters (id, title, slug, order, description, created_at, updated_at)

-- 知识点卡片
knowledge_cards (id, chapter_id FK, content TEXT, key_points TEXT[], sort_order, source TEXT, source_url TEXT, updated_at)

-- 题目（原创编写）
questions (id, chapter_id FK, question TEXT, options TEXT[], correct_index INT, explanation TEXT, source_ref TEXT, created_at)

-- 用户（Supabase Auth 管理，扩展表）
profiles (id FK→auth.users, email, display_name, created_at)

-- 用户进度
user_progress (id, user_id FK, chapter_id FK, completed_cards INT[], quiz_scores JSONB, mastered BOOL)

-- 错题本
user_wrong_answers (id, user_id FK, question_id FK, user_answer INT, review_count INT, last_reviewed_at TIMESTAMPTZ)

-- 模拟考记录
exam_records (id, user_id FK, score INT, total INT, time_used INT, weak_chapters INT[], taken_at TIMESTAMPTZ)

-- 付费记录（Paddle webhook 同步）
subscriptions (id, user_id FK, paddle_order_id TEXT, status TEXT, purchased_at TIMESTAMPTZ, expires_at TIMESTAMPTZ)

-- 用户评价
reviews (id, user_id FK, rating INT, comment TEXT, created_at TIMESTAMPTZ)
```

## 内容大纲（加州版，7 章）

内容来源：加州州务卿（CA Secretary of State）官方手册、加州政府法典（California Government Code）相关条款。全部题目原创编写。

1. **公证人概述** — 定义、历史、与其他法律职业的区别
2. **加州公证人的任命与资质** — 申请条件、背景调查、考试要求、宣誓就职、任期（4年）
3. **公证管辖权与地域限制** — 加州境内管辖权、跨州效力、电子公证
4. **公证行为类型** — 确认、宣誓/证词、Jurats、证明副本、签名见证
5. **身份验证** — 个人认知、身份证明文件、可信证人、加州远程公证要求
6. **记录保存与公证日志** — 日志条目要求、更正方法、记录保管与移交（任期结束时）
7. **职业道德与法律责任** — 禁止行为、利益冲突、$15,000 保证金、民事与刑事责任

每章 5-8 张知识点卡片，配套 10-15 道练习题，共计约 100 题。

## 内容规范

- 每张知识卡片标注内容来源（如"参考：CA Secretary of State 2025 Notary Public Handbook, Chapter 3"）
- 每张卡片标注最后更新日期
- 题库全部原创编写，基于公开法律条文改编
- **严禁出现** "official"、"approved"、"certified"、"guaranteed to pass" 等词
- 页脚固定显示免责声明

## 免责声明

> This website is an independent study resource and is not affiliated with, endorsed by, or connected to the California Secretary of State or any government agency. All materials are for educational reference only. Please refer to the latest official laws, regulations, and examination requirements issued by the California Secretary of State.

## 变现方案

- 免费试用前 2 章 + 部分练习题
- 一次性付费解锁全部内容（建议 $14.99-$19.99）
- Paddle 处理支付（支持中国个人身份，处理美国销售税）
- 月收入低于 $1000 时，美国税务由 Paddle 代处理；中国个税自行申报
- 后续：按州扩展付费包、广告收入

## 运营与推广

- SEO + 内容营销：博客文章覆盖公证人考试相关搜索词
- Reddit r/Notary、Facebook 公证人小组、公证人论坛参与讨论并引流
- 用户评价体系：付费用户可评分和发表评论，首页展示好评

## 部署架构

```
用户 → Cloudflare CDN（自定义域名） → Vercel（Next.js 前端） → Supabase（美国区域，Auth + DB）
                                                              → Paddle（支付）
```

## 里程碑

1. **MVP** — 1 个州（加州）、前 2 章免费、全部内容 + 题库、用户注册登录、Paddle 支付
2. **V2** — 新增纽约州、博客系统、SEO 优化
3. **V3** — 社区评论、用户排行榜、Anki 导出
