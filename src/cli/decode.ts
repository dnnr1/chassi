#!/usr/bin/env node
import { decodeVin } from '../decoder/decode';
import { validateVin } from '../core/validateVin';
import { parseVin } from '../core/parseVin';
import { verifyCheckDigit, calculateCheckDigit } from '../core/checkDigit';

const args = process.argv.slice(2);
const command = args[0];
const vin = args[1];

function showHelp(): void {
  console.log('chassi - VIN Decoder for Brazilian vehicles');
  console.log('');
  console.log('Usage: chassi <command> <vin>');
  console.log('');
  console.log('Commands:');
  console.log('  decode <vin>    Decode VIN and show vehicle information');
  console.log('  validate <vin>  Validate VIN structure and check digit');
  console.log('  parse <vin>     Parse VIN into its components');
  console.log('  check <vin>     Verify check digit');
  console.log('  help            Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  chassi decode 9BWZZZ377VT004251');
  console.log('  chassi validate 9BWZZZ377VT004251');
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (!vin) {
  console.error('Error: VIN is required');
  console.log('');
  showHelp();
  process.exit(1);
}

const normalizedVin = vin.toUpperCase().replace(/[\s-]/g, '');

switch (command) {
  case 'decode': {
    const result = decodeVin(normalizedVin, { includeComponents: true });
    
    console.log('');
    console.log('=== VIN Decode Result ===');
    console.log('');
    console.log(`VIN:          ${result.vin}`);
    console.log(`Valid:        ${result.valid ? 'Yes' : 'No'}`);
    console.log(`Manufacturer: ${result.manufacturer || 'Unknown'}`);
    console.log(`Country:      ${result.country || 'Unknown'}`);
    console.log(`Year:         ${result.year || 'Unknown'}`);
    console.log(`Model:        ${result.model || 'Unknown'}`);
    console.log(`Confidence:   ${(result.confidence * 100).toFixed(0)}%`);
    
    if (result.components) {
      console.log('');
      console.log('Components:');
      console.log(`  WMI:        ${result.components.wmi}`);
      console.log(`  VDS:        ${result.components.vds}`);
      console.log(`  VIS:        ${result.components.vis}`);
      console.log(`  Year Code:  ${result.components.yearCode}`);
      console.log(`  Plant Code: ${result.components.plantCode}`);
      console.log(`  Sequential: ${result.components.sequentialNumber}`);
    }
    
    console.log('');
    console.log(`Disclaimer: ${result.disclaimer}`);
    break;
  }
  
  case 'validate': {
    const result = validateVin(normalizedVin);
    
    console.log('');
    console.log('=== VIN Validation Result ===');
    console.log('');
    console.log(`VIN:           ${result.normalizedVin}`);
    console.log(`Valid:         ${result.valid ? 'Yes' : 'No'}`);
    console.log(`Length OK:     ${result.details.lengthValid ? 'Yes' : 'No'}`);
    console.log(`Characters OK: ${result.details.charactersValid ? 'Yes' : 'No'}`);
    console.log(`Check Digit:   ${result.details.checkDigitValid ? 'Valid' : 'Invalid'}`);
    
    if (result.errors.length > 0) {
      console.log('');
      console.log('Errors:');
      result.errors.forEach(err => {
        console.log(`  - ${err.message}`);
      });
    }
    break;
  }
  
  case 'parse': {
    const result = parseVin(normalizedVin);
    
    console.log('');
    console.log('=== VIN Components ===');
    console.log('');
    
    if (result) {
      console.log(`WMI (1-3):           ${result.wmi}`);
      console.log(`VDS (4-9):           ${result.vds}`);
      console.log(`VIS (10-17):         ${result.vis}`);
      console.log(`Check Digit (9):     ${result.checkDigit}`);
      console.log(`Year Code (10):      ${result.yearCode}`);
      console.log(`Plant Code (11):     ${result.plantCode}`);
      console.log(`Sequential (12-17):  ${result.sequentialNumber}`);
    } else {
      console.log('Could not parse VIN. Check if it has 17 valid characters.');
    }
    break;
  }
  
  case 'check': {
    const isValid = verifyCheckDigit(normalizedVin);
    const calculated = calculateCheckDigit(normalizedVin);
    const provided = normalizedVin.length >= 9 ? normalizedVin[8] : 'N/A';
    
    console.log('');
    console.log('=== Check Digit Verification ===');
    console.log('');
    console.log(`VIN:        ${normalizedVin}`);
    console.log(`Provided:   ${provided}`);
    console.log(`Calculated: ${calculated || 'Could not calculate'}`);
    console.log(`Valid:      ${isValid ? 'Yes' : 'No'}`);
    break;
  }
  
  default:
    console.error(`Unknown command: ${command}`);
    console.log('');
    showHelp();
    process.exit(1);
}
