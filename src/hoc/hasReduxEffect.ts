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

export const hasReduxEffect = <TDispatch, TProps = any>(
  mapDispatchToEffect: (
    dispatch: TDispatch,
    props: TProps
  ) => Promise | { [key: string]: Promise },
  shouldMapOrKeys:
    | Array<string>
    | ((props: TProps, nextProps: TProps) => boolean) = []
) => BaseComponent =>
  compose(
    connect(),
    setDisplayName(wrapDisplayName(BaseComponent, "hasReduxEffect")),
    withState("isLoading", "setIsLoading", true),
    setDisplayName(wrapDisplayName(BaseComponent, "withWatchedProps")),
    withPropsOnChange(
      shouldMapOrKeys,
      ({ dispatch, setIsLoading, ...rest }) => {
        const dispatched = mapDispatchToEffect(dispatch, rest);
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
