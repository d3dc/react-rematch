import { RematchStore } from "@rematch/core";

import { createWithRedux } from "./hoc/withRedux";
import { createWithModels } from "./hoc/withModels";
import { createWithSelection } from "./hoc/withSelection";
import { createHasReduxEffect } from "./hoc/hasReduxEffect";

export const createBindings = (store: RematchStore) => ({
  withRedux: createWithRedux(store),
  withModels: createModels(store),
  withSelection: createWithSelection(store),
  hasReduxEffect: createHasReduxEffect(store)
});

export default createBindings;
