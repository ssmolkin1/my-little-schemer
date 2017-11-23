# Sam's Little Schemer
<<<<<<< HEAD
An interpreter for integrating Scheme into JavaScript, providing a small set of primitive functions inspired by [The Little Schemer, 4th Ed](https://mitpress.mit.edu/books/little-schemer).

## Design and purpose
This module provides an interface for integrating Scheme into JavaScript applications. The primary goal is interoperability, rather than writing in Scheme alone (although that is an option). Hence, this dialect of Scheme, while inspired [The Little Schemer, 4th Ed](https://mitpress.mit.edu/books/little-schemer), has some additions and changes that make it more useful for integration in JavaScript apps.

The power and flexibility of Scheme syntax can be harnessed to do what functional languages do best &mdash; pure functions, recursion, parsing other languages, etc. The `jsExpression()` function converts strings representing valid S-Expressions into a useful JavaScript datatype that can be composed and manipulated using Scheme, JavaScript, or Scheme-like JavaScript. The `sExpression()` function converts them back into strings. The purpose is not to write in Scheme alone, but to combine Scheme and JavaScript to open up new possibilities. Hence,  Output can be passed between Scheme and JavaScript. Functions defined in Scheme can be used in JavaScript, and vice versa!  
=======
A Scheme interpreter in JavaScript providing a small set of primitive functions inspired by [The Little Schemer, 4th Ed](https://mitpress.mit.edu/books/little-schemer).

## Design and purpose
This module provides an interface for integrating Scheme into JavaScript applications. The power and flexibility of Scheme syntax can be harnessed to do what functional languages do best &mdash; pure functions, recursion, parsing other languages, etc. The `jsExpression()` function converts strings representing valid S-Expressions into a useful JavaScript datatype that can be composed and manipulated using Scheme, JavaScript, or Scheme-like JavaScript. The `sExpression()` function converts them back into strings. The purpose is not to write in Scheme alone, but to combine Scheme and JavaScript to open up new possibilities. Hence, the primary goal in interoperability. Output can be passed between Scheme and JavaScript. Functions defined in Scheme can be used in JavaScript, and vice versa!  
>>>>>>> origin/obs-and-parser

### Four ways to write
There are four ways to write using this module:
```js 
<<<<<<< HEAD
const s = require('sams-little-schemer');

// Scheme
s.evaluate(`(
  (define isLat
    (lambda (l)
      (cond
        ((isNull l) #t)
        ((isAtom (car l)) (isLat (cdr l)))
        (else #f))))
  (isLat (cons cat (dog)))
)`, false, true, true); // #t

// jScheme
s.value(['cons', 'bird', ['cdr', ['mouse', 'house']]]) // [ 'bird', 'house' ]

// SchemeJS
s.isLat = (l) => {
  if (s.isNull(l)) {
    return true;
  }

  if (s.isAtom(s.car(l))) {
    return s.isLat(s.cdr(l));
  }

  return false;
};

s.cons(s.isLat(['<3']), ['love']); // [ true, 'love' ]

// Creatively
s.isFinWord = word => word.slice(-1) === '.';
ss['>'] = (n, m) => n > m;

s.evaluate(`
=======
const ss = require('sams-little-schemer');

// Scheme
ss.evaluate(`
  (cons cat (dog))
`, false, false, true)  // ( cat dog ) 

// jScheme
ss.value(['cons', 'bird', ['cdr', ['mouse', 'house']]]) // [ 'bird', 'house' ]

// SchemeJS
ss.cons(ss.isNull(ss.cdr(['<3'])), ['love'])  // [ true, 'love' ]

// Creatively
ss.isFinWord = word => word.slice(-1) === '.';
ss['>'] = (n, m) => n > m;

ss.evaluate(`
>>>>>>> origin/obs-and-parser
  (define hasRunOnSentence
    (lambda (p n)
      (cond
        ((> n 20) #t)
        ((isNull p) #f)
        ((isFinWord (car p)) (hasRunOnSentence (cdr p) 0))
        (else (hasRunOnSentence (cdr p) (add1 n))))))
`);

function checkForRunOnSentences(p) {
<<<<<<< HEAD
  console.log(s.hasRunOnSentence(s.jSExpression(`(${p})`), 0) ? 
`Whoa, you've got a long one there!` : `This is OK.`);
=======
  console.log(ss.hasRunOnSentence(ss.jSExpression(`(${p})`), 0) ? 
`Whoa, you've got some long ones there!` : `This is OK.`);
>>>>>>> origin/obs-and-parser
}

const para = `She went to the movies.
  Then she met a friend for ice cream at that one place 
  she loved so much that she went to that one time.
  Then she went home.`

<<<<<<< HEAD
checkForRunOnSentences(para); // Whoa, you've got a long one there!
=======
checkForRunOnSentences(para); // Whoa, you've got some long ones there!
>>>>>>> origin/obs-and-parser

```

## Installation
From the command line:
``` 
npm install sams-little-schemer
```

## Usage
### Including the module
CommonJS:
``` js
<<<<<<< HEAD
const s = require('sams-little-schemer');
```
ES6:
``` js
import s from 'sams-little-schemer';
=======
const ss = require('sams-little-schemer');
```
ES6:
``` js
import ss from 'sams-little-schemer';
>>>>>>> origin/obs-and-parser
```
### jS-Expressions

``` js
const sExp = '(car (cdr (cat dog)))';

<<<<<<< HEAD
s.jSExpression(sExp); // [ 'car', [ 'cdr', [ 'cat', 'dog' ] ] ]
=======
ss.jSExpression(sExp); // [ 'car', [ 'cdr', [ 'cat', 'dog' ] ] ]
>>>>>>> origin/obs-and-parser
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

<<<<<<< HEAD
s.sExpression(jSExp); // ( car ( cdr ( cat dog ) ) )
=======
ss.sExpression(jSExp); // ( car ( cdr ( cat dog ) ) )
>>>>>>> origin/obs-and-parser
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

<<<<<<< HEAD
const jSExp = s.jSExpression(sExp);

s.evaluate(sExp); // [ undefined, undefined, [ 'My', 'favorite', 'pudding' ], [ 'My', 'favorite', 'chocolate', 'pudding' ] ]

s.evaluate(jSExp, true); // [ undefined, undefined, [ 'My', 'favorite', 'pudding' ], [ 'My', 'favorite', 'chocolate', 'pudding' ] ]

s.evaluate(sExp, false, true, false); // [ 'My', 'favorite', 'chocolate', 'pudding' ]

s.evaluate(sExp, false, false, true); // ( #undefined #undefined ( My favorite pudding ) ( My favorite chocolate pudding ) )
=======
const jSExp = ss.jSExpression(sExp);

ss.evaluate(sExp); // [ undefined, undefined, [ 'My', 'favorite', 'pudding' ], [ 'My', 'favorite', 'chocolate', 'pudding' ] ]

ss.evaluate(jSExp, true); // [ undefined, undefined, [ 'My', 'favorite', 'pudding' ], [ 'My', 'favorite', 'chocolate', 'pudding' ] ]

ss.evaluate(sExp, false, true, false); // [ 'My', 'favorite', 'chocolate', 'pudding' ]

ss.evaluate(sExp, false, false, true); // ( #undefined #undefined ( My favorite pudding ) ( My favorite chocolate pudding ) )
>>>>>>> origin/obs-and-parser
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
- `isEqual`
- `isEqlist`
- `||`
- `&&`
- `sub1`
- `add1`
- `isZero`

All work as you would expect. Note that *anything that is not a list is an atom* (including functions, booleans, etc.). Since `?` is an operator in JavaScript, Scheme question forms like `null?` are converted to "is" forms like `isNull`. 

In addition, a few helpful arithmetic functions have been defined as primitives:

- `+`
- `-`
- `*`
- `/`
- `%`

All are equivalent to the JavaScript symbol, although usage follows Scheme syntax with the operator in the front: `(+ n m)` or `['+', 'n', 'm']` or `ss['+'](n, m)` , depending on the context you are writing in. The number set is not restricted to integers. Rational numbers are allowed.

Finally, there are the parsing and evaluation functions:

- `jsExpression`
- `sExpression`
- `value`
- `evaluate`

### Pure functions and define
All of the predefined functions are pure functions, with the exception of `define`. The language primitives are all defined within the module's namespace, i.e. the `ss` object. Variables defined with `define` / `define()` will be defined inside of `ss` . Thus, it is an impure function which changes the state of the module and essentially creates new primitives. While this is not how actual Scheme works, it is useful for integrating with JavaScript. Note that `isDefined` and the evaluators will only recognize definitions and perform substitutions if the variables are defined inside of `ss`. However, you can also pass functions and variables from other namespaces into the evaluator in your jS-Expressions:

```js
function pickle(x) {
<<<<<<< HEAD
  return s.cons('orange', x);
=======
  return ss.cons('orange', x);
>>>>>>> origin/obs-and-parser
}

const juice = ['ice', 'cream'];

const js1 = ['car', ['pickle', 'juice']]; // pickle
const js2 = ['car', [pickle, juice]]; // orange
const js3 = ['cdr', [pickle, juice]]; // [ 'ice', 'cream' ]
```
