# chassi

Offline VIN decoder for Brazilian vehicles.

## Installation

```bash
npm install chassi
```

## Usage

### Library

```typescript
import { decodeVin, validateVin } from "chassi";

decodeVin("9BWZZZ377VT004251");
// {
//   vin: '9BWZZZ377VT004251',
//   valid: true,
//   manufacturer: 'Volkswagen',
//   country: 'Brasil',
//   countryCode: 'BR',
//   year: 1997,
//   possibleYears: [1997],
//   model: 'Gol',
//   confidence: 1,
//   disclaimer: '...'
// }

validateVin("9BWZZZ377VT004251");
// {
//   valid: true,
//   vin: '9BWZZZ377VT004251',
//   normalizedVin: '9BWZZZ377VT004251',
//   errors: [],
//   details: {
//     lengthValid: true,
//     charactersValid: true,
//     checkDigitValid: true,
//     providedCheckDigit: '7',
//     calculatedCheckDigit: '7'
//   }
// }
```

### CLI

```bash
npx chassi decode 9BWZZZ377VT004251

# === VIN Decode Result ===
#
# VIN:          9BWZZZ377VT004251
# Valid:        Yes
# Manufacturer: Volkswagen
# Country:      Brasil
# Year:         1997
# Model:        Gol
# Confidence:   100%
#
# Components:
#   WMI:        9BW
#   VDS:        ZZZ377
#   VIS:        VT004251
```

```bash
npx chassi validate 9BWZZZ377VT004251

# === VIN Validation Result ===
#
# VIN:           9BWZZZ377VT004251
# Valid:         Yes
# Length:        Valid (17 characters)
# Characters:    Valid
# Check Digit:   Valid (7)
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

- ISO 3779 standard
- Brazilian DENATRAN
- Manufacturer documentation
