// File: envTest.ts
import dotenv from 'dotenv';
dotenv.config();

console.log('📦 Loaded API_KEY:', process.env.API_KEY || '[MISSING]');
console.log('📦 Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY || '[MISSING]');

