use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct HealthStatus {
    pub status: &'static str,
    pub service: &'static str,
}

impl HealthStatus {
    pub fn ok(service: &'static str) -> Self {
        Self {
            status: "ok",
            service,
        }
    }
}
