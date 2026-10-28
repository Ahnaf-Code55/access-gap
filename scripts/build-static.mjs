import { cp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
const output = path.resolve('dist');
await rm(output, {recursive:true, force:true});
await cp(new URL('../public/', import.meta.url), output, {recursive:true});
await mkdir(path.join(output, 'api'), {recursive:true});
await writeFile(path.join(output, 'api/config'), JSON.stringify({aiAvailable:false}));
await writeFile(path.join(output, '_headers'), `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/api/config
  Content-Type: application/json; charset=utf-8
  Cache-Control: no-store
`);
console.log('Built browser-only evidence demo in dist; AI is explicitly disabled.');
