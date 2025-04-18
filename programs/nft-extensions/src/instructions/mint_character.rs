//mint_character.rs
pub use crate::errors::ProgramErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::{ self, AssociatedToken },
    token_2022,
    token_interface::{ spl_token_2022::instruction::AuthorityType, Token2022 },
};
use anchor_lang::solana_program::{
    program::{invoke, invoke_signed},
    system_instruction,
    sysvar::rent::Rent,
};

use spl_token_2022::{ extension::ExtensionType, state::Mint };


pub use crate::state::character_data::CharacterMetadata;

#[derive(Accounts)]
#[instruction(name: String, class: String, weapon: String)]
pub struct MintCharacter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + CharacterMetadata::LEN,
        seeds = [b"character", payer.key().as_ref()],
        bump
    )]
    pub metadata_account: Account<'info, CharacterMetadata>,

    /// CHECK: створюється вручну
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,

    /// CHECK: створюється вручну
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn mint_character(
    ctx: Context<MintCharacter>,
    name: String,
    class: String,
    weapon: String,
) -> Result<()> {
    let mint_key = ctx.accounts.mint.key();
    let metadata_key = ctx.accounts.metadata_account.key();

    // 1. Порахувати скільки потрібно місця для mint account з розширеннями
    let extensions = &[
        ExtensionType::MetadataPointer,
        ExtensionType::NonTransferable,
    ];
    let mint_space = match
    ExtensionType::try_calculate_account_len::<Mint>(extensions)
    {
        Ok(space) => space,
        Err(_) => {
            return err!(ProgramErrorCode::InvalidMintAccountSpace);
        }
    };
    let mint_rent = Rent::get()?.minimum_balance(mint_space);

    // 2. Створити акаунт mint
    invoke(
        &system_instruction::create_account(
            ctx.accounts.payer.key,
            &mint_key,
            mint_rent,
            mint_space as u64,
            &ctx.accounts.token_program.key(),
        ),
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.mint.to_account_info(),
        ],
    )?;

    // 3. Ініціалізувати metadata pointer до metadata_account
    let ix = spl_token_2022::extension::metadata_pointer::instruction::initialize(
        &Token2022::id(),
        &mint_key,
        Some(ctx.accounts.payer.key()),
        Some(metadata_key),
    )?;
    invoke(
        &ix,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.payer.to_account_info(),
        ],
    )?;

    // 4. Ініціалізувати mint з extensions (0 decimals, NFT)
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token_2022::InitializeMint2 {
            mint: ctx.accounts.mint.to_account_info(),
        },
    );
    token_2022::initialize_mint2(cpi_ctx, 0, ctx.accounts.payer.key, Some(ctx.accounts.payer.key))?;

    // 5. Записати метадані у PDA
    let metadata = &mut ctx.accounts.metadata_account;
    metadata.authority = ctx.accounts.payer.key();
    metadata.name = name;
    metadata.class = class;
    metadata.weapon = weapon;
    metadata.level = 1;
    metadata.experience = 0;

    // 6. Створити ATA для токена
    associated_token::create(CpiContext::new(
        ctx.accounts.associated_token_program.to_account_info(),
        associated_token::Create {
            payer: ctx.accounts.payer.to_account_info(),
            associated_token: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
        },
    ))?;

    // 7. Мінтнути 1 NFT користувачу
    token_2022::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token_2022::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        1,
    )?;

    // 8. Заморозити можливість домінтити NFT
    token_2022::set_authority(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token_2022::SetAuthority {
                current_authority: ctx.accounts.payer.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
        ),
        AuthorityType::MintTokens,
        None,
    )?;

    Ok(())
}
