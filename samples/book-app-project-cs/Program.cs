using BookApp.Models;
using BookApp.Services;

var collection = new BookCollection();

void ShowBooks(List<Book> books)
{
    if (books.Count == 0)
    {
        Console.WriteLine("未找到書籍。");
        return;
    }

    Console.WriteLine("\n您的圖書收藏：\n");

    for (int i = 0; i < books.Count; i++)
    {
        var book = books[i];
        var status = book.Read ? "✓" : " ";
        Console.WriteLine($"{i + 1}. [{status}] {book.Title} by {book.Author} ({book.Year})");
    }

    Console.WriteLine();
}

void HandleList()
{
    var books = collection.ListBooks();
    ShowBooks(books);
}

void HandleAdd()
{
    Console.WriteLine("\n新增新書\n");

    Console.Write("標題：");
    var title = Console.ReadLine()?.Trim() ?? "";

    Console.Write("作者：");
    var author = Console.ReadLine()?.Trim() ?? "";

    Console.Write("年份：");
    var yearStr = Console.ReadLine()?.Trim() ?? "";

    if (int.TryParse(yearStr, out var year))
    {
        collection.AddBook(title, author, year);
        Console.WriteLine("\n書籍新增成功。\n");
    }
    else
    {
        Console.WriteLine($"\n錯誤：'{yearStr}' 不是有效的年份。\n");
    }
}

void HandleRemove()
{
    Console.WriteLine("\n移除書籍\n");

    Console.Write("請輸入要移除的書籍標題：");
    var title = Console.ReadLine()?.Trim() ?? "";
    collection.RemoveBook(title);

    Console.WriteLine("\n如果該書存在，則已移除。\n");
}

void HandleFind()
{
    Console.WriteLine("\n依作者尋找書籍\n");

    Console.Write("作者姓名：");
    var author = Console.ReadLine()?.Trim() ?? "";
    var books = collection.FindByAuthor(author);

    ShowBooks(books);
}

void ShowHelp()
{
    Console.WriteLine("""

    圖書收藏協助工具

    指令：
      list     - 顯示所有書籍
      add      - 新增一本書
      remove   - 依標題移除書籍
      find     - 依作者尋找書籍
      help     - 顯示此說明訊息
    """);
}

if (args.Length == 0)
{
    ShowHelp();
    return;
}

var command = args[0].ToLower();

switch (command)
{
    case "list":
        HandleList();
        break;
    case "add":
        HandleAdd();
        break;
    case "remove":
        HandleRemove();
        break;
    case "find":
        HandleFind();
        break;
    case "help":
        ShowHelp();
        break;
    default:
        Console.WriteLine("不明指令。\n");
        ShowHelp();
        break;
}
