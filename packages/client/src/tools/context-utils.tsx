import React from "react";
import { compose } from "react-apollo";
import { identity } from "tools/generic-utils";

/**
 * This just wraps the `compose` method with generic type abilities so the
 * consumer can pass it type information so any uses of the composed component
 * will have props type-checked correctly. Otherwise, this type information
 * is lost in the composition chain.
 */
export const composeWithProps = <T extends {}>(
  ...fns: any
): ((component: any) => (props: T) => any) => {
  return compose(...fns);
};

/**
 * "with"Context factory helper util.
 *
 * This helper takes a React context as an argument and an optional mapping
 * method for mapping context to props. It then returns HOCs which map the
 * provided context to child components using a "with" method. It is basically
 * just a util helper to more easily create composable React contexts.
 */
export const withContextFactory = <
  IContext extends {},
  IProviderProps extends {}
>(
  context: React.Context<IContext>,
  mapContextToProps: (ctx: IContext) => any = identity,
) => {
  return function providerMethod<
    P extends IProviderProps,
    R = Omit<P, keyof IProviderProps>
  >(
    Component: React.ComponentClass<P> | React.StatelessComponent<P>,
  ): React.FunctionComponent<R> {
    return (props: R) => {
      return (
        <context.Consumer>
          {value => <Component {...props} {...mapContextToProps(value)} />}
        </context.Consumer>
      );
    };
  };
};
