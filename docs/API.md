# react-rematch API

### createBindings

```ts
(
  store: RematchStore
): ReactBindings
```

Creates an object with all HOCs pre-bound to `store`'s types.

## Higher-Order Components

### withRedux

```ts
(
    mapStateToProps: (state: TRootState) => {},
    mapDispatchToProps: (dispatch: TDispatch) => {}
): HigherOrderComponentFactory
```

Just re-exports connect with a descriptive name.

### withModels

```ts
(
  ...models: [Model | string]
): HigherOrderComponentFactory
```

Connects the passed models as full slices with state and dispatch.

### withSelection

```ts
(
  mapModelsToSelection: (models: TSelect) => { [key: string]: Selector },
  mapDispatchToProps: (
    dispatch: TDispatch
  ) => { [key: string]: RematchAsyncDispatcher }
): HigherOrderComponentFactory
```

Uses the store's `select` function to build `mapStateToProps` before calling connect.

### hasReduxEffect

```ts
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
