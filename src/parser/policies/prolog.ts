// This section is only for the IDE and Type Checking.
// It is physically removed during the hard-wired assembly.

/* @contract */
declare const V: Uint8Array;
declare let Vi: number;
declare const panic: (code: string, offset: number) => never;
/* @end */

/* @logic strict */
if (V[Vi] !== 0x3c || V[Vi + 1] !== 0x3f) {
  panic('ERR_MISSING_PROLOG', Vi);
}
// Hard-wired signature check for <?xml version="1.0" encoding="UTF-8"?>
// (Verification logic here)
Vi += 38;
/* @end */
