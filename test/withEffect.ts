import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import { init } from "@rematch/core";
import { withEffect, withModels, withSelection, withStore } from "../src";

const createStore = () => {
  const run = jest.fn();
  const store = init({
    models: {
      test: {
        effects: {
          run
        }
      }
    }
  });
  return [store, run];
};

describe("withEffect:", () => {
  test("should trigger an effect once", () => {
    const Wrapped = withEffect(dispatch => dispatch.test.run())(() => <div />);
    const [store, run] = createStore();

    const wrapper = shallow(
      <Provider store={store}>
        <Wrapped />
      </Provider>
    );

    expect(run.mock.calls.length).toBe(1);
    // TODO: trigger a change
    expect(run.mock.calls.length).toBe(1);
  });

  test("should trigger an effect on change", () => {
    const Wrapped = withEffect(dispatch => dispatch.test.run())(() => <div />);
    const [store, run] = createStore();

    const wrapper = shallow(
      <Provider store={store}>
        <Wrapped />
      </Provider>
    );

    expect(run.mock.calls.length).toBe(1);
    // TODO: trigger a change
    expect(run.mock.calls.length).toBe(2);
    // TODO: trigger a change
    expect(run.mock.calls.length).toBe(2);
  });
});
