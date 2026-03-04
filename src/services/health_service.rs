use crate::models::health::HealthStatus;

pub fn build_health_status() -> HealthStatus {
    HealthStatus::ok("u-wind-backend")
}
