export const MOCK_BLOCKCHAIN_TRANSACTION_RESULT = {
  height: "2040024",
  txhash: "7B94F0C0B4CC53A32947F427DDC366A80BC8D2237481A55EEA4A235A17A40309",
  raw_log: `[{"msg_index":0,"success":true,"log":"","events":[{"type":"message","attributes":[{"key":"sender","value":"cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350"},{"key":"module","value":"bank"},{"key":"action","value":"send"}]},{"type":"transfer","attributes":[{"key":"recipient","value":"cosmos16nte2qf5l0u39s86wcwu4fff4vdtvg7yn3uksu"},{"key":"amount","value":"1000000uatom"}]}]}]`,
  logs: [
    {
      msg_index: 0,
      success: true,
      log: "",
      events: [
        {
          type: "message",
          attributes: [
            {
              key: "sender",
              value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
            },
            { key: "module", value: "bank" },
            { key: "action", value: "send" },
          ],
        },
        {
          type: "transfer",
          attributes: [
            {
              key: "recipient",
              value: "cosmos16nte2qf5l0u39s86wcwu4fff4vdtvg7yn3uksu",
            },
            { key: "amount", value: "1000000uatom" },
          ],
        },
      ],
    },
  ],
  gas_wanted: "250000",
  gas_used: "39696",
  events: [
    {
      type: "message",
      attributes: [
        {
          key: "sender",
          value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
        },
        { key: "module", value: "bank" },
        { key: "action", value: "send" },
      ],
    },
    {
      type: "transfer",
      attributes: [
        {
          key: "recipient",
          value: "cosmos16nte2qf5l0u39s86wcwu4fff4vdtvg7yn3uksu",
        },
        { key: "amount", value: "1000000uatom" },
      ],
    },
  ],
};
