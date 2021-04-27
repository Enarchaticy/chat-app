let store = {};
export const mockStorage = {
  getItem: (key: string): string => (key in store ? store[key] : null),

  setItem: (key: string, value: string) => {
    store[key] = `${value}`;
  },

  removeItem: (key: string) => {
    delete store[key];
  },

  clear: () => {
    store = {};
  },

  length: (): number => Object.keys(store).length,
};

export const useMockStorage = () => {
  spyOn(localStorage, 'getItem').and.callFake(mockStorage.getItem);
  spyOn(localStorage, 'setItem').and.callFake(mockStorage.setItem);
  spyOn(localStorage, 'removeItem').and.callFake(mockStorage.removeItem);
  spyOn(localStorage, 'clear').and.callFake(mockStorage.clear);
  /* spyOn(localStorage, 'length').and.callFake(mockStorage.length); */
};
