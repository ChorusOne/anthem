import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { newKusamaApp } from "@zondax/ledger-polkadot";

/** ===========================================================================
 * Polkadot LedgerLib
 * ============================================================================
 */

class PolkadotLedgerClass {
  connect = async () => {
    const transport = await getTransport();
    const app = newKusamaApp(transport);

    const version = await app.getVersion();
    console.log(
      `App Version ${version.major}.${version.minor}.${version.patch}`,
    );
    console.log(`Device Locked: ${version.device_locked}`);
    console.log(`Test mode: ${version.test_mode}`);

    const pathAccount = 0x80000000;
    const pathChange = 0x80000000;
    const pathIndex = 0x80000000;
    const response = await app.getAddress(
      pathAccount,
      pathChange,
      pathIndex,
      true,
    );
    if (response.return_code !== 0x9000) {
      console.error(response.return_code);
      console.error(response.error_message);
    }
    console.log(response);
  };
}

const getTransport = async () => {
  const transport = await TransportWebUSB.create();
  return transport;
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default new PolkadotLedgerClass();
