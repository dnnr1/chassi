<p align="center">
  <img
    src="https://github.com/dnnr1/chassi/blob/master/assets/images/chassi.png?raw=true"
    width="700"
    alt="VIN Decoder"
  />
</p>

# chassi

Offline VIN decoder library.

## Installation

```bash
npm install chassi
```

## Usage

### Library

```typescript
import { decodeVin, validateVin } from "chassi";

decodeVin("WVWZZZ3CZWE123456");
// {
//   vin: 'WVWZZZ3CZWE123456',
//   valid: true,
//   manufacturer: 'Volkswagen',
//   country: 'Germany',
//   countryCode: 'DE',
//   year: 2014,
//   possibleYears: [1984, 2014],
//   model: 'Golf',
//   confidence: 1,
//   disclaimer: '...'
// }

validateVin("WVWZZZ3CZWE123456");
// {
//   valid: true,
//   vin: 'WVWZZZ3CZWE123456',
//   normalizedVin: 'WVWZZZ3CZWE123456',
//   errors: [],
//   details: {
//     lengthValid: true,
//     charactersValid: true,
//     checkDigitValid: true,
//     providedCheckDigit: 'Z',
//     calculatedCheckDigit: 'Z'
//   }
// }
```

### CLI

```bash
npx chassi decode WVWZZZ3CZWE123456

# === VIN Decode Result ===
#
# VIN:          WVWZZZ3CZWE123456
# Valid:        Yes
# Manufacturer: Volkswagen
# Country:      Germany
# Year:         2014
# Model:        Golf
# Confidence:   100%
#
# Components:
#   WMI:        WVW
#   VDS:        ZZZ3CZ
#   VIS:        WE123456
#   Year Code:  W
#   Plant Code: E
#   Sequential: 123456
```

```bash
npx chassi validate WVWZZZ3CZWE123456

# === VIN Validation Result ===
#
# VIN:           WVWZZZ3CZWE123456
# Valid:         Yes
# Length OK:     Yes
# Characters OK: Yes
# Check Digit:   Valid
```

```bash
npx chassi check 1HGBH41JXMN109186

# === Check Digit Verification ===
#
# VIN:        1HGBH41JXMN109186
# Provided:   X
# Calculated: X
# Applicable: Yes (North American)
# Valid:      Yes
```

#### CLI Fields

| Field         | Command               | Description                                                                               |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| VIN           | all                   | The normalized (uppercase) VIN                                                            |
| Valid         | decode/validate/check | Whether the VIN passes all applicable validations                                         |
| Manufacturer  | decode                | Manufacturer name or "Unknown"                                                            |
| Country       | decode                | Country of origin or "Unknown"                                                            |
| Year          | decode                | Most likely model year or "Unknown"                                                       |
| Model         | decode                | Inferred model or "Unknown"                                                               |
| Confidence    | decode                | How much data was matched (0-100%)                                                        |
| Length OK     | validate              | Whether the VIN has exactly 17 characters                                                 |
| Characters OK | validate              | Whether all characters are valid (no I, O, Q, or special chars)                           |
| Check Digit   | validate              | Whether the check digit at position 9 is correct                                          |
| Provided      | check                 | The character at position 9 of the VIN                                                    |
| Calculated    | check                 | The expected check digit per ISO 3779 weighted sum mod 11                                 |
| Applicable    | check                 | Whether check digit validation applies — only North American VINs (US, CA, MX) require it |

## VIN Structure

| Position | Name  | Description                   |
| -------- | ----- | ----------------------------- |
| 1-3      | WMI   | World Manufacturer Identifier |
| 4-9      | VDS   | Vehicle Descriptor Section    |
| 9        | Check | Check digit (ISO 3779)        |
| 10       | Year  | Model year code               |
| 11       | Plant | Assembly plant                |
| 12-17    | Seq   | Sequential number             |

## API Reference

### `decodeVin(vin, options?)`

Returns decoded vehicle information from the VIN.

