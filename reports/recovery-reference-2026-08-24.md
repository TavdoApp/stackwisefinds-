# StakDock Recovery Reference Report (Period B: Aug 18–24, 2026)

**Report Type**: **`PRE-WAVE-1 REFERENCE DATA`** *(Not a Post-Deployment Recovery Checkpoint)*  
**Data Range**: August 18, 2026 &ndash; August 24, 2026  
**Deployment Boundary**: August 25, 2026 (Wave 1 Live Commit `5ba4954`)  
**Manual Action Status**: **`NOT VERIFIED IN PERFORMANCE EXPORT`**  
**Active Search Footprint**: 841 URLs (P=73, R=740, K=28)  
**Quarantined Footprint**: 3,330 URLs (Q=3,330)

---

## 1. Important Temporal & Causal Context

> [!IMPORTANT]
> **This dataset represents Period B (Post-Crash / Pre-Wave-1 Reference Data).**  
> Because this data was recorded between August 18 and August 24, it occurred **strictly before** the Wave 1 production deployment on August 25, 2026. These metrics represent the collapsed search state and demonstrate pre-Wave-1 organic search resilience. They **must not** be described as recovery caused by Wave 1. True post-deployment recovery measurement will begin with GSC data from August 26 onwards.

---

## 2. Data Integrity & Reconciliation Summary

- **Chart.csv Total (Aug 17–24)**: 4,309 impressions | 6 clicks
  - *Aug 17 Transition Day*: 3,207 impressions | 5 clicks
  - *Aug 18–24 Clean Post-Crash Window (7 days)*: **1,102 impressions | 1 click**
- **Pages.csv Total (Aug 17–24)**: **4,241 impressions | 6 clicks**
- **Reconciliation Diagnosis**: The previous report noted 1,102 impressions for the 7-day clean chart while reporting 4,241 impressions from Pages.csv. Pages.csv contains the entire 8-day export window (including Aug 17). Both numbers reconcile accurately once the Aug 17 transition day is accounted for.
- **Export Row Cap Guard**: Pages.csv and Queries.csv contain exactly 1,000 rows. The true domain query breadth and page breadth are **&ge; 1,000** (limited by the GSC UI export cap).

---

## 3. Period B Performance Reference vs. Historical Baseline

| Metric | Period A: Pre-Crash Baseline (Aug 2–16) | Period B: Post-Crash Reference (Aug 18–24) | Delta vs. Pre-Crash |
| :--- | :--- | :--- | :--- |
| **Daily Impressions** | **2,503 / day** | **157 / day** | -93.7% |
| **Daily Clicks** | **6.1 / day** | **0.1 / day** | -98.4% |
| **Average CTR** | **0.25%** | **0.09%** | -0.16% |
| **Average Position** | **55.4** | **42.6** | +12.8 ranks (higher avg rank across remaining queries) |
| **Query Breadth** | **≥ 1,004 queries** | **≥ 1,000 queries** *(Export cap reached)* | — |
| **Page Breadth** | **≥ 1,000 pages** | **≥ 1,000 pages** *(Export cap reached)* | — |
| **Collapsed Period Ratio** | **100.0%** | **6.27%** | — |

---

## 4. Wave 1 Historical Reference Metrics (Pre-Wave-1 Performance)

*These figures record the pre-deployment baseline resilience of the 7 URLs prior to their Phase 3B quality upgrades:*

| URL | Cluster | Period B Imps (8-Day Export) | Period B Avg Pos | Clicks | Strongest Pre-Wave-1 Query (Rank) | Baseline Context |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| `/alternatives/invoice-ninja/` | Invoicing & Billing | **451** | **6.5** | 0 | "invoice ninja review" (56.0) | Historical Post-Crash Reference (Pre-Wave-1 Deployment) |
| `/software/microsoft-power-automate/` | Workflow Automation | **149** | **49.6** | 0 | "power automate" (48.8) | Historical Post-Crash Reference (Pre-Wave-1 Deployment) |
| `/software/all-in-one-seo-aioseo/` | SEO Software | **9** | **51.6** | 0 | "aioseo" (52.0) | Historical Post-Crash Reference (Pre-Wave-1 Deployment) |
| `/software/screaming-frog-seo-spider/` | SEO Software | **48** | **71.1** | 0 | "se ranking vs screaming frog" (53.8) | Historical Post-Crash Reference (Pre-Wave-1 Deployment) |
| `/vs/moz-pro-vs-se-ranking/` | SEO Software | **25** | **56.7** | 0 | "moz pro vs se ranking" (52.8) | Historical Post-Crash Reference (Pre-Wave-1 Deployment) |
| `/vs/screaming-frog-seo-spider-vs-se-ranking/` | SEO Software | **19** | **55.5** | 0 | "screaming frog vs se ranking" (55.5) | Historical Post-Crash Reference (Pre-Wave-1 Deployment) |
| `/best/invoicing/` | Invoicing & Billing | **109** | **78.2** | 0 | "invoicing software" (74.5) | Historical Post-Crash Reference (Pre-Wave-1 Deployment) |

