#!/usr/bin/env python3
"""
產生內建文字的章節標頭圖片。
使用方式：python .github/scripts/generate-chapter-headers.py
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

# 設定
CHAPTERS = {
    "00-quick-start": "第 00 章：快速入門",
    "01-setup-and-first-steps": "第 01 章：第一步",
    "02-context-conversations": "第 02 章：情境與對話",
    "03-development-workflows": "第 03 章：開發流程",
    "04-agents-custom-instructions": "第 04 章：代理與自訂指令",
    "05-skills": "第 05 章：技能系統",
    "06-mcp-servers": "第 06 章：MCP 伺服器",
    "07-putting-it-together": "第 07 章：綜合運用",
}

# 取得專案根目錄 (scripts 資料夾的父目錄)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
BACKGROUND_IMAGE = os.path.join(PROJECT_ROOT, "images", "chapter-header-bg.png")

# 字型設定 - 比原始的 36px 大 25%
FONT_SIZE = 45
RIGHT_PADDING = 30


def find_font():
    """尋找適合的系統字型。"""
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNSMono.ttf",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",  # Linux
        "C:\\Windows\\Fonts\\arial.ttf",  # Windows
    ]

    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, FONT_SIZE)
            except Exception:
                continue

    print("警告：使用預設字型 (看起來可能會有所不同)")
    return ImageFont.load_default()


def generate_header(chapter_folder, title, font):
    """產生章節的標頭圖片。"""
    # 載入背景
    bg = Image.open(BACKGROUND_IMAGE)
    bg = bg.convert("RGB")
    draw = ImageDraw.Draw(bg)

    width, height = bg.size

    # 最小 x 位置以避免與 copilot 標誌重疊 (標誌寬度約 320px)
    MIN_X_POSITION = 350

    # 計算完整標題的文字寬度
    bbox = draw.textbbox((0, 0), title, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = width - text_width - RIGHT_PADDING

    # 檢查文字是否會與標誌重疊
    if x < MIN_X_POSITION:
        # 需要換行 - 在冒號處分割
        if ": " in title:
            line1, line2 = title.split(": ", 1)
            line1 = line1 + ":"
        else:
            # 備用方案：在中間空格處分割
            words = title.split()
            mid = len(words) // 2
            line1 = " ".join(words[:mid])
            line2 = " ".join(words[mid:])

        # 計算兩行的尺寸
        bbox1 = draw.textbbox((0, 0), line1, font=font)
        bbox2 = draw.textbbox((0, 0), line2, font=font)

        line1_width = bbox1[2] - bbox1[0]
        line2_width = bbox2[2] - bbox2[0]
        line_height = bbox1[3] - bbox1[1]

        # 行間距
        line_gap = 5
        total_height = line_height * 2 + line_gap

        # 向右對齊兩行
        x1 = width - line1_width - RIGHT_PADDING
        x2 = width - line2_width - RIGHT_PADDING

        # 垂直居中兩行
        y1 = (height - total_height) // 2
        y2 = y1 + line_height + line_gap

        # 繪製兩行
        draw.text((x1, y1), line1, fill=(255, 255, 255), font=font)
        draw.text((x2, y2), line2, fill=(255, 255, 255), font=font)
    else:
        # 單行 - 大小合適
        y = (height - text_height) // 2
        draw.text((x, y), title, fill=(255, 255, 255), font=font)

    # 儲存到章節的 images 資料夾
    output_dir = os.path.join(PROJECT_ROOT, chapter_folder, "images")
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, "chapter-header.png")
    bg.save(output_path)

    return output_path


def main():
    print("正在產生章節標頭...")
    print(f"背景：{BACKGROUND_IMAGE}")
    print(f"字型大小：{FONT_SIZE}px")
    print()

    if not os.path.exists(BACKGROUND_IMAGE):
        print(f"錯誤：找不到背景圖片：{BACKGROUND_IMAGE}")
        sys.exit(1)

    font = find_font()

    for chapter_folder, title in CHAPTERS.items():
        chapter_path = os.path.join(PROJECT_ROOT, chapter_folder)
        if not os.path.exists(chapter_path):
            print(f"  正在跳過 {chapter_folder} (找不到資料夾)")
            continue

        output_path = generate_header(chapter_folder, title, font)
        print(f"  {title}")
        print(f"    -> {os.path.relpath(output_path, PROJECT_ROOT)}")

    print()
    print("完成！已為所有章節產生標頭。")


if __name__ == "__main__":
    main()