| Field           | Type       | Description                                                                     |
| --------------- | ---------- | ------------------------------------------------------------------------------- |
| `vin`           | `string`   | The original VIN provided                                                       |
| `valid`         | `boolean`  | Whether the VIN passes all applicable validations (structure + check digit)     |
| `manufacturer`  | `string?`  | Manufacturer name (e.g. `"Volkswagen"`)                                         |
| `country`       | `string?`  | Country of origin (e.g. `"Germany"`)                                            |
| `countryCode`   | `string?`  | ISO country code (e.g. `"DE"`)                                                  |
| `year`          | `number?`  | Most likely model year                                                          |
| `possibleYears` | `number[]` | All possible model years (year codes cycle every 30 years)                      |
| `model`         | `string?`  | Inferred model name, if a known VDS pattern matches                             |
| `confidence`    | `number`   | Confidence score from `0` to `1` based on how much data was matched             |
| `components`    | `object?`  | VIN components (WMI, VDS, VIS, etc.). Only present if `includeComponents: true` |
| `disclaimer`    | `string`   | Legal disclaimer about the inferred data                                        |

**Options:**

| Option              | Type      | Default | Description                                        |
| ------------------- | --------- | ------- | -------------------------------------------------- |
| `strict`            | `boolean` | `false` | Reject VINs with invalid check digit (even non-NA) |
| `includeComponents` | `boolean` | `false` | Include parsed VIN components in the result        |

### `validateVin(vin, options?)`

Returns detailed validation results for a VIN.

| Field                          | Type      | Description                                                 |
| ------------------------------ | --------- | ----------------------------------------------------------- |
| `valid`                        | `boolean` | Whether the VIN passes all applicable validations           |
| `vin`                          | `string`  | The original VIN provided                                   |
| `normalizedVin`                | `string`  | Uppercase, stripped of spaces and dashes                    |
| `errors`                       | `array`   | List of validation errors (see below)                       |
| `details.lengthValid`          | `boolean` | Whether the VIN has exactly 17 characters                   |
| `details.charactersValid`      | `boolean` | Whether all characters are valid (A-H, J-N, P, R-Z, 0-9)    |
| `details.checkDigitValid`      | `boolean` | Whether the check digit (position 9) is correct             |
| `details.checkDigitApplicable` | `boolean` | Whether check digit validation applies to this VIN's region |
| `details.providedCheckDigit`   | `string?` | The check digit character found at position 9               |
| `details.calculatedCheckDigit` | `string?` | The expected check digit calculated via ISO 3779            |

**Options:**

| Option             | Type      | Default | Description                                               |
| ------------------ | --------- | ------- | --------------------------------------------------------- |
| `strictCheckDigit` | `boolean` | `false` | When `true`, enforces check digit validation for all VINs |

> **Check digit applicability:** North American vehicles (US, CA, MX) require check digit validation per 49 CFR § 565. European and other regions do not use the ISO 3779 check digit system, so the check digit position may contain any valid character. When `checkDigitApplicable` is `false`, the check digit is not validated and `checkDigitValid` is always `true`.

### Error Codes

| Code                  | Description                                       |
| --------------------- | ------------------------------------------------- |
| `VIN_EMPTY`           | No VIN was provided                               |
| `INVALID_LENGTH`      | VIN does not have exactly 17 characters           |
| `FORBIDDEN_CHARACTER` | VIN contains I, O, or Q (not allowed by ISO 3779) |
| `INVALID_CHARACTER`   | VIN contains a character outside A-HJ-NPR-Z0-9    |
| `INVALID_CHECK_DIGIT` | Check digit at position 9 does not match expected |

## Data Sources

### Standards

| Standard                                                                            | Description                   |
| ----------------------------------------------------------------------------------- | ----------------------------- |
| [ISO 3779:2009](https://www.iso.org/standard/52200.html)                            | VIN content and structure     |
| [ISO 3780:2009](https://www.iso.org/standard/52199.html)                            | WMI code assignment           |
| [SAE J853](https://www.sae.org/standards/content/j853_201511/)                      | VIN systems specification     |
| [49 CFR § 565](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-V/part-565) | U.S. federal VIN requirements |

### Databases

| Source                                            | Usage                             |
| ------------------------------------------------- | --------------------------------- |
| [NHTSA vPIC](https://vpic.nhtsa.dot.gov/decoder/) | WMI validation, manufacturer data |

### Notes

- **WMI codes**: Assigned by SAE International under ISO 3780
- **Model patterns**: Community-sourced from observed VINs (not official)
- **Year codes**: Defined by ISO 3779, cycle every 30 years

> ⚠️ Model inference is approximate. Always verify with official sources for critical applications.
