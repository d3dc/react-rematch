import { RematchStore } from "@rematch/core";

import withRedux from "./hoc/withRedux";
import withModels from "./hoc/withModels";
import hasReduxEffect from "./hoc/hasReduxEffect";
import { connectWithSelect } from "./hoc/withSelection";

export const createBindings = (store: RematchStore) => ({
  withRedux,
  withModels,
  withSelection: connectWithSelect(store.select),
  hasReduxEffect: hasReduxEffect as hasReduxEffect<typeof store.dispatch>
});

export default createBindings;
