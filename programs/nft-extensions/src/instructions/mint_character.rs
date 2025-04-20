pub use crate::errors::ProgramErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::{ self, AssociatedToken },
    token_2022,
    token_interface::{ spl_token_2022::instruction::AuthorityType, Token2022, TokenAccount },
};
use anchor_lang::solana_program::{
    program::{invoke, invoke_signed},
    system_instruction,
    sysvar::rent::Rent,
};
use spl_token_2022::{ extension::ExtensionType, state::Mint };


pub use crate::state::character_data::CharacterMetadata;

pub fn mint_character(
    ctx: Context<MintCharacter>,
    name: String,
    class: String,
    weapon: String,
) -> Result<()> {
    let mint_space = match
    ExtensionType::try_calculate_account_len::<Mint>(&[ExtensionType::MetadataPointer])
    {
        Ok(space) => space,
        Err(_) => {
            return err!(ProgramErrorCode::InvalidMintAccountSpace);
        }
    };
    let meta_data_space = 250;
    let mint_rent = Rent::get()?.minimum_balance(mint_space + meta_data_space);

    anchor_lang::system_program::create_account(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::CreateAccount {
                from: ctx.accounts.payer.to_account_info(),
                to:   ctx.accounts.mint.to_account_info(),
            },
        ),
        mint_rent,
        mint_space as u64,
        &ctx.accounts.token_program.key()
    )?;

    anchor_lang::system_program::assign(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), anchor_lang::system_program::Assign {
            account_to_assign: ctx.accounts.mint.to_account_info(),
        }),
        &token_2022::ID
    )?;

    let init_meta_data_pointer_ix =
        spl_token_2022::extension::metadata_pointer::instruction::initialize(
            &Token2022::id(),
            &ctx.accounts.mint.key(),
            Some(ctx.accounts.nft_authority.key()),
            Some(ctx.accounts.mint.key()),
        )?;

    invoke(
        &init_meta_data_pointer_ix,
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.nft_authority.to_account_info()
        ],
    )?;

    let mint_cpi_ix = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token_2022::InitializeMint2 {
            mint: ctx.accounts.mint.to_account_info(),
        },
    );

    token_2022::initialize_mint2(
        mint_cpi_ix,
        0,
        &ctx.accounts.nft_authority.key(),
        None)?;

    let seeds = b"nft_authority";
    let bump = ctx.bumps.nft_authority;
    let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

    msg!("Init metadata {0}", ctx.accounts.nft_authority.to_account_info().key);

    let init_token_meta_data_ix = &spl_token_metadata_interface::instruction::initialize(
        &spl_token_2022::id(),
        ctx.accounts.mint.key,
        ctx.accounts.nft_authority.to_account_info().key,
        ctx.accounts.mint.key,
        ctx.accounts.nft_authority.to_account_info().key,
        name.clone(),
        "RPG".to_string(),
        "https://arweave.net/8KeqyMgFXz084BoQA_NQ44KEh-tXrkpCimc5WS8Yl1w".to_string()
    );

    invoke_signed(
        init_token_meta_data_ix,
        &[
            ctx.accounts.mint.to_account_info().clone(),
            ctx.accounts.nft_authority.to_account_info().clone(),
        ],
        signer
    )?;

    for (key, val) in [
        ("class", class.as_str()),
        ("weapon", weapon.as_str()),
        ("level", "1"),
        ("xp", "0"),
    ] {
        let ix = &spl_token_metadata_interface::instruction::update_field(
            &spl_token_2022::id(),
            ctx.accounts.mint.key,
            ctx.accounts.nft_authority.to_account_info().key,
            spl_token_metadata_interface::state::Field::Key(key.to_string()),
            val.to_string(),
        );

        invoke_signed(
            &ix,
            &[
                ctx.accounts.mint.to_account_info().clone(),
                ctx.accounts.nft_authority.to_account_info().clone(),
            ],
            signer,
        )?;
    }

    let metadata = &mut ctx.accounts.metadata_account;
    metadata.authority = ctx.accounts.payer.key();
    metadata.name = name;
    metadata.class = class;
    metadata.weapon = weapon;
    metadata.level = 1;
    metadata.xp = 0;

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

    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_2022::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.nft_authority.to_account_info(),
            },
            signer
        ),
        1,
    )?;

    token_2022::set_authority(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_2022::SetAuthority {
                current_authority: ctx.accounts.nft_authority.to_account_info(),
                account_or_mint: ctx.accounts.mint.to_account_info(),
            },
            signer
        ),
        AuthorityType::MintTokens,
        None,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct MintCharacter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,
    /// CHECK: We will create this one for the user
    #[account(mut)]
    pub token_account: AccountInfo<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(init_if_needed, seeds = [b"nft_authority".as_ref()], bump, space = 8, payer = payer)]
    pub nft_authority: Account<'info, NftAuthority>,
    #[account(
        init,
        payer = payer,
        space = 8 + CharacterMetadata::LEN,
        seeds = [b"character", payer.key().as_ref()],
        bump,
    )]
    pub metadata_account: Account<'info, CharacterMetadata>,
}

#[account]
pub struct NftAuthority {}
