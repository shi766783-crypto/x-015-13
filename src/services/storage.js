export function createStorage(key, seed) {
  // 旧版本用 renewed: true 标记“已续办”，且会把日期推到十年后。
  // 迁移为按推荐日期记录的“已调整”状态，保持旧数据不再提醒的行为。
  const migrate = (data) => {
    let changed = false
    data.documents?.forEach((doc) => {
      if (doc.renewed) {
        doc.adjustedExpires = doc.adjustedExpires || doc.expires
        doc.adjustedAt = doc.adjustedAt || doc.updatedAt || null
        delete doc.renewed
        changed = true
      }
    })
    return changed
  }
  const read = () => {
    try {
      const data = JSON.parse(localStorage.getItem(key)) || structuredClone(seed)
      if (migrate(data)) localStorage.setItem(key, JSON.stringify(data))
      return data
    } catch { return structuredClone(seed) }
  }
  const write = (value) => localStorage.setItem(key, JSON.stringify(value))
  return { read, write }
}
