import { MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { Button } from "components/SharedComponents";
import { catalogs, ICatalogItem } from "i18n/catalog";
import React from "react";
import { I18nProps } from "tools/i18n-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IProps extends I18nProps {
  filterable: boolean;
  customMenuButton?: JSX.Element;
}

const LanguageSelect = Select.ofType<ICatalogItem>();

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * Reusable dropdown component to select i18n language for the dashboard.
 * ============================================================================
 */

const LanguageSelectMenu = (props: IProps) => {
  const { i18n, setLocale, customMenuButton } = props;
  const { locale } = i18n;

  // Create the menu button to represent the dropdown menu:
  const menuControl = Boolean(customMenuButton) ? (
    customMenuButton
  ) : (
    <Button
      category="SECONDARY"
      rightIcon="caret-down"
      data-cy="settings-language-select-menu"
    >
      {catalogs[locale].language}
    </Button>
  );

  return (
    <React.Fragment>
      <LanguageSelect
        items={Object.values(catalogs)}
        onItemSelect={action => setLocale(action.locale)}
        itemRenderer={(action, { handleClick, modifiers }) => {
          return (
            <MenuItem
              key={action.locale}
              onClick={handleClick}
              text={action.language}
              active={modifiers.active}
              disabled={locale === action.locale}
              data-cy={`${action.locale}-language-option`}
            />
          );
        }}
        itemPredicate={(query, language, index, exactMatch) => {
          const normalizedTitle = language.language.toLowerCase();
          const normalizedQuery = query.toLowerCase();
          return normalizedTitle.indexOf(normalizedQuery) >= 0;
        }}
      >
        {menuControl}
      </LanguageSelect>
    </React.Fragment>
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default LanguageSelectMenu;
