#!/usr/bin/env node
import { decodeVin } from '../decoder/decode';

const args = process.argv.slice(2);
const command = args[0];
const vin = args[1];

if (!command || command === 'help') {
  console.log('Usage: chassi <command> <vin>');
  console.log('Commands: decode, validate, parse, check');
  process.exit(0);
}

if (command === 'decode' && vin) {
  const result = decodeVin(vin);
  console.log(JSON.stringify(result, null, 2));
}
