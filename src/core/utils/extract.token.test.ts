import { extractToken } from 'src/core/utils/extract.token';

describe('Extract token', () => {
  it('should extract the token', () => {
    expect(extractToken('Basic 123')).toEqual('123');
    expect(extractToken('test 456')).toEqual(null);
    expect(extractToken('zaeazeaze')).toEqual(null);
    expect(extractToken(' ')).toEqual(null);
  });
});
