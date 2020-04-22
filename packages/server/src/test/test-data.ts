// Sample transactions response data to be used for testing
export const transactionsResponseData = [
  {
    hash: "4D692335E275A7180432B1B830DB4757A8901836EA14DCDBC10C445D7F34AD7F",
    height: 1587904,
    code: 0,
    gaswanted: 250000,
    gasused: 128605,
    log: [
      {
        log: "",
        events: [
          {
            type: "delegate",
            attributes: [
              {
                key: "validator",
                value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
              },
              { key: "amount", value: "410000" },
            ],
          },
          {
            type: "message",
            attributes: [
              {
                key: "sender",
                value: "cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl",
              },
              { key: "module", value: "staking" },
              {
                key: "sender",
                value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
              },
              { key: "action", value: "delegate" },
            ],
          },
          {
            type: "transfer",
            attributes: [
              {
                key: "recipient",
                value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
              },
              { key: "amount", value: "1207601uatom" },
            ],
          },
        ],
        success: true,
        msg_index: 0,
      },
    ],
    memo: "Stake online with Chorus One at https://anthem.chorus.one",
    fees: { gas: "250000", amount: [{ denom: "uatom", amount: "2500" }] },
    tags: [
      {
        key: "recipient",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      { key: "amount", value: "1207601uatom" },
      { key: "sender", value: "cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl" },
      {
        key: "validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
      { key: "amount", value: "410000" },
      { key: "module", value: "staking" },
      { key: "sender", value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350" },
      { key: "action", value: "delegate" },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "410000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2020-04-20T00:00:21.000Z",
    chain: "cosmoshub-3",
  },
  {
    hash: "BB4E11FE7C5C75D8A015EFC4D0CC4F4A8B84740A1329B6F1A851FD286E0A2069",
    height: 961054,
    code: 0,
    gaswanted: 175000,
    gasused: 126667,
    log: [
      {
        log: "",
        events: [
          {
            type: "delegate",
            attributes: [
              {
                key: "validator",
                value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
              },
              { key: "amount", value: "1156625" },
            ],
          },
          {
            type: "message",
            attributes: [
              {
                key: "sender",
                value: "cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl",
              },
              { key: "module", value: "staking" },
              {
                key: "sender",
                value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
              },
              { key: "action", value: "delegate" },
            ],
          },
          {
            type: "transfer",
            attributes: [
              {
                key: "recipient",
                value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
              },
              { key: "amount", value: "1816813uatom" },
            ],
          },
        ],
        success: true,
        msg_index: 0,
      },
    ],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "175000", amount: [{ denom: "uatom", amount: "1750" }] },
    tags: [
      {
        key: "recipient",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      { key: "amount", value: "1816813uatom" },
      { key: "sender", value: "cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl" },
      {
        key: "validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
      { key: "amount", value: "1156625" },
      { key: "module", value: "staking" },
      { key: "sender", value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350" },
      { key: "action", value: "delegate" },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "1156625" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2020-02-28T04:37:29.000Z",
    chain: "cosmoshub-3",
  },
  {
    hash: "A5C59545DCB5254BEF8E0784A1B782C2510EAA8A3E508986FF76732B09DAFE5E",
    height: 2310908,
    code: 0,
    gaswanted: 150000,
    gasused: 109381,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "476945" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-10-24T18:14:22.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "C6659FBDFC68A6B23831B3010A16504DCD1E9B1D9287459FDC11E2869A44C0B2",
    height: 2310352,
    code: 0,
    gaswanted: 150000,
    gasused: 107575,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "9222966" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-10-24T17:09:39.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "B8A0B6CF2051B815CFBDCBE06A425421FB41F44D9CAA45ACAC454DB517DC970A",
    height: 2220869,
    code: 0,
    gaswanted: 100000,
    gasused: 27913,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Float",
    fees: { gas: "100000", amount: [{ denom: "uatom", amount: "1" }] },
    tags: [
      { key: "action", value: "send" },
      { key: "sender", value: "cosmos19z4uvcy8whqanfz65xlrw6nteyaerfud3pjujh" },
      {
        key: "recipient",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgSend",
        value: {
          amount: [{ denom: "uatom", amount: "9210000" }],
          to_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          from_address: "cosmos19z4uvcy8whqanfz65xlrw6nteyaerfud3pjujh",
        },
      },
    ],
    timestamp: "2019-10-17T11:55:45.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "002D9DA885F4E3B6E672A282B0FA20C2006FE077F77AB2E9DD03EBE59BBC1D58",
    height: 2046984,
    code: 0,
    gaswanted: 150000,
    gasused: 109464,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "30621199" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-10-03T11:17:05.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "BE92E625D22DED79AE844464D53AD8E02E05A6E03BDD3C3F10AFD4D10B5DE6EE",
    height: 2035407,
    code: 0,
    gaswanted: 150000,
    gasused: 109554,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "25000000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-10-02T12:56:18.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "9BF4B06306A3BF71B301F442FE92A3BC8C1374C8C03D4D1BC6B6D2FC6B19C281",
    height: 2035299,
    code: 12,
    gaswanted: 100000,
    gasused: 100026,
    log: {
      code: 12,
      message:
        "out of gas in location: ReadPerByte; gasWanted: 100000, gasUsed: 100026",
      codespace: "sdk",
    },
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "100000", amount: [{ denom: "uatom", amount: "1000" }] },
    tags: null,
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "25000000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-10-02T12:43:46.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "851E23D5EF4C2104145DD85F46407A20A5995826AD55F71F5E7AF4B2AB07C6EC",
    height: 2035246,
    code: 0,
    gaswanted: 150000,
    gasused: 109541,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "5000000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-10-02T12:37:35.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "CEEC93DC16D6C897338F1FD688F323A4151CD172C1FEE7FE70BA723B8C702D66",
    height: 1763411,
    code: 0,
    gaswanted: 150000,
    gasused: 109499,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "750" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "30000000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-10T12:45:07.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "034440F1A569AC58085C3638E7D03AF711B3303CB9C574F2E9F7E17C5B6E12F9",
    height: 1763321,
    code: 0,
    gaswanted: 150000,
    gasused: 64755,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "withdraw_delegator_reward" },
      { key: "rewards", value: "3uatom" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "source-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgWithdrawDelegationReward",
        value: {
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-10T12:34:38.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "FC1DF75DCC1CA8DAF28017E946AAD2DECC1793DFE21515915B36779155908131",
    height: 1763285,
    code: 0,
    gaswanted: 150000,
    gasused: 64755,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "withdraw_delegator_reward" },
      { key: "rewards", value: "3uatom" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "source-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgWithdrawDelegationReward",
        value: {
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-10T12:30:25.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "57C05FDACD957D31B9292576668291507A75B3ED1590BC754FC0E10BE54CA141",
    height: 1763250,
    code: 0,
    gaswanted: 150000,
    gasused: 109426,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "750" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "1000000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-10T12:26:21.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "03624C84FFED8E63F87B6F88B7670A35C586F54D34C7DF954224370A18AD379F",
    height: 1724405,
    code: 0,
    gaswanted: 150000,
    gasused: 109469,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "1000000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-07T09:01:31.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "C543CD504F58C435912C538C4D23128F5F2A8A7AE5A50C4364DEF4E5D9B80588",
    height: 1724167,
    code: 0,
    gaswanted: 150000,
    gasused: 109419,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "750" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "500000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-07T08:33:17.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "0063860028A079244B43AE9F347027A3518FE984E1C5F809C76851D4DD24CF58",
    height: 1723963,
    code: 0,
    gaswanted: 150000,
    gasused: 109449,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "50000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-07T08:09:03.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "DB56F042D8E4A1A2560E06D0EFD7E5D3DA57F871EDE57E3389377DACC2A34B7B",
    height: 1723798,
    code: 0,
    gaswanted: 150000,
    gasused: 109508,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "1000000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-07T07:49:31.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "58983A4E1A2D72845BA29857C0749B3080C1EE9A40E3D91710C28D9AD2C92B6B",
    height: 1723334,
    code: 0,
    gaswanted: 150000,
    gasused: 101181,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "1000000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-07T06:54:51.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "76ED49ABB4867323A4C3D831E6A016E5642A266F228B8D4A9ED73CD8475218EA",
    height: 1723134,
    code: 0,
    gaswanted: 150000,
    gasused: 82376,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "Stake online with Chorus One at https://chorus.one",
    fees: { gas: "150000", amount: [{ denom: "uatom", amount: "1500" }] },
    tags: [
      { key: "action", value: "delegate" },
      {
        key: "delegator",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
      {
        key: "destination-validator",
        value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          amount: { denom: "uatom", amount: "250000" },
          delegator_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          validator_address:
            "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      },
    ],
    timestamp: "2019-09-07T06:31:24.000Z",
    chain: "cosmoshub-2",
  },
  {
    hash: "32DA97F377E1CFE5AEFF39BD3B6266A7578C71630082444097CE117A7520D957",
    height: 1714853,
    code: 0,
    gaswanted: 200000,
    gasused: 29485,
    log: [{ log: "", success: true, msg_index: "0" }],
    memo: "",
    fees: { gas: "200000", amount: [{ denom: "uatom", amount: "5000" }] },
    tags: [
      { key: "action", value: "send" },
      { key: "sender", value: "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd" },
      {
        key: "recipient",
        value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      },
    ],
    msgs: [
      {
        type: "cosmos-sdk/MsgSend",
        value: {
          amount: [{ denom: "uatom", amount: "95250000" }],
          to_address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
          from_address: "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
        },
      },
    ],
    timestamp: "2019-09-06T14:21:57.000Z",
    chain: "cosmoshub-2",
  },
];

// Sample fiat prices response data
export const fiatPriceResponseData = [
  {
    time: 1555891200,
    close: 0,
    high: 0,
    low: 0,
    open: 0,
    volumefrom: 0,
    volumeto: 0,
  },
  {
    time: 1555977600,
    close: 0,
    high: 0,
    low: 0,
    open: 0,
    volumefrom: 0,
    volumeto: 0,
  },
  {
    time: 1556064000,
    close: 3.48,
    high: 3.74,
    low: 0.001,
    open: 0.001,
    volumefrom: 47769.54,
    volumeto: 154010.77,
  },
  {
    time: 1556150400,
    close: 3.21,
    high: 3.83,
    low: 3.09,
    open: 3.48,
    volumefrom: 130937.04,
    volumeto: 444550.3,
  },
  {
    time: 1556236800,
    close: 3.54,
    high: 3.62,
    low: 3.07,
    open: 3.21,
    volumefrom: 109080.51,
    volumeto: 362568.33,
  },
];
