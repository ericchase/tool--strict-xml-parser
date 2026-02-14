/** Goal
 *
 * Extensible Markup Language (XML) 1.0 (Fifth Edition)
 * https://www.w3.org/TR/REC-xml
 *
 * There are 80+ grammer rules in the XML specification in Extended Backus-Naur
 * Form (EBNF) notation. The goal here is to document and convert each of these
 * rules into a valid JavaScript template literal. This code is not meant to do
 * anything. It only serves as an alternative notation for the XML 1.0 language
 * grammar.
 *
 * In EBNF notation, each character in a rule has a meaning that is defined by
 * the notation itself. The only characters that have meaning in respect to the
 * XML 1.0 language are those found within double and single quotation marks.
 * For example, consider rules [4] and [9]:
 * [4]   NameStartChar   ::=   ":" | [A-Z] | "_" | [a-z] | ...
 * [9]   EntityValue     ::=   '"' ([^%&"] | PEReference | Reference)* '"'
 * The only literal characters that pertain to the language are the semicolon,
 * underscore, double quote, and the range of characters in [A-Z], [a-z], and
 * [^%&"]. All the other characters and symbols are part of the notation. That
 * also means that all of the whitespace not found within quotes or brackets is
 * not part of the XML 1.0 language. Keep this in mind when transcribing the
 * template literals.
 */

import { zero_or_more } from './notation.js';

// Element
// [WFC: Element Type Match]
// [VC: Element Valid]
// [39]   element       ::=   EmptyElemTag | STag content ETag
const element = `EmptyElemTag | STag content ETag`;

// Prolog
// [22]   prolog        ::=   XMLDecl? Misc* (doctypedecl Misc*)?
// [23]   XMLDecl       ::=   '<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>'
// [24]   VersionInfo   ::=   S 'version' Eq ("'" VersionNum "'" | '"' VersionNum '"')
// [25]   Eq            ::=   S? '=' S?
// [26]   VersionNum    ::=   '1.' [0-9]+
// [27]   Misc          ::=   Comment | PI | S
const prolog = `XMLDecl? Misc* (doctypedecl Misc*)?`;
const Misc = `Comment | PI | S`;

// Document
// [1]   document   ::=   prolog element Misc*
const document = `${prolog}${element}${zero_or_more(Misc)}`;
