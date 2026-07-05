import { jest } from '@jest/globals';
import { appEventEmitter } from '../src/common/utils/AppEventEmitter';
import { LanguageService } from '../src/services/logic/languageSerivce';
import { LanguageCode, StorageKey } from 'one-frontend-framework';

describe('AppEventEmitter', () => {
  beforeEach(() => {
    appEventEmitter.removeAll();
  });

  test('on -> emit -> off works', () => {
    const fn = jest.fn();
    appEventEmitter.on('evt', fn);
    appEventEmitter.emit('evt', 1, 'a');
    expect(fn).toHaveBeenCalledWith(1, 'a');
    expect(fn).toHaveBeenCalledTimes(1);

    appEventEmitter.off('evt', fn);
    appEventEmitter.emit('evt', 2);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('LanguageService (unit)', () => {
  test('initLanguage falls back to default when storage missing', async () => {
    const svc = new LanguageService();
    svc.storeService = { getObject: jest.fn().mockResolvedValue(undefined), saveObject: jest.fn() } as any;
    await svc.initLanguage();
    // text should be set to some object (default VI)
    expect(svc.text).toBeDefined();
  });

  test('setLanguage persists normalized language and updates text', async () => {
    const svc = new LanguageService();
    const fakeStore = { getObject: jest.fn(), saveObject: jest.fn().mockResolvedValue(true) } as any;
    svc.storeService = fakeStore;
    await svc.setLanguage(LanguageCode.EN);
    expect(fakeStore.saveObject).toHaveBeenCalledWith(StorageKey.language, LanguageCode.EN);
    expect(svc.text).toBeDefined();
  });

  test('setLanguage handles storage failures gracefully', async () => {
    const svc = new LanguageService();
    const fakeStore = { getObject: jest.fn(), saveObject: jest.fn().mockRejectedValue(new Error('boom')) } as any;
    svc.storeService = fakeStore;
    await expect(svc.setLanguage('invalid' as string)).resolves.toBeUndefined();
    // should still update in-memory text
    expect(svc.text).toBeDefined();
  });
});