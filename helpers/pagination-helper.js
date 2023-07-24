// 計算offset
const getOffset = (limit = 10, page = 1) => (page - 1) * limit

// 產出分頁
const getPagination = (limit = 10, page = 1, total = 50) => {
  // 總頁數
  const totalPage = Math.ceil(total / limit)
  // 全部頁數的陣列
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  // 當前頁數
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  // 上一頁
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  // 下一頁
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next
  }
}
module.exports = {
  getOffset,
  getPagination
}
