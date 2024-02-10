import { basicInfo } from "./basicInfo";
import { servers } from "./servers";
import { components } from "./components";
import { tags } from "./tags";
import { operations } from "./paths";

export const docs = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...operations,
};
