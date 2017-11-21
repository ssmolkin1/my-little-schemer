# Sam's Little Schemer
A Scheme interpreter in JavaScript providing a minimal set of primitive functions based on [The Little Schemer, 4th Ed](https://mitpress.mit.edu/books/little-schemer).

## Purpose and philosophy
This package is meant to provide a fully functional interface for incorporating Scheme into JavaScript applications. The power and flexibility of Scheme syntax can be harnessed to do what pure functional languages do best &mdash; pure functions, recursion, parsing other languages, etc. Using `jsExpression()` to convert strings into jS-Expressions and manipulating them with the Scheme primitive functions provides a powerful way to parse languages. Additional functions can be defined for manipulating S-Expressions and jS-Expressions, either in JavaScript or in Scheme (using `define` and `lambda` ). *Functions defined in Scheme can be used in JavaScript, and vice versa!* The purpose of this package is not necessarily to write in Scheme alone, but to combine Scheme and JavaScript to open up new possibilities. 

## Installation
From the command line:
``` 
npm install sams-little-schemer
```

## Usage
### Including the module
CommonJS:
``` js
const ss = require('sams-little-schemer');
```
ES6:
``` js
import ss from 'sams-little-schemer';
```
### jS-Expressions

``` js
const sExp = '(car (cdr (cat dog)))';

ss.jSExpression(sExp); // [ 'car', [ 'cdr', [ 'cat', 'dog' ] ] ]
```

`jSExpression(string: string)` converts a string representing a valid Scheme S-Expression into a "jS-Expression", which is a manipulatable JavaScript data structure. The conversion is done according to the following mapping (S --> JS):

- Lists --> arrays
- Numbers --> numbers
- `#t` --> `true`
- `#f` --> `false`
- `#n` --> `'\n'`
- `#NaN` --> `NaN`
- `#Infinity` --> `Infinity`
- `#null` --> `null`
- `#undefined` --> `undefined`
- All other atoms --> strings

 Whitespace, line breaks and `'\n'` are ignored. You can use the special symbol `#n` instead of `\n`. Other escaped characters (e.g., `'\''` ) work as you would expect. The argument must be a string. 

`sExpression(exp: jSExpression)` can be used to convert a jS-Expression back into a S-Expression:
```js
const jSExp = ['car', ['cdr', ['cat', 'dog']]];

ss.sExpression(jSExp); // ( car ( cdr ( cat dog ) ) )
```

### Evaluation
```js
const sExp = `
  ((define insertR
    (lambda (new old lat)
      (cond 
        ((isNull lat) (quote ()))
        (else
          (cond 
            ((isEqan (car lat) old) (cons old (cons new (cdr lat))))
            (else (cons (car lat) (insertR new old (cdr lat)))))))))
  (define sentence
    (quote (My favorite pudding)))
  (quote sentence)
  (quote (insertR chocolate favorite sentence)))`;

const jSExp = ss.jSExpression(sExp);

ss.evaluate(sExp); // [ undefined, undefined, [ 'My', 'favorite', 'pudding' ], [ 'My', 'favorite', 'chocolate', 'pudding' ] ]

ss.evaluate(jSExp, true); // [ undefined, undefined, [ 'My', 'favorite', 'pudding' ], [ 'My', 'favorite', 'chocolate', 'pudding' ] ]

ss.evaluate(sExp, false, true, false); // [ 'My', 'favorite', 'chocolate', 'pudding' ]

ss.evaluate(sExp, false, false, true); // ( #undefined #undefined ( My favorite pudding ) ( My favorite chocolate pudding ) )
```

`evaluate(scheme: any, js: bool, final: bool, convert: bool)` evaluates a string representing a valid S-Expression or, if the `js` option is `true`, a jS-Expression, and returns a jS-Expression containing the results. If the `final` option is `true`, then only the final result is returned. If `convert` is `true`, then the result is returned as an S-Expression. The options all default to false.

`value(exp: jSExpression)` can also be used to evaluate a jS-Expression. The output is another jS-Expression. It is equivalent to `evaluate(jSExpression, true, false, false)`.

### Functions

#### Primitive functions

The following primitives are defined:

- `isList`
- `isAtom`
- `isNumber`
- `isNull`
- `car`
- `cdr`
- `cons`
- `isDefined`
- `isFunction`
- `quote`
- `define`
- `undefine`
- `cond`
- `lambda`
- `isEqan`
- `||`
- `&&`
- `sub1`
- `add1`
- `isZero`

All work as you would expect. Note that *anything that is not a list is an atom* (including functions, booleans, etc.). Since `?` is an operator in JavaScript, Scheme question forms like `null?` are converted to "is" forms like `isNull`. Also, note that definitions are scoped to the module's namespace (the `ss` object). Anything defined with `define` will be defined inside of `ss`. Thus, `isDefined`, `isFunction` and the evaluation functions will only recognize definitions and perform substitutions if the terms are defined inside of `ss`.  

In addition, a few helpful arithmetic functions have been defined:

- `+`
- `-`
- `*`
- `/`
- `%`

All are equivalent to the JavaScript symbol, although usage follows Scheme syntax with the operator in the front: `(+ n m)` or `['+', 'n', 'm']` or `ss['+'](n, m)` , depending on the context you are writing in. Arithmetic functions are not restricted to integers. Rational numbers are allowed.

Finally, there are the parsing and evaluation functions:

- `jsExpression`
- `sExpression`
- `value`
- `evaluate`

### Defining further functions
