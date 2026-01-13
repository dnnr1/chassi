# chassi

Offline VIN decoder library for Brazilian vehicles.

## Installation

```bash
npm install chassi
```

## Usage

```typescript
import { decodeVin } from 'chassi';

const result = decodeVin('9BWZZZ377VT004251');
console.log(result);
```

## How It Works

A VIN (Vehicle Identification Number) has 17 characters:

- **WMI (1-3)**: World Manufacturer Identifier
- **VDS (4-9)**: Vehicle Descriptor Section  
- **VIS (10-17)**: Vehicle Identifier Section

### Check Digit

Position 9 contains a check digit calculated using ISO 3779 algorithm.

### Year Codes

Position 10 indicates the model year (A=1980/2010, B=1981/2011, etc.)

## Data Sources

- ISO 3779 standard
- Brazilian DENATRAN data
- Manufacturer documentation
