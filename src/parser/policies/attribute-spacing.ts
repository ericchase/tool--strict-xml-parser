/* @contract */
declare const V: Uint8Array;
declare let Vi: number;
declare const panic: (code: string, offset: number) => never;
/* @end */

/* @logic strict */
// Strict: Exactly one space (0x20) between attributes.
// The skeleton is currently at a space byte.
if (V[Vi + 1] === 0x20) {
  panic('ERR_EXCESS_WHITESPACE', Vi + 1);
}
/* @end */
