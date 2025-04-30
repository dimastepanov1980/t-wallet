import localforage from 'localforage';

export const stores = {
    auth: localforage.createInstance({
      name: 't-wallet',
      storeName: 'auth',
      description: 'T-Wallet authentication storage'
    }),
    
    accounts: localforage.createInstance({
      name: 't-wallet',
      storeName: 'accounts',
      description: 'T-Wallet accounts storage'
    })
  };