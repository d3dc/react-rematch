import { Model } from "@rematch/core";
import { connect } from "react-redux";
import pick from "lodash/fp/pick";

// TODO: there are types here right?
export const createWithModels = store => withModels;

export const withModels = (...models: Array<Model | string>) => {
  const pickModels = pick(models.map(m => m.name || m));
  return connect(
    pickModels,
    pickModels
  );
};

export default withModels;
