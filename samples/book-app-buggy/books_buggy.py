import json
from dataclasses import dataclass, asdict
from typing import List, Optional

DATA_FILE = "data.json"


@dataclass
class Book:
    title: str
    author: str
    year: int
    read: bool = False


class BookCollection:
    def __init__(self):
        self.books: List[Book] = []
        self.load_books()

    def load_books(self):
        """如果 JSON 檔案存在，則從中載入書籍。"""
        try:
            with open(DATA_FILE, "r") as f:
                data = json.load(f)
                self.books = [Book(**b) for b in data]
        except FileNotFoundError:
            self.books = []
        except json.JSONDecodeError:
            print("警告：data.json 已損壞。以空收藏開始。")
            self.books = []

    def save_books(self):
        """將目前的圖書收藏儲存到 JSON。"""
        # BUG 2: 未處理檔案權限錯誤 - 靜默崩潰
        f = open(DATA_FILE, "w")
        json.dump([asdict(b) for b in self.books], f, indent=2)
        # 缺少 f.close() - 檔案控制碼洩漏

    def add_book(self, title: str, author: str, year: int) -> Book:
        # BUG 3: 年份驗證接受負數和未來年份
        book = Book(title=title, author=author, year=year)
        self.books.append(book)
        self.save_books()
        return book

    def list_books(self) -> List[Book]:
        return self.books

    def find_book_by_title(self, title: str) -> Optional[Book]:
        # BUG 1: 區分大小寫的比較 - "the hobbit" 找不到 "The Hobbit"
        for book in self.books:
            if book.title == title:
                return book
        return None

    def mark_as_read(self, title: str) -> bool:
        # BUG 5: 將所有書籍標記為已讀，而不僅僅是匹配的那本
        book = self.find_book_by_title(title)
        if book:
            for b in self.books:
                b.read = True
            self.save_books()
            return True
        return False

    def remove_book(self, title: str) -> bool:
        """根據標題移除書籍。"""
        # BUG 4: 使用 'in' 檢查 - 移除 "Dune" 也會匹配並移除 "Dune Messiah"
        for book in self.books:
            if title in book.title:
                self.books.remove(book)
                self.save_books()
                return True
        return False

    def find_by_author(self, author: str) -> List[Book]:
        """尋找特定作者的所有書籍。"""
        # BUG 6: 精確匹配而非部分匹配 - "Tolkien" 找不到 "J.R.R. Tolkien"
        return [b for b in self.books if b.author == author]
