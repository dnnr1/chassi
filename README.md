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
```

```bash
npx chassi validate 5YJ3E1EA5LF123456

# === VIN Validation Result ===
#
# VIN:           5YJ3E1EA5LF123456
# Valid:         Yes
# Length:        Valid (17 characters)
# Characters:    Valid
# Check Digit:   Valid (5)
```

## VIN Structure

| Position | Name  | Description                   |
| -------- | ----- | ----------------------------- |
| 1-3      | WMI   | World Manufacturer Identifier |
| 4-9      | VDS   | Vehicle Descriptor Section    |
| 9        | Check | Check digit (ISO 3779)        |
| 10       | Year  | Model year code               |
| 11       | Plant | Assembly plant                |
| 12-17    | Seq   | Sequential number             |

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
