let store = {};
export const mockStorage = {
  getItem: (key: string): string => (key in store ? store[key] : null),

  setItem: (key: string, value: string) => {
    store[key] = `${value}`;
  },

  clear: () => {
    store = {};
  },
};

export const useMockStorage = () => {
  spyOn(localStorage, 'getItem').and.callFake(mockStorage.getItem);
  spyOn(localStorage, 'setItem').and.callFake(mockStorage.setItem);
  spyOn(localStorage, 'clear').and.callFake(mockStorage.clear);
};
