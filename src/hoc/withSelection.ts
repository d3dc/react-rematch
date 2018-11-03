import { setDisplayName, wrapDisplayName } from "recompose";
import { RematchStore, RematchAsyncDispatcher } from "@rematch/core";
import { Selector } from "@rematch/select";
import { Provider, connect } from "react-redux";
import { Component, createFactory } from "react";

// Creates a HOC that calls connect with select
export const connectWithSelect = <TSelect>(
  select: TSelect
) => BaseComponent => (
  mapModelsToSelection: (models: TSelect) => { [key: string]: Selector }
) =>
  connect(
    select(mapModelsToSelection),
    mapDispatchToProps
  )(BaseComponent);

// Lazy HOC that uses context to create a `connectWithSelect` HOC
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
        this._factory = connectWithSelect<TSelect>(this.context.store.select)(
          mapModelsToSelection
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
