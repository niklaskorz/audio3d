/**
 * Useful utility functions related to mathematics
 * @author Niklas Korz
 */

// Converts radiant angles to degrees
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

// Converts degree angles to radiants
export const degToRad = (deg: number): number => (deg / 180) * Math.PI;

export const roundToPrecision = (value: number, precision: number): number =>
  Math.round(value / precision) * precision;
