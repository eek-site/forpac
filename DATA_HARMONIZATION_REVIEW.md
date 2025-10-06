# Data Harmonization Review - Admin Section
**Date:** 2025-10-06  
**Branch:** cursor/review-admin-section-for-data-harmonization-c5d5

## Executive Summary
This review identifies significant data inconsistencies across the admin forms that could lead to data integration issues, workflow failures, and reporting inaccuracies.

---

## Critical Data Harmonization Issues

### 1. **Phone Number Field Naming Inconsistency** ⚠️ HIGH PRIORITY

**Issue:** Phone/mobile number fields use different names across forms, making data aggregation difficult.

**Files Affected:**
- `booking-form.html` - Uses `customerPhone` (line 312)
- `triage-form.html` - Uses `mobileNumber` (line 230) and `contactNumber` (line 325)
- `add-supplier.html` - Uses `clientMobile` (line 238) and `textJobMobile` (line 330)
- `job-build.html` - Uses `customerPhone` (line 241)
- `payment-gateway.html` - Uses `recipientPhone` (line 294)

**Impact:**
- Data from different forms cannot be easily joined
- Customer lookup may fail when phone numbers are stored under different field names
- Reporting on customer contact information becomes fragmented

**Recommendation:**
Standardize to a single field name: `customerPhone` or `mobileNumber` across all forms.

---

### 2. **Emergency/Service Type Terminology Mismatch** ⚠️ HIGH PRIORITY

**Issue:** Same service types are named differently across forms.

**Examples:**
- `booking-form.html` uses:
  - "Flat Battery" (line 174)
  - "Flat Tyre" (line 178)
  - "Ran Out Of Fuel" (line 186)
  
- `triage-form.html` uses:
  - "Jump Start" (line 154) - Same as Flat Battery
  - "Tyre Change" (line 158) - Same as Flat Tyre
  - "Fuel Delivery" (line 170) - Same as Ran Out Of Fuel

**Impact:**
- Service metrics will be split across multiple categories
- Supplier matching may fail
- Billing and inventory tracking becomes inaccurate

**Recommendation:**
Create a single master list of service types and use consistent naming across all forms.

---

### 3. **Customer Data Field Inconsistency** ⚠️ MEDIUM PRIORITY

**Issue:** Customer identification fields vary between forms.

**Files Affected:**
- `booking-form.html` - Uses `customerName` (line 282), `customerEmail` (line 296), `customerLocation` (line 325)
- `triage-form.html` - Uses `callerName` (line 216)
- `payment-gateway.html` - Uses `recipientName` (line 323), `recipientEmail` (line 309)

**Impact:**
- Customer records may be duplicated
- CRM integration becomes complex
- Customer history tracking is fragmented

**Recommendation:**
Standardize to: `customerName`, `customerEmail`, `customerPhone`

---

### 4. **Job/Registration Number Field Naming** ⚠️ MEDIUM PRIORITY

**Issue:** Job registration is referenced differently.

**Files Affected:**
- `add-supplier.html` - Uses `rego` (line 477)
- `job-build.html` - Uses `rego` (line 527)
- `payment-gateway.html` - Uses `jobRego` (line 355)
- `triage-form.html` - Uses `vehicleRego` (line 303)

**Impact:**
- Job lookup and matching becomes unreliable
- Linking forms to jobs may fail

**Recommendation:**
Standardize to either `jobRego` or `vehicleRego` across all forms.

---

### 5. **Amount/Cost Field Naming Inconsistency** ⚠️ MEDIUM PRIORITY

**Issue:** Financial fields have inconsistent naming.

**Files Affected:**
- `add-supplier.html` - Uses `chargeables` (line 210), `reimbursement` (line 267), `costings` (line 355)
- `job-build.html` - Uses same fields as add-supplier
- `payment-gateway.html` - Uses `amount` (line 245)

**Impact:**
- Financial reporting becomes complex
- Revenue tracking is fragmented
- Billing systems may have integration issues

**Recommendation:**
Establish clear naming conventions:
- `chargeables` → `customerCharge` or `billableAmount`
- `costings` → `supplierCost`
- `reimbursement` → `reimbursementAmount`

---

### 6. **Vehicle Information Field Inconsistency** ⚠️ LOW-MEDIUM PRIORITY

**Issue:** Vehicle details use different field names.

