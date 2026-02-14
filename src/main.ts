export function DoNothing(arg = 'unused'): string {
  console.log(`arg is "${arg}"`);
  return 'Nothing was done.';
}
