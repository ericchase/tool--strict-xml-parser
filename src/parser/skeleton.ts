/**
 * [Production 1] document
 * LEGEND:
 * V - [view]       The Uint8Array of XML input
 * Vi - [index]     The current cursor/offset in the input
 * AT - [Types]     Uint8Array  : Stores node types
 * AS - [Starts]    Uint32Array : Stores start offsets
 * AE - [Ends]      Uint32Array : Stores end offsets
 * Ai - [index]     The current pointer for result arrays (shared)
 * S - [Stack]      Uint32Array : The well-formedness pointer stack
 * Si - [index]     The current pointer for the stack
 * LUT - [Lookup]   The NameChar LUT (256-byte Uint8Array)
 * panic - [fatal]  The panic function: panic(errorCode, offset)
 */
export function parser(V: Uint8Array, Vi = 0, AT: Uint8Array, AS: Uint32Array, AE: Uint32Array, Ai = 0, S: Uint32Array, Si = 0, LUT: Uint8Array) {
  const n = V.length;

  /* @slot PROLOG */

  while (Vi < n) {
    const b = V[Vi];

    if (b === 0x3c) {
      // '<'
      const next = V[Vi + 1];

      if (next === 0x2f) {
        // '</' End Tag
        Vi += 2;
        const nameS = Vi;
        while (LUT[V[Vi]]) {
          Vi++;
        }
        const nameE = Vi;
        const nameLen = nameE - nameS;

        // Well-Formedness: Check Stack
        const sE = S[--Si];
        const sS = S[--Si];
        if (nameLen !== sE - sS) {
          panic('ERR_TAG_MISMATCH', Vi);
        }

        // Byte-by-byte comparison
        for (let j = 0; j < nameLen; j++) {
          if (V[nameS + j] !== V[sS + j]) {
            panic('ERR_TAG_MISMATCH', nameS + j);
          }
        }

        /* @slot ETAG_CLOSE */
        if (V[Vi] !== 0x3e) {
          panic('ERR_WHITESPACE_IN_CLOSE_TAG', Vi);
        }

        AT[Ai] = 2; // TYPE_ETAG
        AS[Ai] = nameS;
        AE[Ai] = nameE;
        Ai++;
        Vi++;
      } else if (next === 0x21) {
        // '<!'
        /* @slot MARKUP_DECL */
      } else if (next === 0x3f) {
        // '<?'
        /* @slot PI */
      } else {
        // '<' Start Tag
        const nameS = ++Vi;
        while (LUT[V[Vi]]) {
          Vi++;
        }
        const nameE = Vi;
        if (nameS === nameE) {
          panic('ERR_EMPTY_NAME', Vi);
        }

        AT[Ai] = 1; // TYPE_STAG
        AS[Ai] = nameS;
        AE[Ai] = nameE;
        Ai++;

        S[Si++] = nameS;
        S[Si++] = nameE;

        // Attribute Loop
        while (V[Vi] === 0x20) {
          // ' '
          /* @slot ATTR_BEFORE_SPACE */
          Vi++; // Consume single space

          const aS = Vi;
          while (LUT[V[Vi]]) {
            Vi++;
          }
          const aE = Vi;
          if (aS === aE) {
            panic('ERR_MALFORMED_ATTR', Vi);
          }

          /* @slot ATTR_UNIQUE_CHECK */

          if (V[Vi++] !== 0x3d) {
            panic('ERR_EXPECTED_EQUALS', Vi - 1);
          }
          /* @slot ATTR_QUOTE_OPEN */
          if (V[Vi++] !== 0x22) {
            panic('ERR_EXPECTED_QUOTE', Vi - 1);
          }

          const vS = Vi;
          const nextQ = V.indexOf(0x22, Vi);
          if (nextQ === -1) {
            panic('ERR_UNCLOSED_ATTR', Vi);
          }

          AT[Ai] = 3; // TYPE_ATTR_KEY
          AS[Ai] = aS;
          AE[Ai] = aE;
          Ai++;

          AT[Ai] = 4; // TYPE_ATTR_VAL
          AS[Ai] = vS;
          AE[Ai] = nextQ;
          Ai++;

          Vi = nextQ + 1;
        }

        if (V[Vi] === 0x2f) {
          // '/' Self-closing
          /* @slot STAG_SELF_CLOSE */
          if (V[++Vi] !== 0x3e) {
            panic('ERR_EXPECTED_GT', Vi);
          }
          Si -= 2; // Pop stack
          Vi++;
        } else if (V[Vi] === 0x3e) {
          // '>'
          Vi++;
        } else {
          panic('ERR_ILLEGAL_TAG_CHAR', Vi);
        }
      }
    } else {
      // Text Content
      const textS = Vi;
      while (Vi < n && V[Vi] !== 0x3c) {
        Vi++;
      }
      if (Vi > textS) {
        AT[Ai] = 5; // TYPE_TEXT
        AS[Ai] = textS;
        AE[Ai] = Vi;
        Ai++;
      }
    }
  }
}

function panic(code: string, Vi: number) {
  console.error(code, Vi);
}
