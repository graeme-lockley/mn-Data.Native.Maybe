
A `Maybe` can help with passing, storing or returning optional values.

Although not strictly a native this package provides a very simple implementation of a null-pointer
replacement.  This package is necessary as one of the key objectives of the suite of native packages
is to remove all use of null and undefined values.  In order to achieve this it is necessary to be
able to sensibly accommodate these values in a consistent manner.

### reduce

```haskell
Maybe a =>reduce :: (() -> b) -> (a -> b) -> b
```

The nothing value which corresponds to a null, undefined value or the value is not present.
A constructor which is used to box a non-null value.
The `Maybe` reduction function accepts a reduction function for each of the two `Maybe` values
and then reduces the `Maybe` value to a single type.

```haskell
Nothing.reduce(() => 0)(v => 1) == 0
```
```haskell
Just(10).reduce(() => 0)(v => 1) == 1
```
```haskell
Just(10).reduce(() => 0)(v => v) == 10
```


### isJust

```haskell
Maybe a => isJust :: () -> Bool
```

Returns `true` if the `Maybe` value has been constructed using `Just` otherwise returns `false`.

```haskell
Nothing.isJust() == false
```
```haskell
Just(100).isJust() == true
```


### isNothing

```haskell
Maybe a => isNothing :: () -> Bool
```

Returns `false` if the `Maybe` value has been constructed using `Just` otherwise returns `true`.

```haskell
Nothing.isNothing() == true
```
```haskell
Just(100).isNothing() == false
```


### map

```haskell
Maybe a => map :: (a -> b) -> Maybe b
```

Applies the function `f` to the `Maybe` boxed value.

```haskell
Nothing.map(x => x * 2) == Nothing
```
```haskell
Just(10).map(x => x * 2) == Just(20)
```


### withDefault

```haskell
Maybe a => withDefault :: a -> a
```

Returns the boxed value if this `Maybe` was constructed with a value otherwise returns the `defaultValue`.

```haskell
Nothing.withDefault(10) == 10
```
```haskell
Just(100).withDefault(10) == 100
```


### then

```haskell
Maybe a => then :: (a -> Maybe b) -> Maybe be
```

Should the `Maybe` have a boxed value then the passed function is applied to this boxed value.  Note that the passed
function needs to return another `Maybe`.

```haskell
Nothing.then(v => Just(v + 5)) == Nothing
```
```haskell
Just(10).then(v => Just("p" + (v + 5))) == Just("p15")
```
```haskell
Just(10).then(v => Nothing) == Nothing
```


### catch

```haskell
Maybe a => catch :: (() -> Maybe a) -> Maybe a
```

Provides the ability to map a `Maybe` from a `Nothing` into a `Just`.

```haskell
Nothing.catch(() => Just(100)) == Just(100)
```
```haskell
Just(10).catch(() => Just(100)) == Just(10)
```


