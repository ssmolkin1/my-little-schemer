/* global it, describe */

import { expect } from 'chai';
import ss from '../index';

describe('isList', () => {
  it('is true for lists', () => {
    const exp = [];

    expect(ss.isList(exp)).to.equal(true);
  });

  it('is false for atoms, like numbers', () => {
    const exp = 0;

    expect(ss.isList(exp)).to.equal(false);
  });

  it('...and false for other things that are not lists, too', () => {
    const exp = {};

    expect(ss.isList(exp)).to.equal(false);
  });
});

describe('isAtom', () => {
  it('is true for numbers', () => {
    const exp = 0;

    expect(ss.isAtom(exp)).to.equal(true);
  });

  it('is true for strings', () => {
    const exp = 'hello';

    expect(ss.isAtom(exp)).to.equal(true);
  });

  it('is true for other things that are not lists', () => {
    const exp = {};

    expect(ss.isAtom(exp)).to.equal(true);
  });

  it('is false for list', () => {
    const exp = [];

    expect(ss.isAtom(exp)).to.equal(false);
  });
});

describe('isNumber', () => {
  it('is true for numbers', () => {
    const exp = 0;

    expect(ss.isNumber(exp)).to.equal(true);
  });

  it('is false for NaN', () => {
    const exp = NaN;

    expect(ss.isNumber(exp)).to.equal(false);
  });

  it('is false for strings', () => {
    const exp = 'hello';

    expect(ss.isNumber(exp)).to.equal(false);
  });

  it('...and other things that are not numbers', () => {
    const exp = {};

    expect(ss.isNumber(exp)).to.equal(false);
  });
});

describe('isNull', () => {
  it('is true for the null list', () => {
    const exp = [];

    expect(ss.isNull(exp)).to.equal(true);
  });

  it('is false for non-empty list', () => {
    const exp = [[]];

    expect(ss.isNull(exp)).to.equal(false);
  });

  it('does not work for atoms, like numbers', () => {
    const exp = 0;

    expect(() => ss.isNull(exp)).to.throw();
  });

  it('...and other things that are not lists', () => {
    const exp = {};

    expect(() => ss.isNull(exp)).to.throw();
  });
});

describe('car', () => {
  it('returns the first element of a list', () => {
    const l = [['one'], 'two'];

    expect(ss.car(l)).to.eql(['one']);
  });

  it('only works on lists', () => {
    const l = 'hello';

    expect(() => ss.car(l)).to.throw();
  });

  it('...that are not the empty list', () => {
    const l = [];

    expect(() => ss.car(l)).to.throw();
  });
});

describe('cdr', () => {
  it('returns a new list containing all elements other than the car of a list', () => {
    const l1 = [['one'], 'two'];
    const l2 = ss.cdr(l1);

    expect(l2).to.eql(['two']);
  });

  it('is a pure function', () => {
    const l1 = [['one'], 'two'];
    const l2 = ss.cdr(l1);

    expect(l1).to.eql([['one'], 'two']);
  });

  it('only works on lists', () => {
    const l = 'hello';

    expect(() => ss.cdr(l)).to.throw();
  });

  it('...that are not the empty list', () => {
    const l = [];

    expect(() => ss.cdr(l)).to.throw();
  });
});

describe('cons', () => {
  it('returns a new list containing the first argument followed by the elements of the second argument', () => {
    const exp = [['one'], 'two'];
    const l = ['three'];
    const n = ss.cons(exp, l);

    expect(n).to.eql([[['one'], 'two'], 'three']);
  });

  it('is a pure function', () => {
    const exp = [['one'], 'two'];
    const l = ['three'];
    const n = ss.cons(exp, l);

    expect(l).to.eql(['three']);
  });

  it('only works if the second argument is a list', () => {
    const exp = ['world'];
    const l = 'hello';

    expect(() => ss.cons(exp, l)).to.throw();
  });

  it('...and not anything else', () => {
    const exp = [['one'], 'two'];
    const l = { 3: ['three'] };

    expect(() => ss.cons(exp, l)).to.throw();
  });
});

describe('jSExpression', () => {
  it('takes a string representng a valid scheme expression and turns it into an array', () => {
    const string = '(car (cdr l))';

    expect(ss.jSExpression(string)).to.eql(['car', ['cdr', 'l']]);
  });

  it('is a pure function', () => {
    const string = '(car (cdr l))';
    const exp = ss.jSExpression(string);

    expect(string).to.equal('(car (cdr l))');
  });

  it('only works if the argument is a string', () => {
    const notString = ['world'];

    expect(() => ss.jSExpression(notString)).to.throw();
  });

  it('returns an atom if the argument is a string representing an atom', () => {
    const string = 'hello';

    expect(ss.isAtom(ss.jSExpression(string))).to.equal(true);
  });

  it('...and a list if it is a string representing a list', () => {
    const string = '(hello world)';

    expect(ss.isList(ss.jSExpression(string))).to.equal(true);
  });

  it('returns a number, rather than a string, for any numbers in the argument', () => {
    const string = '(5 cookies)';

    expect(ss.isNumber(ss.car(ss.jSExpression(string)))).to.equal(true);
  });

  it('surrounds a list in parentheses if none were supplied, but does not do so if they were', () => {
    const string = '(hello world)';

    expect(ss.jSExpression(string)).to.eql(['hello', 'world']);
  });

  it('converts #t to Boolean true', () => {
    const string = '#t';

    expect(ss.jSExpression(string)).to.equal(true);
  });

  it('converts #f to Boolean false', () => {
    const string = '#f';

    expect(ss.jSExpression(string)).to.equal(false);
  });

  it('handles the null list', () => {
    const string = '()';

    expect(ss.jSExpression(string)).to.eql([]);
  });

  it('handles grammatical symbols, so it can be used for sentence composition. Note #n is used for newline', () => {
    const string = '(#n \' \\ / | " , : . ... & - )';

    expect(ss.jSExpression(string)).to.eql(['\n', '\'', '\\', '/', '|', '"', ',', ':', '.', '...', '&', '-']);
  });

  it('handles other special JS types', () => {
    const string = '(#null #Infinity #NaN #undefined)';

    expect(ss.jSExpression(string)).to.eql([null, Infinity, NaN, undefined]);
  });
});

describe('evaluate', () => {
  it('converts special symbols back from JS to Scheme', () => {
    const input = [null, Infinity, NaN, undefined];

    expect(ss.evaluate(input, true, false, true)).to.equal('( #null #Infinity #NaN #undefined )');
  });
})
