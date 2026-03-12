const readline = require("readline");
const { BookCollection } = require("./books");

const collection = new BookCollection();

function showBooks(books) {
  if (!books || books.length === 0) {
    console.log("未找到書籍。");
    return;
  }

  console.log("\n您的圖書收藏：\n");

  books.forEach((book, index) => {
    const status = book.read ? "✓" : " ";
    console.log(`${index + 1}. [${status}] ${book.title} by ${book.author} (${book.year})`);
  });

  console.log();
}

function handleList() {
  const books = collection.listBooks();
  showBooks(books);
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function handleAdd() {
  console.log("\n新增新書\n");

  const title = await prompt("標題：");
  const author = await prompt("作者：");
  const yearStr = await prompt("年份：");

  try {
    const year = yearStr ? parseInt(yearStr, 10) : 0;
    if (isNaN(year)) {
      throw new Error("年份必須是數字。");
    }
    collection.addBook(title, author, year);
    console.log("\n書籍新增成功。\n");
  } catch (err) {
    console.log(`\n錯誤：${err.message}\n`);
  }
}

function handleRemove() {
  return prompt("請輸入要移除的書籍標題：").then((title) => {
    console.log("\n移除書籍\n");
    collection.removeBook(title);
    console.log("\n如果該書存在，則已移除。\n");
  });
}

async function handleFind() {
  console.log("\n依作者尋找書籍\n");

  const author = await prompt("作者姓名：");
  const books = collection.findByAuthor(author);

  showBooks(books);
}

function showHelp() {
  console.log(`
圖書收藏協助工具

指令：
  list     - 顯示所有書籍
  add      - 新增一本書
  remove   - 依標題移除書籍
  find     - 依作者尋找書籍
  help     - 顯示此說明訊息
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    return;
  }

  const command = args[0].toLowerCase();

  switch (command) {
    case "list":
      handleList();
      break;
    case "add":
      await handleAdd();
      break;
    case "remove":
      await handleRemove();
      break;
    case "find":
      await handleFind();
      break;
    case "help":
      showHelp();
      break;
    default:
      console.log("未知指令。\n");
      showHelp();
      break;
  }
}

main();
