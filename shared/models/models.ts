import { z } from "zod";

import { IModelDescriptor } from "./common";
import emailDeniedModel from "./email_denied.model";
import emailEventModel from "./email_event.model";
import sessionModel from "./session.model";
import userModel from "./user.model";

export const modelDescriptorMap = {
  [sessionModel.collectionName]: sessionModel,
  [userModel.collectionName]: userModel,
  [emailEventModel.collectionName]: emailEventModel,
  [emailDeniedModel.collectionName]: emailDeniedModel,
};

export const modelDescriptors = Object.values(
  modelDescriptorMap
) as (typeof modelDescriptorMap)[keyof typeof modelDescriptorMap][] satisfies IModelDescriptor[];

export type CollectionName = keyof typeof modelDescriptorMap;

export type IDocument<Name extends CollectionName> = z.output<(typeof modelDescriptorMap)[Name]["zod"]>;
