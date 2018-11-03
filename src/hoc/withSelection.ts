import { setDisplayName, wrapDisplayName } from "recompose";
import { RematchStore, RematchAsyncDispatcher } from "@rematch/core";
import { Selector, Provider, connect } from "react-redux";
import { Component, createFactory } from "react";

export const createWithSelection = (store: RematchStore) => (
  mapModelsToSelection: (
    models: typeof store.select
  ) => { [key: string]: Selector },
  mapDispatchToProps: (
    dispatch: typeof store.dispatch
  ) => { [key: string]: RematchAsyncDispatcher }
) => BaseComponent =>
  connect(
    store.select(mapModelsToSelection),
    mapDispatchToProps
  )(BaseComponent);

// Lazy HOC that uses context to call `createWithSelection`
export const withSelection = <TSelect, TDispatch>(
  mapModelsToSelection: (models: TSelect) => { [key: string]: Selector },
  mapDispatchToProps: (
    dispatch: TDispatch
  ) => { [key: string]: RematchAsyncDispatcher }
) => BaseComponent => {
  const wrapper = class extends Component {
    static contextTypes = Provider.childContextTypes;
    _factory = null;
    get factory() {
      if (!this._factory) {
        this._factory = createWithSelection(this.context.store)(
          mapModelsToSelection,
          mapDispatchToProps
        )(BaseComponent);
      }
      return this._factory;
    }
    render() {
      return this.factory(this.props);
    }
  };

  if (process.env.NODE_ENV !== "production") {
    return setDisplayName(wrapDisplayName(BaseComponent, "withSelection"))(
      wrapper
    );
  }

  return wrapper;
};
