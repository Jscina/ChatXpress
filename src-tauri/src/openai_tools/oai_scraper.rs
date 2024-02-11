use regex::Regex;
use reqwest::{get, Error};
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

const SEARCH_TABLES: [&str; 3] = ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"];

#[derive(Serialize, Deserialize)]
pub struct ModelPricing {
    input: f64,
    output: f64,
}

impl ModelPricing {
    pub fn new(input: f64, output: f64) -> Self {
        ModelPricing { input, output }
    }
}

async fn fetch_pricing_page() -> Result<Html, Error> {
    let body = get("https://openai.com/pricing/").await?.text().await?;
    Ok(Html::parse_document(&body))
}

fn process_table(table: scraper::element_ref::ElementRef) -> HashMap<String, HashMap<String, f32>> {
    let mut result = HashMap::new();
    let rows = table
        .select(&Selector::parse("tr").unwrap())
        .collect::<Vec<_>>();
    let re = Regex::new(r"\d+\.\d+").unwrap();

    for row in rows.iter().skip(1) {
        let cols = row
            .select(&Selector::parse("td").unwrap())
            .collect::<Vec<_>>();
        let model_name = cols[0].inner_html().trim().to_string();
        let input_price = re
            .find(&cols[1].inner_html())
            .unwrap()
            .as_str()
            .parse::<f32>()
            .unwrap();
        let output_price = re
            .find(&cols[2].inner_html())
            .unwrap()
            .as_str()
            .parse::<f32>()
            .unwrap();
        let mut prices = HashMap::new();
        prices.insert("input_price".to_string(), input_price);
        prices.insert("output_price".to_string(), output_price);
        result.insert(model_name, prices);
    }

    result
}

pub async fn run_scraper() -> Result<HashMap<String, ModelPricing>, Error> {
    let document = fetch_pricing_page().await?;
    let mut result = HashMap::new();

    for table_id in SEARCH_TABLES.iter() {
        let selector = Selector::parse(&format!("div#{}", table_id)).unwrap();
        let table = document.select(&selector).next().unwrap();
        result.extend(process_table(table));
    }

    let result = result
        .into_iter()
        .map(|(k, v)| {
            (
                k,
                ModelPricing::new(v["input_price"] as f64, v["output_price"] as f64),
            )
        })
        .collect();

    Ok(result)
}
