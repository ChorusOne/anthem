import { ParsedQuery } from "query-string";

import { BANNER_NOTIFICATIONS_KEYS } from "modules/app/store";

/** ===========================================================================
 * Locale Storage Module.
 *
 * This file manages getting and setting values from the Browser localStorage.
 * ============================================================================
 */

enum KEYS {
  ADDRESS_KEY = "ADDRESS_KEY",
  RECENT_ADDRESSES = "RECENT_ADDRESSES",
  DISMISSED_NOTIFICATIONS = "DISMISSED_NOTIFICATIONS",
}

class StorageClass {
  /**
   * Primary getter/setter methods:
   */
  getItem = <T extends {}>(key: KEYS): Nullable<T> => {
    const maybeValue = localStorage.getItem(key);
    return maybeValue ? JSON.parse(maybeValue) : null;
  };

  setItem = (key: KEYS, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  removeItem = (key: KEYS) => {
    localStorage.removeItem(key);
  };

  /**
   * Stored Address:
   */
  getAddress = (queryParams: ParsedQuery<string>): string => {
    const addressParam = queryParams.address;

    if (typeof addressParam === "string") {
      return addressParam;
    } else {
      const address = this.getItem(KEYS.ADDRESS_KEY);
      if (address) {
        if (typeof address === "string") {
          return address;
        }
      }
    }

    return "";
  };

  setAddress = (address: string) => {
    this.setItem(KEYS.ADDRESS_KEY, address);
  };

  logout = () => {
    /**
     * Only remove the stored address. The other options are not sensitive
     * and can remain here (in case the user logs back in).
     */
    this.removeItem(KEYS.ADDRESS_KEY);
  };

  getRecentAddresses = () => {
    const recentAddresses = this.getItem<ReadonlyArray<string>>(
      KEYS.RECENT_ADDRESSES,
    );
    if (Array.isArray(recentAddresses) && recentAddresses.length) {
      return recentAddresses;
    } else {
      return [];
    }
  };

  clearRecentAddresses = () => {
    this.setItem(KEYS.RECENT_ADDRESSES, []);
  };

  updateRecentAddress = (address: string) => {
    const updatedRecentAddresses: ReadonlyArray<string> = [
      address,
      ...this.getRecentAddresses().filter((a: string) => a !== address),
    ];

    this.setItem(KEYS.RECENT_ADDRESSES, updatedRecentAddresses);
  };

  getDismissedNotifications = (): Set<BANNER_NOTIFICATIONS_KEYS> => {
    const dismissed = this.getItem<ReadonlyArray<string>>(
      KEYS.DISMISSED_NOTIFICATIONS,
    );
    if (dismissed && dismissed.length) {
      return new Set(dismissed) as Set<BANNER_NOTIFICATIONS_KEYS>;
    } else {
      return new Set();
    }
  };

  handleDismissNotification = (banner: BANNER_NOTIFICATIONS_KEYS) => {
    const dismissed = this.getDismissedNotifications();
    const updated = dismissed.add(banner);
    this.setItem(KEYS.DISMISSED_NOTIFICATIONS, Array.from(updated));
  };
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const StorageModule = new StorageClass();

export default StorageModule;
