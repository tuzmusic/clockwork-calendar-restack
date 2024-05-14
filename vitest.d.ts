interface CustomMatchers<R = unknown> {
  toEqualIgnoringWhitespace: () => R
}

declare module 'vitest' {
  type Assertion<T = any> = CustomMatchers<T>
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
