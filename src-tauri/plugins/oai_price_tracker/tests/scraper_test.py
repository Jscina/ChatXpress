import pytest
from bs4 import BeautifulSoup
from oai_price_tracker.main import clean_page, process_table, fetch_pricing_page


@pytest.fixture
def pricing_page() -> BeautifulSoup:
    page = fetch_pricing_page()
    return page


def test_scrape_pricing_page(pricing_page: BeautifulSoup):
    """Test that the pricing page is scraped correctly
    Only the first table is tested since they all have the same structure"""
    model_tables = clean_page(pricing_page)
    process_table(model_tables[0])
    assert process_table(model_tables[0]) == {
        "gpt-4": {"input_price": 0.03, "output_price": 0.06},
        "gpt-4-32k": {"input_price": 0.06, "output_price": 0.12},
    }
