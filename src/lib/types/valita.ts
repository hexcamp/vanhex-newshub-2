import { isDid, isNsid, isRecordKey } from '@atcute/lexicons/syntax';

import * as v from '@badrap/valita';

export const didString = v.string().assert(isDid);

export const nsidString = v.string().assert(isNsid);

export const recordKeyString = v.string().assert(isRecordKey);

export const integer = v.number().assert((input) => Number.isSafeInteger(input) && input >= 0);
