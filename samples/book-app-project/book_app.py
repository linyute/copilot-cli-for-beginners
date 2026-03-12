import sys
from books import BookCollection


# 全域收藏實例
collection = BookCollection()


def show_books(books):
    """以使用者友好的格式顯示書籍。"""
    if not books:
        print("未找到書籍。")
        return

    print("\n您的圖書收藏：\n")

    for index, book in enumerate(books, start=1):
        status = "✓" if book.read else " "
        print(f"{index}. [{status}] {book.title} by {book.author} ({book.year})")

    print()


def handle_list():
    books = collection.list_books()
    show_books(books)


def handle_add():
    print("\n新增新書\n")

    title = input("標題：").strip()
    author = input("作者：").strip()
    year_str = input("年份：").strip()

    try:
        year = int(year_str) if year_str else 0
        collection.add_book(title, author, year)
        print("\n書籍新增成功。\n")
    except ValueError as e:
        print(f"\n錯誤：{e}\n")


def handle_remove():
    print("\n移除書籍\n")

    title = input("請輸入要移除的書籍標題：").strip()
    collection.remove_book(title)

    print("\n如果該書存在，則已移除。\n")


def handle_find():
    print("\n依作者尋找書籍\n")

    author = input("作者姓名：").strip()
    books = collection.find_by_author(author)

    show_books(books)


def show_help():
    print("""
圖書收藏協助工具

指令：
  list     - 顯示所有書籍
  add      - 新增一本書
  remove   - 依標題移除書籍
  find     - 依作者尋找書籍
  help     - 顯示此說明訊息
""")


def main():
    if len(sys.argv) < 2:
        show_help()
        return

    command = sys.argv[1].lower()

    if command == "list":
        handle_list()
    elif command == "add":
        handle_add()
    elif command == "remove":
        handle_remove()
    elif command == "find":
        handle_find()
    elif command == "help":
        show_help()
    else:
        print("未知指令。\n")
        show_help()


if __name__ == "__main__":
    main()
