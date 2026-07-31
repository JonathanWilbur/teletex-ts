# ITU-T Recommendation T.61 Teletex-to-Unicode in TypeScript

ITU-T Recommendation T.61 specifies the T.61 character set for use in an
ancient telecommunications service called "Teletex." For this reason, the
words "Teletex" and "T.61" are often used interchangeably when talking about
character encodings, including by the ITU-T themselves.

Teletex character encodings are scarcely used anymore, except in ASN.1
specifications, but even then, it appears in legacy ASN.1 protocols and even
there, most implementations just treat Teletex as ASCII. This is mostly
accurate, since the first 127 characters overlaps with ASCII, although some
characters that are defined in ASCII are not defined in T.61.

See [the Wikipedia page on T.61](https://en.wikipedia.org/wiki/ITU_T.61).

## This Module

This module is ESM-only. I will not produce a CommonJS equivalent. Please get
with the times and use ESM.

This module has no dependencies and exports a single function that has 100%
test coverage and really simple code.

This code was written by a human, with some assistance from Cursor IDE. I would
say about 90% of the code in this module was written by a real human.

## Usage

```typescript
const encoder = new TextEncoder();
const input = Uint8Array.from([
    ...encoder.encode("Big"),
    0xA4,
    ...encoder.encode("Money"),
    0xA4,
]);
const output = teletexToString(input);
assert.equal(output, "Big$Money$");
```

## See Also

- [Meerkat DSA](https://wildboar-software.github.io/directory/), an X.500 DSA
  (not just LDAP server) that I wrote, which will use this.
- [ASN.1 Typescript Libraries](https://github.com/Wildboar-Software/asn1-typescript-libraries)
  where this will be used (see `or-address`, `pki-stub`, `x500`, and `x400` at least)
