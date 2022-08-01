import { Greeting } from '../src/App';

test('Greeting', () => {
  expect(Greeting('')).toBe('Hello!');
  expect(Greeting('WORLD')).toBe('Hello World!');
});
