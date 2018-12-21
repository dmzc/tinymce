/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Cell, Results, Arr } from '@ephox/katamari';
import { PatternSet, createPatternSet, normalizePattern, RawPattern } from './Pattern';

const get = (patternsState: Cell<PatternSet>) => {
  const setPatterns = (newPatterns: RawPattern[]) => {
    const normalized = Results.partition(Arr.map(newPatterns, normalizePattern));
    if (normalized.errors.length > 0) {
      const firstError = normalized.errors[0];
      throw new Error(firstError.message + ':\n' + JSON.stringify(firstError.pattern, null, 2));
    }
    patternsState.set(createPatternSet(normalized.values));
  };

  const getPatterns = () => {
    // TODO should probably denormalize here
    return [
      ...patternsState.get().inlinePatterns,
      ...patternsState.get().blockPatterns,
    ];
  };

  return {
    setPatterns,
    getPatterns
  };
};

export default {
  get
};