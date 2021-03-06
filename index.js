//- A `Maybe` can help with passing, storing or returning optional values.
//-
//- Although not strictly a native this package provides a very simple implementation of a null-pointer
//- replacement.  This package is necessary as one of the key objectives of the suite of native packages
//- is to remove all use of null and undefined values.  In order to achieve this it is necessary to be
//- able to sensibly accommodate these values in a consistent manner.


function Maybe(content) {
    this.content = content;
}


//- The nothing value which corresponds to a null, undefined value or the value is not present.
//= Nothing :: Maybe a
const Nothing = new Maybe([0]);


//- A constructor which is used to box a non-null value.
//= Just :: a -> Maybe a
const Just = content => new Maybe([1, content]);


//- The `Maybe` reduction function accepts a reduction function for each of the two `Maybe` values
//- and then reduces the `Maybe` value to a single type.
//= Maybe a => reduce :: (() -> b) -> (a -> b) -> b
Maybe.prototype.reduce = function(fNothing) {
    return fJust => {
        switch (this.content[0]) {
            case 0: return fNothing();
            case 1: return fJust(this.content[1]);
        }
    };
};
assumptionEqual(Nothing.reduce(() => 0)(v => 1), 0);
assumptionEqual(Just(10).reduce(() => 0)(v => 1), 1);
assumptionEqual(Just(10).reduce(() => 0)(v => v), 10);


//- Returns `true` if the `Maybe` value has been constructed using `Just` otherwise returns `false`.
//= Maybe a => isJust :: () -> Bool
Maybe.prototype.isJust = function() {
    return this.reduce(() => false)(_ => true);
};
assumptionEqual(Nothing.isJust(), false);
assumptionEqual(Just(100).isJust(), true);


//- Returns `false` if the `Maybe` value has been constructed using `Just` otherwise returns `true`.
//= Maybe a => isNothing :: () -> Bool
Maybe.prototype.isNothing = function() {
    return this.reduce(() => true)(_ => false);
};
assumptionEqual(Nothing.isNothing(), true);
assumptionEqual(Just(100).isNothing(), false);



//- Applies the function `f` to the `Maybe` boxed value.
//= Maybe a => map :: (a -> b) -> Maybe b
Maybe.prototype.map = function(f) {
    return this.reduce(() => Nothing)(x => Just(f(x)));
};
assumptionEqual(Nothing.map(x => x * 2), Nothing);
assumptionEqual(Just(10).map(x => x * 2), Just(20));


//- Returns the boxed value if this `Maybe` was constructed with a value otherwise returns the `defaultValue`.
//= Maybe a => withDefault :: a -> a
Maybe.prototype.withDefault = function(defaultValue) {
    return this.reduce(() => defaultValue)(x => x);
};
assumptionEqual(Nothing.withDefault(10), 10);
assumptionEqual(Just(100).withDefault(10), 100);


//- Should the `Maybe` have a boxed value then the passed function is applied to this boxed value.  Note that the passed
//- function needs to return another `Maybe`.
//= Maybe a => then :: (a -> Maybe b) -> Maybe be
Maybe.prototype.then = function(f) {
    return this.reduce(() => Nothing)(v => f(v));
};
assumptionEqual(Nothing.then(v => Just(v + 5)), Nothing);
assumptionEqual(Just(10).then(v => Just("p" + (v + 5))), Just("p15"));
assumptionEqual(Just(10).then(v => Nothing), Nothing);


//- Provides the ability to map a `Maybe` from a `Nothing` into a `Just`.
//= Maybe a => catch :: (() -> Maybe a) -> Maybe a
Maybe.prototype.catch = function(f) {
    return this.reduce(() => f())(v => Just(v));
};
assumptionEqual(Nothing.catch(() => Just(100)), Just(100));
assumptionEqual(Just(10).catch(() => Just(100)), Just(10));


module.exports = {
    Nothing,
    Just
};
