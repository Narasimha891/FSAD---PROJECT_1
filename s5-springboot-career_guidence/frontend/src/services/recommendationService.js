import { get } from './storageService'

/**
 * Simple AI-style recommendation engine.
 * Scores webinars based on:
 * 1. Category match with previously attended webinars
 * 2. Tag overlap with user interests
 * 3. Popularity (registration count)
 */
export function getRecommendations(userId, maxResults = 4) {
    const webinars = get('webinar_events') || []
    const registrations = get('registrations') || []
    const bookmarks = get('bookmarks') || []
    const profile = get('users')?.find(u => u.id === userId) || {}

    const userRegs = registrations.filter(r => r.userId === userId)
    const registeredIds = new Set(userRegs.map(r => r.webinarId))

    // Categories the user has shown interest in
    const attendedCategories = {}
    const attendedTags = new Set()
    userRegs.forEach(r => {
        const w = webinars.find(w => w.id === r.webinarId)
        if (w) {
            attendedCategories[w.category] = (attendedCategories[w.category] || 0) + 1
                ; (w.tags || []).forEach(t => attendedTags.add(t.toLowerCase()))
        }
    })

    // User bookmarked categories
    const userBookmarks = bookmarks.filter(b => b.userId === userId)
    userBookmarks.forEach(b => {
        const w = webinars.find(w => w.id === b.webinarId)
        if (w) {
            attendedCategories[w.category] = (attendedCategories[w.category] || 0) + 0.5
        }
    })

    // Score each upcoming webinar
    const upcoming = webinars.filter(w => w.status === 'Upcoming' && !registeredIds.has(w.id))

    const scored = upcoming.map(w => {
        let score = 0

        // Category match
        if (attendedCategories[w.category]) {
            score += attendedCategories[w.category] * 3
        }

        // Tag overlap
        ; (w.tags || []).forEach(t => {
            if (attendedTags.has(t.toLowerCase())) score += 2
        })

        // Popularity: how many people registered
        const regCount = registrations.filter(r => r.webinarId === w.id && r.status !== 'Cancelled').length
        score += Math.min(regCount, 5) * 0.5

        // Recency bonus: sooner events get a small boost
        const daysUntil = (new Date(w.date) - new Date()) / 86400000
        if (daysUntil > 0 && daysUntil < 14) score += 1

        return { ...w, score }
    })

    scored.sort((a, b) => b.score - a.score)

    // If not enough scored results, fill with random upcoming
    if (scored.length < maxResults) {
        return scored.slice(0, maxResults)
    }

    return scored.slice(0, maxResults)
}

export function getCareerInsights(userId) {
    const registrations = get('registrations') || []
    const webinars = get('webinar_events') || []
    const userRegs = registrations.filter(r => r.userId === userId && r.status !== 'Cancelled')

    const categoryCount = {}
    userRegs.forEach(r => {
        const w = webinars.find(w => w.id === r.webinarId)
        if (w) {
            categoryCount[w.category] = (categoryCount[w.category] || 0) + 1
        }
    })

    const sorted = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])
    const topCategory = sorted[0]?.[0] || 'General'
    const totalAttended = userRegs.filter(r => r.status === 'Attended').length

    return {
        topCategory,
        categoryBreakdown: categoryCount,
        totalRegistered: userRegs.length,
        totalAttended,
        completionRate: userRegs.length > 0 ? Math.round((totalAttended / userRegs.length) * 100) : 0,
        suggestion: getSuggestion(topCategory)
    }
}

function getSuggestion(category) {
    const suggestions = {
        'Technology': 'You show strong interest in technology! Consider exploring cloud computing and cybersecurity to broaden your skill set.',
        'Web Development': 'Great focus on web development! Try branching into UI/UX design or backend architecture.',
        'Cloud Computing': 'Cloud skills are in high demand! Consider adding DevOps and containerization to your portfolio.',
        'Data Science': 'Data science is a fantastic field! Complement your skills with ML/AI workshops.',
        'Design': 'Design thinking is powerful! Consider learning about front-end development to bring your designs to life.',
        'Security': 'Cybersecurity is critical! Consider exploring cloud security and ethical hacking.',
    }
    return suggestions[category] || 'Keep exploring different fields to discover your passion! Each webinar broadens your horizons.'
}
