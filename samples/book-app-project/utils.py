def print_menu():
    print("\n📚 圖書收藏應用程式")
    print("1. 新增一本書")
    print("2. 列出書籍")
    print("3. 將書籍標記為已讀")
    print("4. 移除一本書")
    print("5. 結束")


def get_user_choice() -> str:
    return input("選擇一個選項 (1-5)：").strip()


def get_book_details():
    title = input("輸入書籍標題：").strip()
    author = input("輸入作者：").strip()

    year_input = input("輸入出版年份：").strip()
    try:
        year = int(year_input)
    except ValueError:
        print("無效的年份。預設為 0。")
        year = 0

    return title, author, year


def print_books(books):
    if not books:
        print("您的收藏中沒有書籍。")
        return

    print("\n您的書籍：")
    for index, book in enumerate(books, start=1):
        status = "✅ 已讀" if book.read else "📖 未讀"
        print(f"{index}. {book.title} by {book.author} ({book.year}) - {status}")
