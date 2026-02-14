/* @contract */
declare const V: Uint8Array;
declare let Vi: number;
declare const S: Uint32Array;
declare let Si: number;
declare const panic: (code: string, offset: number) => never;
/* @end */

/* @logic strict */
// If we are in the ETag logic, we check if the STag we just popped
// was immediately followed by this ETag.
const sStart = S[Si - 2];
const sEnd = S[Si - 1];

// If the byte after the '>' of the STag is the '<' of this ETag
if (V[sEnd + 1] === 0x3c && V[sEnd + 2] === 0x2f) {
  panic('ERR_USE_SELF_CLOSING', sEnd + 1);
}
/* @end */
