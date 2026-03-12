function printMenu() {
  console.log("\n📚 圖書收藏應用程式");
  console.log("1. 新增一本書");
  console.log("2. 列出書籍");
  console.log("3. 將書籍標記為已讀");
  console.log("4. 移除一本書");
  console.log("5. 結束");
}

function printBooks(books) {
  if (!books || books.length === 0) {
    console.log("您的收藏中沒有書籍。");
    return;
  }

  console.log("\n您的書籍：");
  books.forEach((book, index) => {
    const status = book.read ? "✅ 已讀" : "📖 未讀";
    console.log(`${index + 1}. ${book.title} by ${book.author} (${book.year}) - ${status}`);
  });
}

module.exports = { printMenu, printBooks };
