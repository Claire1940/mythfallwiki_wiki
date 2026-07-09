import {
	Calendar,
	MessagesSquare,
	Gift,
	BookOpen,
	Play,
	Star,
	Clapperboard,
	Scroll,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 8 个导航分类，与 content/ 文章目录一一对应
// 顺序按用户价值排序：codes(免费奖励) → guide(新手) → release(发售日) → access(如何游玩)
// → quests(任务) → review(评测) → trailer(预告) → discord(社区)
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Gift, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'release', path: '/release', icon: Calendar, isContentType: true },
	{ key: 'access', path: '/access', icon: Play, isContentType: true },
	{ key: 'quests', path: '/quests', icon: Scroll, isContentType: true },
	{ key: 'review', path: '/review', icon: Star, isContentType: true },
	{ key: 'trailer', path: '/trailer', icon: Clapperboard, isContentType: true },
	{ key: 'discord', path: '/discord', icon: MessagesSquare, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'guide', 'release', 'access', 'quests', 'review', 'trailer', 'discord']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
