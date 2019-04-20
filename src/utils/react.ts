/**
 * @author Niklas Korz
 */

export const selectOnFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
  e.currentTarget.select();
};
