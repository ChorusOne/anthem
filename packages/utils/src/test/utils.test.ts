import {
  assertUnreachable,
  validatorAddressToOperatorAddress,
  deriveNetworkFromAddress,
  getNetworkDefinitionFromIdentifier,
  getValidatorAddressFromDelegatorAddress,
} from "../utils";
import NETWORKS from "../networks";

describe("utils", () => {
  test("assertUnreachable", () => {
    expect(() => assertUnreachable({} as never)).toThrow();
  });

  test("validatorAddressToOperatorAddress", () => {
    expect(
      validatorAddressToOperatorAddress(
        "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      ),
    ).toBe("cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd");
  });

  test("deriveNetworkFromAddress", () => {
    let result = deriveNetworkFromAddress(
      "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
    );
    expect(result).toEqual(NETWORKS.COSMOS);

    result = deriveNetworkFromAddress(
      "terra1sszc3mgur52wuln2t3slh796mgceweqlp7zkky",
    );
    expect(result).toEqual(NETWORKS.TERRA);

    result = deriveNetworkFromAddress(
      "kava1wu8m65vqazssv2rh8rthv532hzggfr3hgtcx6j",
    );
    expect(result).toEqual(NETWORKS.KAVA);

    expect(() => deriveNetworkFromAddress("blegh")).toThrow();
  });

  test("getNetworkDefinitionFromIdentifier", () => {
    let result = getNetworkDefinitionFromIdentifier("COSMOS");
    expect(result).toEqual(NETWORKS.COSMOS);

    result = getNetworkDefinitionFromIdentifier("TERRA");
    expect(result).toEqual(NETWORKS.TERRA);

    result = getNetworkDefinitionFromIdentifier("KAVA");
    expect(result).toEqual(NETWORKS.KAVA);

    expect(() => getNetworkDefinitionFromIdentifier("blegh")).toThrow();
  });

  test("getValidatorAddressFromDelegatorAddress", () => {
    const addr = "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd";
    let result = getValidatorAddressFromDelegatorAddress(addr, "COSMOS");
    expect(result).toBe("cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707");

    result = getValidatorAddressFromDelegatorAddress("sadf", "COSMOS");
    expect(result).toBe(null);
  });
});
