import {describe,it,expect} from 'vitest';
import {actionBucket,stageAgeDays,istanbulInput} from './sales-execution';
import {parseDealAction,parseDealInput} from './validation';

describe('sales execution deadlines',()=>{
  const now=new Date('2026-09-28T20:30:00Z');
  it('uses disjoint queues across Istanbul midnight',()=>{
    expect(actionBucket('2026-09-28T20:29:00Z',now)).toBe('overdue');
    expect(actionBucket('2026-09-28T20:30:00Z',now)).toBe('today');
    expect(actionBucket('2026-09-28T20:59:00Z',now)).toBe('today');
    expect(actionBucket('2026-09-28T21:00:00Z',now)).toBe('next');
    expect(actionBucket(null,now)).toBe('missing');
  });
  it('round trips Istanbul input and measures elapsed whole days',()=>{
    expect(istanbulInput('2026-09-28T21:00:00Z')).toBe('2026-09-29T00:00');
    expect(stageAgeDays('2026-09-26T20:30:00Z',now)).toBe(2);
  });
  it('requires a real owner and explicit action and calendar date',()=>{
    const f=new FormData();
    f.set('leadId','92bde023-eb4c-4fa5-a6ac-4f479228d361');f.set('title','Pilot');
    expect(parseDealInput(f)).toBeNull();
    f.set('ownerUserId','92bde023-eb4c-4fa5-a6ac-4f479228d361');
    f.set('nextAction','  Call buyer  ');f.set('nextActionAt','2026-09-29T00:00');
    expect(parseDealInput(f)).toMatchObject({nextAction:'Call buyer',nextActionAt:'2026-09-28T21:00:00.000Z'});
    f.set('nextActionAt','2026-02-30T12:00');expect(parseDealAction(f)).toBeNull();
    f.set('nextActionAt','2026-09-29T00:00');f.set('nextAction',' '.repeat(4));expect(parseDealAction(f)).toBeNull();
    f.set('nextAction','x'.repeat(301));expect(parseDealAction(f)).toBeNull();
  });
});
