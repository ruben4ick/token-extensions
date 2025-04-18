export type NftExtensions = {
  "address": "HwKJJ4LkankpZsPrJYc5WzfU2uJjFK1f7FZYU7VCZRDu",
  "metadata": {
    "name": "nft_extensions",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "complete_mission",
      "discriminator": [
        241,
        46,
        91,
        100,
        221,
        205,
        31,
        37
      ],
      "accounts": [
        {
          "name": "metadata_account",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "metadata_account"
          ]
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "nft_authority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "mint_character",
      "docs": [
        "Ініціалізація програми, викликає функцію із модуля instructions"
      ],
      "discriminator": [
        127,
        29,
        52,
        229,
        72,
        194,
        255,
        67
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "metadata_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  97,
                  114,
                  97,
                  99,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "token_account",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "class",
          "type": "string"
        },
        {
          "name": "weapon",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "CharacterMetadata",
      "discriminator": [
        77,
        152,
        83,
        116,
        63,
        164,
        19,
        190
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidMintAccountSpace",
      "msg": "Invalid Mint account space"
    },
    {
      "code": 6001,
      "name": "CantInitializeMetadataPointer",
      "msg": "Cant initialize metadata_pointer"
    },
    {
      "code": 6002,
      "name": "CantCreateMetadataAccount",
      "msg": "Cant create metadata account"
    },
    {
      "code": 6003,
      "name": "CantCreateMasterEditionAccount",
      "msg": "Cant create master edition account"
    },
    {
      "code": 6004,
      "name": "CantCreateTokenAccount",
      "msg": "Cant create token account"
    },
    {
      "code": 6005,
      "name": "CantCreateMetadataPointer",
      "msg": "Cant create metadata pointer"
    }
  ],
  "types": [
    {
      "name": "CharacterMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "class",
            "type": "string"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "experience",
            "type": "u32"
          },
          {
            "name": "weapon",
            "type": "string"
          }
        ]
      }
    }
  ];
};

export const IDL: NftExtensions = {
  "address": "HwKJJ4LkankpZsPrJYc5WzfU2uJjFK1f7FZYU7VCZRDu",
  "metadata": {
    "name": "nft_extensions",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "complete_mission",
      "discriminator": [
        241,
        46,
        91,
        100,
        221,
        205,
        31,
        37
      ],
      "accounts": [
        {
          "name": "metadata_account",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "metadata_account"
          ]
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "nft_authority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  102,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "mint_character",
      "docs": [
        "Ініціалізація програми, викликає функцію із модуля instructions"
      ],
      "discriminator": [
        127,
        29,
        52,
        229,
        72,
        194,
        255,
        67
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "metadata_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  97,
                  114,
                  97,
                  99,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "token_account",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "class",
          "type": "string"
        },
        {
          "name": "weapon",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "CharacterMetadata",
      "discriminator": [
        77,
        152,
        83,
        116,
        63,
        164,
        19,
        190
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidMintAccountSpace",
      "msg": "Invalid Mint account space"
    },
    {
      "code": 6001,
      "name": "CantInitializeMetadataPointer",
      "msg": "Cant initialize metadata_pointer"
    },
    {
      "code": 6002,
      "name": "CantCreateMetadataAccount",
      "msg": "Cant create metadata account"
    },
    {
      "code": 6003,
      "name": "CantCreateMasterEditionAccount",
      "msg": "Cant create master edition account"
    },
    {
      "code": 6004,
      "name": "CantCreateTokenAccount",
      "msg": "Cant create token account"
    },
    {
      "code": 6005,
      "name": "CantCreateMetadataPointer",
      "msg": "Cant create metadata pointer"
    }
  ],
  "types": [
    {
      "name": "CharacterMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "class",
            "type": "string"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "experience",
            "type": "u32"
          },
          {
            "name": "weapon",
            "type": "string"
          }
        ]
      }
    }
  ]
};
