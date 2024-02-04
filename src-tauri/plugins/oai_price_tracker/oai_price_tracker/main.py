import requests
import re
from bs4 import BeautifulSoup
from bs4.element import Tag, Comment
from multiprocessing.pool import ThreadPool

EXTRACT_FLOAT = re.compile(r"\d+\.\d+")

SEARCH_TABLES = ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]


def fetch_pricing_page() -> BeautifulSoup:
    url = "https://openai.com/pricing/"
    response = requests.get(url)
    return BeautifulSoup(response.text, "html.parser")


def clean_page(page: BeautifulSoup) -> list[BeautifulSoup]:
    comments: list[Tag] = page.find_all(string=lambda text: isinstance(text, Comment))
    for comment in comments:
        comment.extract()
    tables = [page.find("div", id=model) for model in SEARCH_TABLES]
    return [
        BeautifulSoup(str(table), "html.parser")
        for table in tables
        if isinstance(table, Tag)
    ]


def process_table(model_table: BeautifulSoup) -> dict:
    table = model_table.find("table")
    table = BeautifulSoup(str(table), "html.parser")
    rows = table.find_all("tr")[1:]

    def transform_row(row: Tag) -> tuple[str, dict[str, float]]:
        cols = row.find_all("td")
        model_name = cols[0].text.strip()
        input_price = (
            cols[1].text.strip()
            + " "
            + cols[1].find(class_="text-secondary").text.strip()
        )
        output_price = (
            cols[2].text.strip()
            + " "
            + cols[2].find(class_="text-secondary").text.strip()
        )
        input_prica_float = EXTRACT_FLOAT.search(input_price)
        output_price_float = EXTRACT_FLOAT.search(output_price)
        if input_prica_float and output_price_float:
            input_price = float(input_prica_float.group(0))
            output_price = float(output_price_float.group(0))
        return model_name, {
            "input_price": input_price,
            "output_price": output_price,
        }

    return {
        model_name: model_prices
        for model_name, model_prices in map(transform_row, rows)
    }


def main() -> dict[str, dict[str, float]]:
    page = fetch_pricing_page()
    model_tables = clean_page(page)

    with ThreadPool(len(SEARCH_TABLES)) as pool:
        res: list[dict[str, dict[str, float]]] = pool.map(process_table, model_tables)

    return {key: value for model in res for key, value in model.items()}


if __name__ == "__main__":
    print(main())
