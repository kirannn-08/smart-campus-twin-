# Roadmap: Smart Campus Energy Management System

## Overview

The journey begins with a "Simulation-First" approach, building a high-fidelity virtual campus energy ecosystem to unblock AI and UI development. We then transition into implementing the "Intelligence Engine" (Forecasting and Anomalies) and "Optimization Logic" (Hybrid Control). Finally, we bridge the gap to the physical world by integrating ESP32-based hardware sensors, transforming the virtual prototype into a functional IoT digital twin.

## Phases

- [ ] **Phase 1: Simulation Engine** - Create a realistic synthetic data generator for campus energy.
- [ ] **Phase 2: Real-time Data Bridge** - Implement streaming and storage for live/historical metrics.
- [ ] **Phase 3: Immersive Landing Page** - Build the 3D visual introduction to the digital twin.
- [ ] **Phase 4: Digital Twin Dashboard** - Develop the core monitoring interface with 3D spatial context.
- [ ] **Phase 5: Forecasting Intelligence** - Implement Transformer-based (TFT) energy demand prediction.
- [ ] **Phase 6: Anomaly Detection** - Integrate deep learning models for proactive fault detection.
- [ ] **Phase 7: Hybrid Energy Controller** - Build the logic for automated solar/grid balancing.
- [ ] **Phase 8: Dynamic Allocation** - Implement priority-based energy distribution across rooms.
- [ ] **Phase 9: Edge Node Firmware** - Develop ESP32 code for physical electrical monitoring.
- [ ] **Phase 10: Hardware Integration** - Bridge physical sensors to the digital twin system.

## Phase Details

### Phase 1: Simulation Engine
**Goal**: Establish a reliable foundation of synthetic energy data.
**Depends on**: Nothing
**Requirements**: SIM-01
**Success Criteria**:
  1. System generates continuous time-series data for solar, grid, and 5+ rooms.
  2. Data reflects realistic diurnal cycles and occupancy fluctuations.
**Plans**: TBD

### Phase 2: Real-time Data Bridge
**Goal**: Enable live data accessibility and historical analysis.
**Depends on**: Phase 1
**Requirements**: SIM-02, SIM-03
**Success Criteria**:
  1. Frontend receives live data updates every second via WebSocket/MQTT.
  2. Historical data can be queried and retrieved for the past 24 hours.
**Plans**: TBD

### Phase 3: Immersive Landing Page
**Goal**: Communicate project vision through interactive 3D visualization.
**Depends on**: Phase 2
**Requirements**: VIS-01
**Success Criteria**:
  1. User can scroll through an animated 3D campus model explaining energy flow.
  2. Interactive elements react to scroll position with smooth transitions.
**Plans**: TBD

### Phase 4: Digital Twin Dashboard
**Goal**: Provide real-time spatial monitoring of the campus energy ecosystem.
**Depends on**: Phase 3
**Requirements**: VIS-02, VIS-03
**Success Criteria**:
  1. User can view a 3D campus layout with real-time energy flow lines.
  2. Selecting a room displays its specific consumption metrics and trend charts.
**Plans**: TBD

### Phase 5: Forecasting Intelligence
**Goal**: Predict future energy demand to enable proactive management.
**Depends on**: Phase 4
**Requirements**: ML-01
**Success Criteria**:
  1. System provides a 24-hour forecast of campus energy demand with <15% error.
  2. Forecast updates hourly based on the latest 48 hours of historical data.
**Plans**: TBD

### Phase 6: Anomaly Detection
**Goal**: Proactively identify unusual consumption patterns or faults.
**Depends on**: Phase 5
**Requirements**: ML-02
**Success Criteria**:
  1. System triggers an alert when a "phantom load" is simulated.
  2. Anomaly history is visible on the dashboard with timestamps and severity.
**Plans**: TBD

### Phase 7: Hybrid Energy Controller
**Goal**: Automatically optimize the balance between renewable and grid power.
**Depends on**: Phase 6
**Requirements**: CTRL-01
**Success Criteria**:
  1. System automatically switches to grid power when simulated solar falls below demand.
  2. Real-time "Renewable %" metric correctly reflects the source balance.
**Plans**: TBD

### Phase 8: Dynamic Allocation
**Goal**: Intelligently distribute available energy based on priority.
**Depends on**: Phase 7
**Requirements**: CTRL-02
**Success Criteria**:
  1. High-priority rooms (e.g., Labs) maintain power during simulated "Low Solar" events.
  2. User can adjust room priorities via the dashboard and see immediate allocation changes.
**Plans**: TBD

### Phase 9: Edge Node Firmware
**Goal**: Enable physical devices to measure and report electrical parameters.
**Depends on**: Phase 8
**Requirements**: HW-01
**Success Criteria**:
  1. ESP32 reads voltage and current from physical sensors with ±5% accuracy.
  2. Sensor readings are outputted in a structured JSON format.
**Plans**: TBD

### Phase 10: Hardware Integration
**Goal**: Close the loop between the physical world and the digital twin.
**Depends on**: Phase 9
**Requirements**: HW-02
**Success Criteria**:
  1. Dashboard updates its "Digital Twin" state using data from physical ESP32 nodes.
  2. System successfully bridges real-world sensor data to the ML forecasting engine.
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Simulation Engine | 1/1 | Completed | 2026-03-12 |
| 2. Data Bridge | 0/1 | Not started | - |
| 3. Landing Page | 0/1 | Not started | - |
| 4. Dashboard | 0/1 | Not started | - |
| 5. Forecasting | 0/1 | Not started | - |
| 6. Anomalies | 0/1 | Not started | - |
| 7. Controller | 0/1 | Not started | - |
| 8. Allocation | 0/1 | Not started | - |
| 9. Firmware | 0/1 | Not started | - |
| 10. Hardware Int. | 0/1 | Not started | - |
