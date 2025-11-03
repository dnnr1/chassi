#!/usr/bin/env node
import { decodeVin } from '../decoder/decode';
import { validateVin } from '../core/validateVin';
import { parseVin } from '../core/parseVin';
import { verifyCheckDigit } from '../core/checkDigit';

const args = process.argv.slice(2);
const command = args[0];
const vin = args[1];

function showHelp() {
  console.log('chassi - VIN Decoder for Brazilian vehicles');
  console.log('');
  console.log('Usage: chassi <command> <vin>');
  console.log('');
  console.log('Commands:');
  console.log('  decode <vin>    Decode VIN information');
  console.log('  validate <vin>  Validate VIN structure');
  console.log('  parse <vin>     Parse VIN into components');
  console.log('  check <vin>     Verify check digit');
  console.log('  help            Show this help');
}

if (!command || command === 'help') {
  showHelp();
  process.exit(0);
}

if (!vin) {
  console.error('Error: VIN is required');
  process.exit(1);
}

switch (command) {
  case 'decode':
    const decoded = decodeVin(vin, { includeComponents: true });
    console.log('\n=== VIN Decode Result ===\n');
    console.log(`VIN: ${decoded.vin}`);
    console.log(`Valid: ${decoded.valid}`);
    console.log(`Manufacturer: ${decoded.manufacturer || 'Unknown'}`);
    console.log(`Country: ${decoded.country || 'Unknown'}`);
    console.log(`Year: ${decoded.year || 'Unknown'}`);
    console.log(`Model: ${decoded.model || 'Unknown'}`);
    console.log(`Confidence: ${(decoded.confidence * 100).toFixed(0)}%`);
    break;
    
  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
