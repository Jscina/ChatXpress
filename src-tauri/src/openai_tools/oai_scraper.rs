use pyo3::{prelude::*, types::PyDict};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

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

pub fn run_scraper() -> Result<HashMap<String, ModelPricing>, PyErr> {
    let code: &str = include_str!("../../plugins/oai_price_tracker/oai_price_tracker/main.py");
    Python::with_gil(|py| {
        let module = PyModule::from_code(py, code, "main.py", "oai_price_tracker");
        let res: &PyDict = module?.call_method0("main")?.downcast::<PyDict>()?;

        let mut prices: HashMap<String, ModelPricing> = HashMap::new();
        res.iter().for_each(|(key, value)| {
            let key = key.to_string();
            let value = value.to_string();
            let value: Vec<&str> = value.split(',').collect();
            let input = value[0]
                .chars()
                .filter(|c| c.is_ascii_digit() || c == &'.')
                .collect::<String>()
                .parse::<f64>()
                .unwrap();

            let output = value[1]
                .chars()
                .filter(|c| c.is_ascii_digit() || c == &'.')
                .collect::<String>()
                .parse::<f64>()
                .unwrap();

            prices.insert(key, ModelPricing::new(input, output));
        });
        Ok(prices)
    })
}
