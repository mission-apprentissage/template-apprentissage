import { ObjectId } from "mongodb";
import type { IApiKeyPrivate, IUser } from "shared/models/user.model";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

import config from "@/config";
import { getDbCollection } from "@/services/mongodb/mongodbService";
import { generateKey, generateSecretHash } from "@/utils/cryptoUtils";
import { createUserTokenSimple } from "@/utils/jwtUtils";

export const updateUser = async (email: IUser["email"], data: Partial<IUser>): Promise<void> => {
  await getDbCollection("users").findOneAndUpdate(
    {
      email,
    },
    {
      $set: { ...data, updated_at: new Date() },
    }
  );
};

export const generateApiKey = async (
  name: string,
  user: IUser
): Promise<IApiKeyPrivate & { value: string; key: string }> => {
  const now = new Date();
  const generatedKey = generateKey();
  const secretHash = generateSecretHash(generatedKey);

  const data = {
    _id: new ObjectId(),
    name:
      name ||
      uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: "-",
      }),
    key: secretHash,
    last_used_at: null,
    expires_at: new Date(now.getTime() + config.api_key.expiresIn),
    created_at: now,
  };

  await getDbCollection("users").findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: { updated_at: new Date() },
      $push: {
        api_keys: data,
      },
    }
  );

  const token = createUserTokenSimple({
    payload: { _id: user._id, api_key: generatedKey },
    expiresIn: config.api_key.expiresIn / 1_000,
  });

  return {
    ...data,
    value: token,
  };
};

export async function deleteApiKey(id: ObjectId, user: IUser) {
  await getDbCollection("users").findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: { updated_at: new Date() },
      $pull: {
        api_keys: { _id: id },
      },
    }
  );
}
