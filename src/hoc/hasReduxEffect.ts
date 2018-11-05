import {
  compose,
  withState,
  withPropsOnChange,
  mapProps,
  setDisplayName,
  wrapDisplayName
} from "recompose";
import { connect } from "react-redux";
import { values } from "lodash/fp";
import { RematchStore } from "@rematch/core";

export const hasReduxEffect = <TDispatch, TProps extends Object>(
  dispatchEffect: (
    dispatch: TDispatch,
    props: TProps
  ) => Promise<any> | { [key: string]: Promise<any> },
  shouldDispatchOrKeys:
    | Array<string>
    | ((props: TProps, nextProps: TProps) => boolean) = []
) => BaseComponent =>
  compose(
    connect(),
    setDisplayName(wrapDisplayName(BaseComponent, "hasReduxEffect")),
    withState("isLoading", "setIsLoading", true),
    setDisplayName(wrapDisplayName(BaseComponent, "withWatchedProps")),
    withPropsOnChange(
      shouldDispatchOrKeys,
      ({ dispatch, setIsLoading, ...rest }) => {
        const dispatched = dispatchEffect(dispatch, rest as TProps);
        if (dispatched) {
          if (dispatched.then) {
            dispatched.then(() => setIsLoading(false));
            return { effect: dispatched };
          } else {
            Promise.all(values(dispatched)).then(() => setIsLoading(false));
            return dispatched;
          }
        }
      }
    ),
    mapProps(({ dispatch, setIsLoading, ...rest }) => rest)
  )(BaseComponent);

// TODO: how do I curry types?
export const createHasReduxEffect = (store: RematchStore) =>
  hasReduxEffect<typeof store.dispatch>

export default hasReduxEffect;
