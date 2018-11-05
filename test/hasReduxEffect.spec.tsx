import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import { init, RematchStore } from "@rematch/core";
import hasReduxEffect from "../src/hoc/hasReduxEffect";

function createStore(): [RematchStore, any] {
  const run = jest.fn();
  const store = init({
    models: {
      test: {
        state: {},
        effects: {
          run
        }
      }
    }
  });
  return [store, run];
}

const usesCount = () => {
  let count = 0;
  return [() => count, () => ++count];
};

describe("hasReduxEffect:", () => {
  test("should add props", () => {
    const [store, run] = createStore();

    const Wrapped = hasReduxEffect<typeof store.dispatch, {}>(dispatch => {
      test: dispatch.test.run(null);
    })(() => <div />);
    const wrapper = shallow(
      <Provider store={store}>
        <Wrapped data-test-id="wrapped" />
      </Provider>
    );

    expect(wrapper.getByTestId("wrapped").prop("isLoading")).toBe(false);
    expect(typeof wrapper.getByTestId("wrapped").prop("effect")).toBe(Promise);
  });

  test("should merge result with props", () => {
    const [store, run] = createStore();
    const Wrapped = hasReduxEffect<typeof store.dispatch, {}>(dispatch => ({
      meat: dispatch.test.run(null),
      loaf: dispatch.test.run(null)
    }))(() => <div />);

    const wrapper = shallow(
      <Provider store={store}>
        <Wrapped data-test-id="wrapped" />
      </Provider>
    );

    expect(wrapper.getByTestId("wrapped").prop("isLoading")).toBe(false);
    expect(typeof wrapper.getByTestId("wrapped").prop("meat")).toBe(Promise);
    expect(typeof wrapper.getByTestId("wrapped").prop("loaf")).toBe(Promise);
  });

  test("should trigger an effect once", () => {
    const [store, run] = createStore();
    const [getCount, up] = usesCount();
    const Wrapped = hasReduxEffect<typeof store.dispatch, { count: number }>(
      dispatch => dispatch.test.run(null)
    )(() => <div />);

    const wrapper = shallow(
      <Provider store={store}>
        <Wrapped count={getCount()} />
      </Provider>
    );

    expect(run.mock.calls.length).toBe(1);
    up();
    wrapper.update();
    expect(run.mock.calls.length).toBe(1);
  });

  test("should trigger an effect on change", () => {
    const [store, run] = createStore();
    const [getCount, up] = usesCount();
    const Wrapped = hasReduxEffect<typeof store.dispatch, { count: number }>(
      dispatch => dispatch.test.run(null),
      ["count"]
    )(() => <div />);

    const wrapper = shallow(
      <Provider store={store}>
        <Wrapped count={getCount()} />
      </Provider>
    );

    expect(run.mock.calls.length).toBe(1);
    up();
    wrapper.update();
    expect(run.mock.calls.length).toBe(2);
    wrapper.update();
    expect(run.mock.calls.length).toBe(2);
  });
});
