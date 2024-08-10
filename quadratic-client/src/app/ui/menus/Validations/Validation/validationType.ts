import { Validation } from '@/app/quadratic-core-types';

export type ValidationRuleSimple = 'text' | 'number' | 'list' | 'list-range' | 'logical' | 'none' | '';
export type ValidationUndefined = Validation | Omit<Validation, 'rule'> | undefined;

// Converts a Validation to a ValidationRuleSimple (to make it easier to work with)
export const validationRuleSimple = (validation?: ValidationUndefined): ValidationRuleSimple => {
  if (!validation || !('rule' in validation) || !validation.rule) return '';
  const rule = validation.rule;
  if (rule === 'None') return 'none';
  if ('List' in rule) {
    if ('source' in rule.List) {
      if ('List' in rule.List.source) return 'list';
      if ('Selection' in rule.List.source) return 'list-range';
    }
    return 'list';
  } else if ('Logical' in rule) {
    return 'logical';
  } else if ('Text' in rule) {
    return 'text';
  } else if ('Number' in rule) {
    return 'number';
  }
  throw new Error('Invalid rule in useValidationData');
};
