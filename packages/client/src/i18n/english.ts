/** ===========================================================================
 * Primary i18n Source Catalog
 * ----------------------------------------------------------------------------
 * This is the type definition for all possible i18n text values, with
 * additional interpolated arguments if necessary. This union typed is
 * mapped to the i18n methods and the supported catalog translations to
 * type check every i18n usage in the app.
 *
 * NOTE: Running the command `yarn update-i18n` will process this file and
 * identify all the text strings by matching values between regular double
 * quotes using a regex. To use double quotes in a text string, we can use
 * the actual apostrophe characters, e.g. “my quote”, to not interfere with
 * this matching process.
 * ============================================================================
 */

/**
 * NOTE: This are the shared portfolio chart types. Some networks (e.g. Celo)
 * support custom chart views.
 */
type PORTFOLIO_CHART_TYPES =
  | "TOTAL"
  | "AVAILABLE"
  | "REWARDS"
  | "STAKING"
  | "COMMISSIONS";

export type ENGLISH =
  // LandingPage */
  | readonly ["Login"]
  | readonly ["Anthem 2019-2020. All Rights Reserved."]
  | readonly ["Earn Rewards on Cryptoassets"]
  | readonly ["LOGIN"]
  | readonly ["Connect"]
  | readonly ["Earn"]
  | readonly ["Manage"]
  | readonly ["Website"]
  | readonly ["About"]
  | readonly ["Careers"]
  | readonly ["Podcast"]
  | readonly ["Medium"]
  | readonly ["YouTube"]
  | readonly ["Telegram"]
  | readonly ["Twitter"]
  | readonly ["Discord"]
  | readonly ["Terms of Service"]
  | readonly ["Privacy Policy"]
  | readonly ["GET STARTED"]
  | readonly ["Company"]
  | readonly ["Content"]
  | readonly ["Community"]
  | readonly ["Invalid address found in URL, redirecting to login page."]

  // SideMenu */
  | readonly ["Dashboard"]
  | readonly ["Wallet"]
  | readonly ["Governance"]
  | readonly ["Settings"]
  | readonly ["Help"]
  | readonly ["Logout"]
  | readonly ["Connect an Address"]
  | readonly ["Address Connected"]
  | readonly ["Link Your Address"]
  | readonly ["LINK"]
  | readonly ["Please select a login option to begin"]
  | readonly ["Sign in with Ledger"]
  | readonly ["Sign in with address"]
  | readonly ["Change address"]
  | readonly ["Copy Address"]
  | readonly ["NETWORK:"]
  | readonly [
      "Anthem currently supports staking on Cosmos. Connect your Ledger or enter a Cosmos address to start tracking your delegations.",
    ]

  // DashboardPage */
  | readonly ["Selected"]
  | readonly ["Available"]
  | readonly ["Staking"]
  | readonly ["Rewards"]
  | readonly ["Unbonding"]
  | readonly ["Commission"]
  | readonly [PORTFOLIO_CHART_TYPES]
  | readonly ["Total"]
  | readonly ["Available"]
  | readonly ["Staking"]
  | readonly ["Rewards"]
  | readonly ["Pending"]
  | readonly ["Portfolio"]
  | readonly ["Balance"]
  | readonly ["Commissions"]
  | readonly ["Viewing"]
  | readonly ["Choose an Option..."]
  | readonly ["Please select an action first."]
  | readonly ["What do you want to do?"]
  | readonly ["Delegate"]
  | readonly ["Claim Rewards"]
  | readonly ["Error fetching balance..."]
  | readonly ["SUBMIT"]
  | readonly ["Download CSV"]
  | readonly ["Failed to download CSV data..."]
  | readonly ["No data exists yet."]
  | readonly ["Price"]
  | readonly ["Change"]
  | readonly ["Signup here."]
  | readonly ["Error fetching balance, are you sure this address exists?"]
  | readonly [
      "Please note that rewards data will not start accumulating until rewards balances are 1µatom or greater.",
    ]
  | readonly [
      "Interested in a monthly summary email about your rewards data? {{signupLink}}",
      {
        signupLink: JSX.Element;
      },
    ]

  // Chart */
  | readonly ["Unbonded"]
  | readonly ["Withdrew"]
  | readonly ["(available after 21 days)"]
  | readonly ["No ATOM balance exists yet."]
  | readonly ["No staking balance exists yet."]
  | readonly ["No commissions data exists yet."]

  // Settings Page */
  | readonly ["App Language"]
  | readonly ["Enable Dark Theme"]
  | readonly ["Disable Dark Theme"]
  | readonly ["Fiat Currency"]
  | readonly ["Choose a language"]
  | readonly ["Set your display fiat currency"]
  | readonly ["App Theme"]
  | readonly ["Loading currencies..."]
  | readonly ["Could not load currencies..."]
  | readonly ["No results."]
  | readonly ["Fiat/Crypto Currency Setting"]
  | readonly ["Email Address"]
  | readonly ["Chorus One Newsletter"]
  | readonly ["Loading..."]
  | readonly ["Signup"]
  | readonly [
      "Successfully signed up for the Chorus One newsletter. Please check your email for details.",
    ]
  | readonly [
      "Could not register your email. Is your email address typed correctly?",
    ]
  | readonly ["Monthly Rewards Summary Email"]
  | readonly ["I'm interested!"]
  | readonly ["You can signup here!"]
  | readonly [
      "An email summary delivered every month with information on the reward earnings for your address. Please enter your email below if you would be interested in receiving this in the future.",
    ]
  | readonly ["You have signed up!"]
  | readonly ["Thank you! Your interest has been recorded."]

  // Help Page */
  | readonly ["What is Anthem?"]
  | readonly [
      "Anthem is a tool to help you earn on your cryptoassets. With Anthem, you can track your portfolio and access investment opportunities. In the first version, Anthem supports staking on Cosmos. In the future, we will add other blockchains with staking, as well as other crypto-native, non-custodial investment opportunities. To stay up-to-date, follow Chorus One on {{twitterLink}} or subscribe to our {{newsletterLink}}.",
      {
        twitterLink: JSX.Element;
        newsletterLink: JSX.Element;
      },
    ]
  | readonly [" or subscribe to our "]
  | readonly ["newsletter"]
  | readonly ["How do I use Anthem?"]
  | readonly [
      "You can currently use Anthem in two ways: to track your staking investment for any Cosmos address and as a Cosmos wallet by connecting your Ledger device. Paste in your address to see important metrics, stake your Atoms, or withdraw rewards with your Ledger device. {{postLink}}",
      {
        postLink: JSX.Element;
      },
    ]
  | readonly ["You can also check out this introductory post."]
  | readonly ["What kind of data does Anthem display?"]
  | readonly [
      "Anthem currently displays transaction, balance, and reward data that is relevant to a user staking on Cosmos.",
    ]
  | readonly [
      "Your overall portfolio value adding up available, staked, unbonding, and Atoms currently in your reward, and if applicable, commissions pool.",
    ]
  | readonly [
      "Your balance that is sitting idle in your wallet. These are tokens that can immediately be accessed, e.g. to send to another address.",
    ]
  | readonly [
      "The amount of Atoms that are at stake with validators on the Cosmos Hub.",
    ]
  | readonly [
      "In the balance module, rewards show you what is currently in your reward pool. In the portfolio view, the rewards chart is plotting the rewards you earned from staking tokens over time.",
    ]
  | readonly [
      "If you've entered a validator address, information about commissions earned will be displayed. In the balance module, commissions show you the amount of commissions in that validator's pool. In the portfolio view, the commissions chart is plotting what that validator earned through commissions from his delegators.",
    ]
  | readonly [
      "Unbonding relates ATOMs that are in the process of being withdrawn from staking. These Atoms do not earn rewards anymore and will become liquid (available) once the unbonding period of currently 21 days finished.",
    ]
  | readonly ["Who should I contact with questions about Anthem?"]
  | readonly ["What will I be able to do with Anthem in the future?"]
  | readonly [
      "Anthem is a non-custodial interface to help you keep track of your holdings and interactions across blockchains, wallets, and smart contracts. Anthem will help you aggregate your data from different blockchains and wallets, display key metrics to you in a human-readable format, and help you access investment opportunities.",
    ]
  | readonly ["How can I export data from Anthem?"]
  | readonly [
      "Anthem features a handy CSV export feature that you can use for your records, e.g. to simplify your tax filing. To get your CSV report, simply click on the “Download CSV” button in the Portfolio panel after entering an address.",
    ]
  | readonly ["Who is behind Anthem?"]
  | readonly [
      "Anthem is developed by Chorus One, a startup focused on providing staking nodes and services. Please refer to {{websiteLink}} for more information.",
      {
        websiteLink: JSX.Element;
      },
    ]
  | readonly ["the Chorus One website"]
  | readonly [
      "Please join the Chorus One Community on {{telegramLink}} or {{discordLink}} to discuss about Anthem. You can also contact us via our Intercom plugin directly on the page. We are always looking for feedback, so please do not hesitate to contact us!",
      {
        telegramLink: JSX.Element;
        discordLink: JSX.Element;
      },
    ]

  // Ledger Components */
  | readonly ["Connect Your Address"]
  | readonly ["Please confirm the transaction details on your ledger device"]
  | readonly ["Ledger Connected!"]
  | readonly ["Please connect and unlock your Ledger Device..."]
  | readonly ["Sign In to Anthem"]
  | readonly ["Connect your Ledger"]
  | readonly ["Setup Delegation Transaction"]
  | readonly ["Sign Delegation Transaction"]
  | readonly ["Enter a Cosmos address to get started:"]
  | readonly ["Submit Delegation Transaction"]
  | readonly ["Delegation Transaction Submitted"]
  | readonly ["Delegation Transaction Confirmed"]
  | readonly ["Setup Rewards Claim Transaction"]
  | readonly ["Sign Rewards Claim Transaction"]
  | readonly ["Submit Rewards Claim Transaction"]
  | readonly ["Rewards Claim Transaction Submitted"]
  | readonly ["Rewards Claim Transaction Confirmed"]
  | readonly ["Connect your Ledger Device to your computer and enter your PIN."]
  | readonly ["Open the Cosmos Ledger application."]
  | readonly ["At least version v1.1.1 of Cosmos Ledger app installed."]
  | readonly ["Invalid version of the Cosmos Ledger Application found."]
  | readonly ["Please install the latest version and retry."]
  | readonly ["Retry"]
  | readonly ["Enter an Address"]
  | readonly ["Search address or transaction hash..."]
  | readonly ["Link Address"]
  | readonly ["Current address:"]
  | readonly ["Recent addresses:"]
  | readonly ["Clear all addresses"]
  | readonly ["Back"]

  // Transaction Workflow */
  | readonly ["You currently have no rewards available for withdrawal."]
  | readonly [
      "Please note that at least 1 µATOM worth of rewards is required before withdrawals can occur.",
    ]
  | readonly [
      "You have a total of {{rewards}} ({{rewardsUSD}}) rewards available to withdraw.",
      {
        rewards: JSX.Element;
        rewardsUSD: string;
      },
    ]
  | readonly ["Select the rewards you wish to withdraw from the list:"]
  | readonly ["Generate My Transaction"]
  | readonly [
      "Available balance: {{balance}} ({{balanceFiat}})",
      {
        balance: JSX.Element;
        balanceFiat: string;
      },
    ]
  | readonly ["Please enter an amount to delegate"]
  | readonly ["This network is not supported yet."]
  | readonly ["Transaction Amount (ATOM)"]
  | readonly ["Enter an amount"]
  | readonly ["Delegate All"]
  | readonly ["Default gas price: {{price}} ", { price: JSX.Element }]
  | readonly ["Enter a custom gas price."]
  | readonly ["Use the default gas price."]
  | readonly ["Note:"]
  | readonly [
      "We are currently using a default gasPrice of 0.01 µATOM, feel free to adjust this value depending on network conditions.",
    ]
  | readonly ["Gas Price (µATOM)"]
  | readonly ["Enter a gas price (µATOM)"]
  | readonly ["Gas Amount"]
  | readonly ["Enter a custom gas amount"]
  | readonly [
      "Please confirm the transaction data exactly matches what is displayed on your Ledger Device.",
    ]
  | readonly [
      "Select “Sign Transaction” to confirm the transaction details on your Ledger.",
    ]
  | readonly ["Sign Transaction"]
  | readonly ["Submitting Transaction..."]
  | readonly ["Waiting for confirmation from the blockchain..."]
  | readonly ["Transaction signed successfully!"]
  | readonly [
      "Confirm to submit your transaction to {{network}}.",
      { network: string },
    ]
  | readonly ["Cancel"]
  | readonly ["Submit"]
  | readonly ["Waiting for confirmation from the blockchain..."]
  | readonly [
      "Your transaction is successful and was included at block height {{height}}. It may take a few moments for the updates to appear in Anthem.",
      {
        height: string | number;
      },
    ]
  | readonly ["Transaction Confirmed!"]
  | readonly ["Copy Transaction Hash"]
  | readonly ["View on Mintscan"]
  | readonly ["Close"]

  // Transactions */
  | readonly ["Recent Transactions and Events"]
  | readonly ["Send"]
  | readonly ["Receive"]
  | readonly ["Vote"]
  | readonly ["Delegate"]
  | readonly ["Undelegate"]
  | readonly ["Redelegate"]
  | readonly ["Claim Rewards"]
  | readonly ["Submit Proposal"]
  | readonly ["Claim Commission"]
  | readonly ["Create Validator"]
  | readonly ["Choose Validator"]
  | readonly ["Edit Validator"]
  | readonly ["Sent"]
  | readonly ["Received"]
  | readonly ["From"]
  | readonly ["To"]
  | readonly ["Fees"]
  | readonly ["View"]
  | readonly ["Voted"]
  | readonly ["Proposal ID"]
  | readonly ["Proposer"]
  | readonly ["Title"]
  | readonly ["Description"]
  | readonly ["Delegator"]
  | readonly ["Validator"]
  | readonly ["View transaction details"]
  | readonly ["View on a block explorer"]
  | readonly ["View transaction on a block explorer"]
  | readonly ["Transaction Detail"]
  | readonly ["Transaction could not be found for hash:"]
  | readonly [
      "Warning! Transaction failed, log: {{transactionFailedLog}}",
      {
        transactionFailedLog: string;
      },
    ]

  // Toast messages */
  | readonly ["Address {{address}} copied to clipboard", { address: string }]
  | readonly ["No data found..."]
  | readonly ["Transaction hash copied."]
  | readonly [
      "Something went wrong... account information is not available right now.",
    ]
  | readonly ["The screensaver mode is currently active on the Ledger Device"]
  | readonly ["Ledger Device connected!"]
  | readonly [
      "Could not access Ledger. Is your device still connected and unlocked?",
    ]
  | readonly ["Failed to send transaction"]
  | readonly [
      "An unknown error occurred, received: {{errorString}}. Please refresh and try again.",
      { errorString: string },
    ]
  | readonly ["Logout Success."]
  | readonly ["Signing in with Ledger is currently not supported on mobile."]

  // Error Messages */
  | readonly ["This address is already connected."]
  | readonly ["This does not appear to be a valid address."]
  | readonly ["Please enter a value."]
  | readonly [
      "This appears to be a validator address. Please use the associated delegator address if you wish to view information on a validator.",
    ]
  | readonly ["Please input an amount."]
  | readonly ["Final value is greater than the maximum available."]
  | readonly ["Final amount must be greater than zero."]

  // Miscellaneous */
  | readonly ["Error fetching data..."]
  | readonly ["Are you sure you want to logout?"]
  | readonly ["Any addresses you have entered will be cleared."]
  | readonly ["Anthem encountered an error..."]
  | readonly ["Don't worry, our engineers will be on it right away!"]
  | readonly ["In the meantime you can try to reload the page."];
