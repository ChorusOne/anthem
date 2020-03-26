import { AddressProps, withAddress } from "modules/ledger/selectors";
import React, { ChangeEvent } from "react";
import { composeWithProps } from "tools/context-utils";
import { tFnString } from "tools/i18n-utils";
import { SearchInput } from "./SharedComponents";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface ComponentProps {
  tString: tFnString;
  isDesktop: boolean;
  inputWidth?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  assignInputRef?: (ref: HTMLInputElement) => void;
}

interface IProps extends AddressProps, ComponentProps {}

interface IState {
  value: string;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class AddressInputComponent extends React.Component<IProps, IState> {
  addressInputRef: any = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      value: "",
    };
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.address !== this.props.address) {
      this.setState({ value: "" });
    }
  }

  render(): JSX.Element {
    return (
      <form
        data-cy="dashboard-address-input-form"
        onSubmit={(event: ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          this.setAddress();
        }}
      >
        <SearchInput
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          assignRef={this.props.assignInputRef}
          data-cy="dashboard-address-input"
          value={this.state.value}
          onChange={this.handleEnterAddress}
          placeholder={this.props.tString(
            "Search address or transaction hash...",
          )}
          onSubmit={this.setAddress}
          style={{
            width: this.props.isDesktop
              ? this.props.inputWidth || 375
              : undefined,
          }}
        />
      </form>
    );
  }

  handleEnterAddress = (value: string) => {
    this.setState({ value });
  };

  setAddress = () => {
    this.props.setAddress(this.state.value, { showToastForError: true });
  };
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withAddress)(
  AddressInputComponent,
);