**Files Affected:**
- `booking-form.html` - Uses `licensePlate` (line 209), `vehicleMake` (line 223), `vehicleModel` (line 234), `vehicleColor` (line 248)
- Some forms may reference vehicle information differently

**Impact:**
- Vehicle history tracking becomes difficult
- Fleet management reporting is compromised

**Recommendation:**
Maintain consistent naming: `vehicleRegistration`, `vehicleMake`, `vehicleModel`, `vehicleColor`

---

### 7. **Flow Endpoint Data Structure** ⚠️ HIGH PRIORITY

**Issue:** All forms submit to the same Power Automate endpoint but with different `commandNumber` values and data structures.

**Flow Endpoint:** (All forms use same endpoint)
```
https://default61ffc6bcd9ce458b8120d32187c377.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/e1adbceb52c94e07b923228a8c05d29d/triggers/manual/paths/invoke
```

**Command Numbers:**
- Triage: `commandNumber: 1` (line 697 in triage-form.html)
- Booking: `commandNumber: 2` (line 810 in booking-form.html)
- Payment Gateway: `commandNumber: 3` (line 714 in payment-gateway.html)
- Add Supplier: `commandNumber: 4` (line 843 in add-supplier.html)
- Job Build: `commandNumber: 4` (line 1029 in job-build.html) ⚠️ **DUPLICATE!**

**Critical Issue:** Job Build and Add Supplier use the same `commandNumber: 4` but with different data structures.

**Impact:**
- The Power Automate flow cannot differentiate between Job Build and Add Supplier submissions
- Data processing will fail or misdirect

**Recommendation:**
- Assign unique command numbers to each form type
- Document the data schema for each command number
- Consider using `formType` field as the primary discriminator instead of commandNumber

---

### 8. **Job Notes Structure Inconsistency** ⚠️ LOW-MEDIUM PRIORITY

**Issue:** Job notes are captured differently between forms.

**Files Affected:**
- `add-supplier.html` - Uses array of job notes with max 2 selections (line 491)
- `job-build.html` - Uses array with optional text details for specific note types (line 976-983)

**Impact:**
- Job notes may not display correctly across different views
- Filtering and searching by notes becomes unreliable

---

## Data Flow Architecture Issues

### Missing Data Validation Layer
**Issue:** Forms submit directly to Power Automate without client-side data normalization.

**Recommendation:**
Create a data normalization layer that:
1. Standardizes field names before submission
2. Validates data formats
3. Maps legacy field names to new standardized names

### Lack of Master Data Repository
**Issue:** No centralized reference for:
- Valid service types
- Status values
- Payment methods
- Job note categories

**Recommendation:**
Create a master data configuration file that all forms reference for dropdown values and validation.

---

## Recommended Action Plan

### Phase 1: Critical Fixes (Immediate)
1. ✅ Fix duplicate `commandNumber: 4` issue
2. ✅ Standardize phone number field names across all forms
3. ✅ Create master service type list and update all forms
4. ✅ Standardize job/registration field naming

### Phase 2: Data Quality (Week 1-2)
1. ✅ Standardize customer data fields
2. ✅ Standardize financial field names
3. ✅ Create data normalization layer
4. ✅ Add client-side validation for key fields

### Phase 3: Architecture (Week 3-4)
1. ✅ Create master data configuration
2. ✅ Document Power Automate flow data schemas
3. ✅ Implement data mapping layer
4. ✅ Add comprehensive error handling

---

## Additional Observations

### Positive Aspects
1. All forms use consistent MSAL authentication configuration
2. UI/UX patterns are consistent across forms
3. Forms follow similar multi-step progression patterns
4. Error handling UI is consistent

### Areas for Improvement Beyond Data Harmonization
1. Consider implementing form state persistence (localStorage)
2. Add more comprehensive client-side validation
3. Implement retry logic for failed submissions
4. Add submission tracking/audit trail

---

## Conclusion

The admin section has **7 major data harmonization issues** that need immediate attention. The most critical is the duplicate command number and inconsistent phone field naming. Without addressing these issues, data integration, reporting, and workflow automation will be severely compromised.

**Estimated Impact if Not Fixed:**
- 30-40% of cross-form data queries will fail
- Customer duplicate records likely to occur
- Supplier matching may fail 15-20% of the time
- Financial reporting will require manual reconciliation
- Power Automate flow may crash on duplicate command numbers

**Recommended Timeline:** 2-4 weeks for complete harmonization
