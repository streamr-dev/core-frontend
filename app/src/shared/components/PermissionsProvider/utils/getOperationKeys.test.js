import { GET, EDIT } from '../operations'
import gok from './getOperationKeys'

it('translates empty combination into []', () => {
    expect(gok(0)).toEqual([])
})

it('translates combination into an array of keys of combined operations', () => {
    expect(gok(GET + EDIT).sort()).toEqual(['EDIT', 'GET'])
})
