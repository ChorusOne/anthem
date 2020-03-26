import {
  getValidatorAddressFromDelegatorAddress,
  objectHasKeys,
} from "../tools/utils";

describe("Utils test", () => {
  test("getValidatorAddressFromDelegatorAddress", () => {
    const addr = "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd";
    let result = getValidatorAddressFromDelegatorAddress(addr, "COSMOS");
    expect(result).toBe("cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707");

    result = getValidatorAddressFromDelegatorAddress("sadf", "COSMOS");
    expect(result).toBe(null);
  });

  test("objectHasKeys", () => {
    const obj = { a: "a", b: "b", c: "c" };
    let result = objectHasKeys(obj, ["a", "b", "c"]);
    expect(result).toBeTruthy();

    result = objectHasKeys(obj, ["a", "b"]);
    expect(result).toBeTruthy();

    result = objectHasKeys(obj, ["a", "b", "c", "d"]);
    expect(result).toBeFalsy();
  });
});
