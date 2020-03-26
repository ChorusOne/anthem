import React from "react";
import TestRenderer from "react-test-renderer";

import { composeWithProps, withContextFactory } from "tools/context-utils";

describe("context-utils", () => {
  const createWithContextMethod = () => {
    interface Ctx {
      name: string;
      enabled: boolean;
    }

    const ctxProps = {
      name: "Rachel",
      enabled: true,
    };

    const ctx = React.createContext<Ctx>(ctxProps);
    const withContextFn = withContextFactory<Ctx, Ctx>(ctx);

    return withContextFn;
  };

  test("composeWithProps", () => {
    const withFn = createWithContextMethod();

    const comp = (compProps: any) => (
      <span {...compProps}>this is the data</span>
    );

    interface Props {
      data: ReadonlyArray<string>;
    }

    const props = {
      data: ["Sam", "Joe", "Ryan"],
    };

    const Result = composeWithProps<Props>(withFn)(comp);

    const renderedOutput = TestRenderer.create(<Result {...props} />);

    expect(renderedOutput).toMatchInlineSnapshot(`
      <span
        data={
          Array [
            "Sam",
            "Joe",
            "Ryan",
          ]
        }
        enabled={true}
        name="Rachel"
      >
        this is the data
      </span>
    `);
  });

  test("withContextFactory", () => {
    const withFn = createWithContextMethod();
    expect(typeof withFn).toBe("function");
    const mappingFn = withFn((props: any) => <span {...props} />);
    const renderedOutput = TestRenderer.create(
      // @ts-ignore - do not know why it doesn't type check
      mappingFn({
        otherProps: "some more data...",
        list: ["Sam", "Joe", "Ryan"],
      }),
    );
    expect(renderedOutput).toMatchInlineSnapshot(`
            <span
              enabled={true}
              list={
                Array [
                  "Sam",
                  "Joe",
                  "Ryan",
                ]
              }
              name="Rachel"
              otherProps="some more data..."
            />
        `);
  });
});
