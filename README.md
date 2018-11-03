# react-rematch

React bindings for Rematch's flavor of Redux

## API

### createBindings

```
(
  store: RematchStore
): ReactBindings
```

Creates an object with all HOCs pre-bound to `store`'s types.

### withRedux

```
(
    mapStateToProps: (state: TRootState) => {},
    mapDispatchToProps: (dispatch: TDispatch) => {}
): HigherOrderComponentFactory
```

Just re-exports connect with a descriptive name.

### withModels

```
(
  ...models: [Model | string]
): HigherOrderComponentFactory
```

Connects the passed models as full slices with state and dispatch.

### withSelection

```
(
  mapModelsToSelection: (models: TSelect) => { [key: string]: Selector },
  mapDispatchToProps: (
    dispatch: TDispatch
  ) => { [key: string]: RematchAsyncDispatcher }
): HigherOrderComponentFactory
```

Uses the store's `select` function to build `mapStateToProps` before calling connect.

### hasReduxEffect

```
(
  dispatchEffect: (
    dispatch: TDispatch,
    props: TProps
  ) => Promise | { [key: string]: Promise },
  shouldDispatchOrKeys:
    | Array<string>
    | ((props: TProps, nextProps: TProps) => boolean) = []
): HigherOrderComponentFactory
```

Calls `dispatchEffect` when the wrapped component is first mounted. Effects can be repeated by passing an array of prop keys to watch or a predicate to call when `props` changes.