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

// TODO: how do I curry types?
export const createHasReduxEffect = (store: RematchStore) =>
  hasReduxEffect as hasReduxEffect<typeof store.dispatch>;

// TODO: shouldDispatchOrKeys doesn't work the same as `useEffect` in react 16.7
export const hasReduxEffect = <TDispatch, TProps = any>(
  dispatchEffect: (
    dispatch: TDispatch,
    props: TProps
  ) => Promise | { [key: string]: Promise },
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
        const dispatched = dispatchEffect(dispatch, rest);
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

export default hasReduxEffect;
