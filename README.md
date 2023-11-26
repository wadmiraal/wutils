JS Utilities and Experiments
============

**Please don't use this.** This is just some experiments to build a custom utility library, without using any external libs. **Even I wouldn't use it in production.**

Then why?
---------

It's interesting to build you own tools, even if you're not going to use them. It can teach you a lot about the inner workings of a language, as well as make you question established conventions or assumptions. It's the reason [I made Bunit](https://github.com/wadmiraal/bunit), a unit-testing library for Bash (please don't use it in production either).

### Question established conventions or assumptions?

Yes. For instance, many tools will introduce useful features, but that you don't need 80% of the time. Or at least, presented with a simpler version, you could still do all you need to do, provided you make a little more effort as a user.

Take Jasmine's [`spyOn`](https://jasmine.github.io/api/3.6/global.html#spyOn) utility. It's brilliantly well designed, and provides many nifty features that make tests easier to write, like matching arguments ([`withArgs`](https://jasmine.github.io/api/3.6/Spy.html#withArgs)) and determining a return value based on those arguments.

Yet, in many cases, you just want to know 1 thing: whether a method was called (and, maybe, what arguments were provided).

This is [much simpler to achieve](src/wunit/spy.js), and still provides a lot of value.

Of course, sometimes it's not so much about knowing if something was called, but mocking its behaviour. And here again, if you remove things like pattern matching against arguments, return value stacking, you can actually [do this](src/wunit/hijack.js) for a fraction of the cost. And splitting it from the "spying" makes it easier to maintain, and keeps responsibilities clear and simple. Of course, this doesn't mean they're [mutually exclusive](tests/wcli/output.test.js), either.

And notice you don't _lose_ any functionality; you just have to do a little more work yourself to achieve more complex scenarios (like pattern matching against arguments). But the maintenance cost, and stability, of the library/utility becomes very interesting. Would you rather use a small, highly stable library in your code? Or a large, prone-to-bugs one?

Another one such "convention" is the usage of test runners. Why would you need a test runner per-se? Sure, it's handy. And if it provides a watcher, that's even better. But if you write it in such a way that the test file simply executes immediately when run with _node_, you can skip a whole lot of maintenance cost.

Or could `test()` and assertion functions be pure? Do they need to throw exceptions, just so some form of "state" can be passed around? Does a test need to "know" what happens inside of it? Or could they simply return the results, letting someone else do the heavy lifting? For instance, [here](tests/wunit/wunit.test.js), only `define()` is "impure", and manages the display of the test report. `test()`, `assertEqual()` and `assertNotEqual()` only return something based on the given parameters, and themselves don't manage any state. Sure, the syntax [looks a bit odd](tests/wperf/memo.test.js) if you're used to other testing libraries. But considering [this is the entire testing "framework"](src/wunit/wunit.js), I think it's interesting to consider the tradeoff of such a different syntax.

### So you're saying this should actually be used?

No. I'll continue to use [Jasmine](https://jasmine.github.io/index.html), [Lodash](https://lodash.com/), etc, for my projects. They're extremely well designed and built, and I love them.

It's just interesting to see how things could be done differently, and what we would gain from it.
