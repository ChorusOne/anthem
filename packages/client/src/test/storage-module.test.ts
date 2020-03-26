import StorageModule from "lib/storage-lib";

describe("storage-utils", () => {
  test("localStorage address", () => {
    const address = "cosmos16nte2qf5l0u39s86wcwu4fff4vdtvg7yn3uksu";
    let result = StorageModule.getAddress({});
    expect(result).toBe("");
    StorageModule.setAddress(address);
    result = StorageModule.getAddress({});
    expect(result).toBe(address);
  });

  test("localStorage recent addresses", () => {
    const address = "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350";
    const recentAddresses: ReadonlyArray<string> = [
      "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg",
      "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
      "cosmos16nte2qf5l0u39s86wcwu4fff4vdtvg7yn3uksu",
    ];

    let result = StorageModule.getRecentAddresses();
    expect(result).toEqual([]);

    for (const addr of recentAddresses) {
      StorageModule.updateRecentAddress(addr);
    }

    result = StorageModule.getRecentAddresses();

    // @ts-ignore
    const reversedAddresses = recentAddresses.reverse();
    expect(result).toEqual(reversedAddresses);

    StorageModule.updateRecentAddress(address);
    result = StorageModule.getRecentAddresses();
    expect(result).toEqual([address, ...reversedAddresses]);
  });
});
