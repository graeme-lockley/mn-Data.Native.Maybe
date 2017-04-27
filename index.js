//- Although not strictly a native this package provides a very simple implementation of a null-pointer
//- replacement.  This package is necessary as one of the key objectives of the suite of native packages
//- is to remove all use of null and undefined values.  In order to achieve this it is necessary to be
//- able to sensibly accommodate these values in a consistent manner.


function MaybeState(content) {
    this.content = content;
}


//- The nothing value which corresponds to a null or undefined value.
const Nothing = new MaybeState([0]);


//- A constructor which is used to box a non-null value.
const Just = content => new MaybeState([1, content]);


//- The `Maybe` reduction function which accepts reduction functions for each of the two `Maybe` values will 
//- and reduces the `Maybe` value to a single type.
//= Maybe a . reduce :: (() -> b) -> (a -> b) -> b
MaybeState.prototype.reduce = function(fNothing) {
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
//= Maybe a . isJust :: () -> Bool
MaybeState.prototype.isJust = function() {
    return this.reduce(() => false)(_ => true);
};
assumptionEqual(Nothing.isJust(), false);
assumptionEqual(Just(100).isJust(), true);


//- Returns `false` if the `Maybe` value has been constructed using `Just` otherwise returns `true`.
//= Maybe a . isNothing :: () -> Bool
MaybeState.prototype.isNothing = function() {
    return this.reduce(() => true)(_ => false);
};
assumptionEqual(Nothing.isNothing(), true);
assumptionEqual(Just(100).isNothing(), false);



//- Applies the function `f` to the `Maybe` boxed value.
//= Maybe a . map :: (a -> b) -> Maybe b
MaybeState.prototype.map = function(f) {
    return this.reduce(() => Nothing)(x => Just(f(x)));
};
assumptionEqual(Nothing.map(x => x * 2), Nothing);
assumptionEqual(Just(10).map(x => x * 2), Just(20));


//- Returns the boxed value if this `Maybe` was constructed with a value otherwise returns the `defaultValue`.
//= Maybe a . withDefault :: a -> a
MaybeState.prototype.withDefault = function(defaultValue) {
    return this.reduce(() => defaultValue)(x => x);
};
assumptionEqual(Nothing.withDefault(10), 10);
assumptionEqual(Just(100).withDefault(10), 100);


module.exports = {
    Nothing,
    Just
};
