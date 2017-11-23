/* global it, describe */

import { expect } from 'chai';
<<<<<<< HEAD
import s from '../index';
=======
import ss from '../index';
>>>>>>> origin/obs-and-parser

describe('isList', () => {
  it('is true for lists', () => {
    const exp = [];

<<<<<<< HEAD
    expect(s.isList(exp)).to.equal(true);
=======
    expect(ss.isList(exp)).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('is false for atoms, like numbers', () => {
    const exp = 0;

<<<<<<< HEAD
    expect(s.isList(exp)).to.equal(false);
=======
    expect(ss.isList(exp)).to.equal(false);
>>>>>>> origin/obs-and-parser
  });

  it('...and false for other things that are not lists, too', () => {
    const exp = {};

<<<<<<< HEAD
    expect(s.isList(exp)).to.equal(false);
=======
    expect(ss.isList(exp)).to.equal(false);
>>>>>>> origin/obs-and-parser
  });
});

describe('isAtom', () => {
  it('is true for numbers', () => {
    const exp = 0;

<<<<<<< HEAD
    expect(s.isAtom(exp)).to.equal(true);
=======
    expect(ss.isAtom(exp)).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('is true for strings', () => {
    const exp = 'hello';

<<<<<<< HEAD
    expect(s.isAtom(exp)).to.equal(true);
=======
    expect(ss.isAtom(exp)).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('is true for other things that are not lists', () => {
    const exp = {};

<<<<<<< HEAD
    expect(s.isAtom(exp)).to.equal(true);
=======
    expect(ss.isAtom(exp)).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('is false for list', () => {
    const exp = [];

<<<<<<< HEAD
    expect(s.isAtom(exp)).to.equal(false);
=======
    expect(ss.isAtom(exp)).to.equal(false);
>>>>>>> origin/obs-and-parser
  });
});

describe('isNumber', () => {
  it('is true for numbers', () => {
    const exp = 0;

<<<<<<< HEAD
    expect(s.isNumber(exp)).to.equal(true);
=======
    expect(ss.isNumber(exp)).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('is false for NaN', () => {
    const exp = NaN;

<<<<<<< HEAD
    expect(s.isNumber(exp)).to.equal(false);
=======
    expect(ss.isNumber(exp)).to.equal(false);
>>>>>>> origin/obs-and-parser
  });

  it('is false for strings', () => {
    const exp = 'hello';

<<<<<<< HEAD
    expect(s.isNumber(exp)).to.equal(false);
=======
    expect(ss.isNumber(exp)).to.equal(false);
>>>>>>> origin/obs-and-parser
  });

  it('...and other things that are not numbers', () => {
    const exp = {};

<<<<<<< HEAD
    expect(s.isNumber(exp)).to.equal(false);
=======
    expect(ss.isNumber(exp)).to.equal(false);
>>>>>>> origin/obs-and-parser
  });
});

describe('isNull', () => {
  it('is true for the null list', () => {
    const exp = [];

<<<<<<< HEAD
    expect(s.isNull(exp)).to.equal(true);
=======
    expect(ss.isNull(exp)).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('is false for non-empty list', () => {
    const exp = [[]];

<<<<<<< HEAD
    expect(s.isNull(exp)).to.equal(false);
=======
    expect(ss.isNull(exp)).to.equal(false);
>>>>>>> origin/obs-and-parser
  });

  it('does not work for atoms, like numbers', () => {
    const exp = 0;

<<<<<<< HEAD
    expect(() => s.isNull(exp)).to.throw();
=======
    expect(() => ss.isNull(exp)).to.throw();
>>>>>>> origin/obs-and-parser
  });

  it('...and other things that are not lists', () => {
    const exp = {};

<<<<<<< HEAD
    expect(() => s.isNull(exp)).to.throw();
=======
    expect(() => ss.isNull(exp)).to.throw();
>>>>>>> origin/obs-and-parser
  });
});

describe('car', () => {
  it('returns the first element of a list', () => {
    const l = [['one'], 'two'];

<<<<<<< HEAD
    expect(s.car(l)).to.eql(['one']);
=======
    expect(ss.car(l)).to.eql(['one']);
>>>>>>> origin/obs-and-parser
  });

  it('only works on lists', () => {
    const l = 'hello';

<<<<<<< HEAD
    expect(() => s.car(l)).to.throw();
=======
    expect(() => ss.car(l)).to.throw();
>>>>>>> origin/obs-and-parser
  });

  it('...that are not the empty list', () => {
    const l = [];

<<<<<<< HEAD
    expect(() => s.car(l)).to.throw();
=======
    expect(() => ss.car(l)).to.throw();
>>>>>>> origin/obs-and-parser
  });
});

describe('cdr', () => {
  it('returns a new list containing all elements other than the car of a list', () => {
    const l1 = [['one'], 'two'];
<<<<<<< HEAD
    const l2 = s.cdr(l1);
=======
    const l2 = ss.cdr(l1);
>>>>>>> origin/obs-and-parser

    expect(l2).to.eql(['two']);
  });

  it('is a pure function', () => {
    const l1 = [['one'], 'two'];
<<<<<<< HEAD
    const l2 = s.cdr(l1);
=======
    const l2 = ss.cdr(l1);
>>>>>>> origin/obs-and-parser

    expect(l1).to.eql([['one'], 'two']);
  });

  it('only works on lists', () => {
    const l = 'hello';

<<<<<<< HEAD
    expect(() => s.cdr(l)).to.throw();
=======
    expect(() => ss.cdr(l)).to.throw();
>>>>>>> origin/obs-and-parser
  });

  it('...that are not the empty list', () => {
    const l = [];

<<<<<<< HEAD
    expect(() => s.cdr(l)).to.throw();
=======
    expect(() => ss.cdr(l)).to.throw();
>>>>>>> origin/obs-and-parser
  });
});

describe('cons', () => {
  it('returns a new list containing the first argument followed by the elements of the second argument', () => {
    const exp = [['one'], 'two'];
    const l = ['three'];
<<<<<<< HEAD
    const n = s.cons(exp, l);
=======
    const n = ss.cons(exp, l);
>>>>>>> origin/obs-and-parser

    expect(n).to.eql([[['one'], 'two'], 'three']);
  });

  it('is a pure function', () => {
    const exp = [['one'], 'two'];
    const l = ['three'];
<<<<<<< HEAD
    const n = s.cons(exp, l);
=======
    const n = ss.cons(exp, l);
>>>>>>> origin/obs-and-parser

    expect(l).to.eql(['three']);
  });

  it('only works if the second argument is a list', () => {
    const exp = ['world'];
    const l = 'hello';

<<<<<<< HEAD
    expect(() => s.cons(exp, l)).to.throw();
=======
    expect(() => ss.cons(exp, l)).to.throw();
>>>>>>> origin/obs-and-parser
  });

  it('...and not anything else', () => {
    const exp = [['one'], 'two'];
    const l = { 3: ['three'] };

<<<<<<< HEAD
    expect(() => s.cons(exp, l)).to.throw();
=======
    expect(() => ss.cons(exp, l)).to.throw();
>>>>>>> origin/obs-and-parser
  });
});

describe('jSExpression', () => {
  it('takes a string representng a valid scheme expression and turns it into an array', () => {
    const string = '(car (cdr l))';

<<<<<<< HEAD
    expect(s.jSExpression(string)).to.eql(['car', ['cdr', 'l']]);
=======
    expect(ss.jSExpression(string)).to.eql(['car', ['cdr', 'l']]);
>>>>>>> origin/obs-and-parser
  });

  it('is a pure function', () => {
    const string = '(car (cdr l))';
<<<<<<< HEAD
    const exp = s.jSExpression(string);
=======
    const exp = ss.jSExpression(string);
>>>>>>> origin/obs-and-parser

    expect(string).to.equal('(car (cdr l))');
  });

  it('only works if the argument is a string', () => {
    const notString = ['world'];

<<<<<<< HEAD
    expect(() => s.jSExpression(notString)).to.throw();
=======
    expect(() => ss.jSExpression(notString)).to.throw();
>>>>>>> origin/obs-and-parser
  });

  it('returns an atom if the argument is a string representing an atom', () => {
    const string = 'hello';

<<<<<<< HEAD
    expect(s.isAtom(s.jSExpression(string))).to.equal(true);
=======
    expect(ss.isAtom(ss.jSExpression(string))).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('...and a list if it is a string representing a list', () => {
    const string = '(hello world)';

<<<<<<< HEAD
    expect(s.isList(s.jSExpression(string))).to.equal(true);
=======
    expect(ss.isList(ss.jSExpression(string))).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('returns a number, rather than a string, for any numbers in the argument', () => {
    const string = '(5 cookies)';

<<<<<<< HEAD
    expect(s.isNumber(s.car(s.jSExpression(string)))).to.equal(true);
=======
    expect(ss.isNumber(ss.car(ss.jSExpression(string)))).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('surrounds a list in parentheses if none were supplied, but does not do so if they were', () => {
    const string = '(hello world)';

<<<<<<< HEAD
    expect(s.jSExpression(string)).to.eql(['hello', 'world']);
=======
    expect(ss.jSExpression(string)).to.eql(['hello', 'world']);
>>>>>>> origin/obs-and-parser
  });

  it('converts #t to Boolean true', () => {
    const string = '#t';

<<<<<<< HEAD
    expect(s.jSExpression(string)).to.equal(true);
=======
    expect(ss.jSExpression(string)).to.equal(true);
>>>>>>> origin/obs-and-parser
  });

  it('converts #f to Boolean false', () => {
    const string = '#f';

<<<<<<< HEAD
    expect(s.jSExpression(string)).to.equal(false);
=======
    expect(ss.jSExpression(string)).to.equal(false);
>>>>>>> origin/obs-and-parser
  });

  it('handles the null list', () => {
    const string = '()';

<<<<<<< HEAD
    expect(s.jSExpression(string)).to.eql([]);
=======
    expect(ss.jSExpression(string)).to.eql([]);
>>>>>>> origin/obs-and-parser
  });

  it('handles grammatical symbols, so it can be used for sentence composition. Note #n is used for newline', () => {
    const string = '(#n \' \\ / | " , : . ... & - )';

<<<<<<< HEAD
    expect(s.jSExpression(string)).to.eql(['\n', '\'', '\\', '/', '|', '"', ',', ':', '.', '...', '&', '-']);
=======
    expect(ss.jSExpression(string)).to.eql(['\n', '\'', '\\', '/', '|', '"', ',', ':', '.', '...', '&', '-']);
>>>>>>> origin/obs-and-parser
  });

  it('handles other special JS types', () => {
    const string = '(#null #Infinity #NaN #undefined)';

<<<<<<< HEAD
    expect(s.jSExpression(string)).to.eql([null, Infinity, NaN, undefined]);
=======
    expect(ss.jSExpression(string)).to.eql([null, Infinity, NaN, undefined]);
>>>>>>> origin/obs-and-parser
  });
});

describe('evaluate', () => {
  it('converts special symbols back from JS to Scheme', () => {
    const input = [null, Infinity, NaN, undefined];

<<<<<<< HEAD
    expect(s.evaluate(input, true, false, true)).to.equal('( #null #Infinity #NaN #undefined )');
=======
    expect(ss.evaluate(input, true, false, true)).to.equal('( #null #Infinity #NaN #undefined )');
>>>>>>> origin/obs-and-parser
  });
})
