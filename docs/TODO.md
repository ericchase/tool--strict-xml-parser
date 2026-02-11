# Transcribe XML 1.0 language grammar from EBNF rules to template literals.

https://www.w3.org/TR/REC-xml/#NT-Misc

There are [89] EBNF rules to transcribe along with some of the EBNF notation itself.

The XML 1.0 grammar transcriptions can be found in `src/language/grammar.ts`.

The EBNF notation transcriptions can be found in `src/language/notation.ts`.

# Write a strict version of the XML 1.0 language grammar.

I will outline the stricter rules for this subgrammar as we go. To do that, I will first need the complete transcription of the official XML 1.0 language.

# Write a strict version of the XML 1.0 parser.

This parser will be written specifically for the new strict version subgrammar of XML 1.0. It will not be able to parse official XML 1.0 strings unless those strings happen to already follow the stricter ruleset of this subgrammar. Obviously, this would make the parser useless for the majority of XML text that exists. To remedy this problem, we will write a second parser that will attempt to follow the official XML 1.0 grammar.

# Write a standard XML 1.0 parser.

This will be an attempt to write a working parser for the official XML 1.0 grammar with the express purpose of formatting standard XML text into valid _strict version_ XML text. The official XML 1.0 specification is not very strict, as its purpose is to be useful for the majority of applications.

That said, there is no shortage of standard XML 1.0 parsers. Writing yet another would not be particularly productive. The goal of this project is to produce a strict subset of XML 1.0, with or without some XML extensions, that will allow developers to work with more secure and predictable XML text. The strict version grammar should still produce valid standard XML language.