---

## 5. Frozen Wave 2 Candidates (Observation Only)

*Preserved for future evaluation. DO NOT IMPLEMENT.*

| Rank | Candidate URL | State | Type | Cluster | Pre-Crash Opp | Period B Imps (Pos) | Commercial Intent |
| :-: | :--- | :-: | :--- | :--- | :--- | :---: | :--- |
| 1 | `/vs/aws-vs-google-cloud/` | `P` | `vs` | Developer & Cloud Infrastructure | 135 impressions, 1 clicks (avg pos 77.4) | 24 (77.2) | High Commercial Intent (Buyer Comparison) |
| 2 | `/alternatives/homarr-dashboard/` | `P` | `alternatives` | Developer & Cloud Infrastructure | 72 impressions, 1 clicks (avg pos 10.2) | 11 (16.3) | High Commercial Intent (Buyer Comparison) |
| 3 | `/alternatives/databox/` | `P` | `alternatives` | Developer & Cloud Infrastructure | 175 impressions, 1 clicks (avg pos 70.3) | 7 (73.0) | High Commercial Intent (Buyer Comparison) |
| 4 | `/software/security-onion/` | `P` | `software` | Developer & Cloud Infrastructure | 47 impressions, 1 clicks (avg pos 40.4) | 6 (37.8) | Commercial Evaluation Intent |
| 5 | `/alternatives/albacross/` | `P` | `alternatives` | Developer & Cloud Infrastructure | 76 impressions, 1 clicks (avg pos 45.6) | 5 (45.2) | High Commercial Intent (Buyer Comparison) |
| 6 | `/alternatives/apache-guacamole/` | `P` | `alternatives` | Developer & Cloud Infrastructure | 41 impressions, 1 clicks (avg pos 21.1) | 5 (56.4) | High Commercial Intent (Buyer Comparison) |
| 7 | `/software/authy/` | `P` | `software` | Developer & Cloud Infrastructure | 65 impressions, 1 clicks (avg pos 45.1) | 4 (57.3) | Commercial Evaluation Intent |
| 8 | `/alternatives/audiobookshelf/` | `P` | `alternatives` | Developer & Cloud Infrastructure | 34 impressions, 1 clicks (avg pos 27.8) | 3 (21.7) | High Commercial Intent (Buyer Comparison) |
| 9 | `/alternatives/opensearch/` | `P` | `alternatives` | Developer & Cloud Infrastructure | 32 impressions, 1 clicks (avg pos 46.4) | 1 (73.0) | High Commercial Intent (Buyer Comparison) |
| 10 | `/software/hetzner/` | `P` | `software` | Developer & Cloud Infrastructure | 55 impressions, 1 clicks (avg pos 47.5) | 0 (N/A) | Commercial Evaluation Intent |
| 11 | `/alternatives/rank-math/` | `P` | `alternatives` | SEO Software | 36 impressions, 1 clicks (avg pos 68.0) | 0 (N/A) | High Commercial Intent (Buyer Comparison) |
| 12 | `/software/vultr/` | `P` | `software` | Developer & Cloud Infrastructure | 34 impressions, 1 clicks (avg pos 47.2) | 0 (N/A) | Commercial Evaluation Intent |

---

## 6. Checkpoint Protocol & Next Action

- **Status**: **`WAIT FOR FRESH POST-DEPLOYMENT GSC DATA`**
- **Action**: Await GSC performance data covering **August 26, 2026 onwards** (representing the actual post-deployment window).
- **Rule**: Do not modify production code, URLs, or metadata during this holding period.
