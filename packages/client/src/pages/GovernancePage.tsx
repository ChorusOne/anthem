import React from "react";

import { PageContainer, PageTitle } from "components/SharedComponents";
import { I18nProps } from "tools/i18n-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IProps extends I18nProps {}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

const GovernancePage: React.FC<IProps> = (props: IProps) => {
  return (
    <PageContainer>
      <PageTitle data-cy="governance-page-title">
        {props.i18n.tString("Governance")}
      </PageTitle>
    </PageContainer>
  );
};

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default GovernancePage;
