pub use crate::state::character_data::CharacterMetadata;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Token2022;
use anchor_lang::solana_program::program::invoke_signed;
use spl_token_metadata_interface::instruction::update_field;
use spl_token_metadata_interface::state::Field;

#[derive(Accounts)]
pub struct CompleteMission<'info> {
    #[account(mut, has_one = authority)]
    pub metadata_account: Account<'info, CharacterMetadata>,
    pub authority: Signer<'info>,

    /// CHECK: Mint account of the NFT
    #[account(mut)]
    pub mint: AccountInfo<'info>,

    /// CHECK: PDA used as authority to update metadata
    #[account(
        seeds = [b"nft_authority"],
        bump,
    )]
    pub nft_authority: AccountInfo<'info>,

    pub token_program: Program<'info, Token2022>,
}

pub fn complete_mission(ctx: Context<CompleteMission>) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata_account;

    // ⚔️ Отримати випадкову кількість XP [3..7]
    let clock = Clock::get()?;
    let entropy = clock.unix_timestamp as u64;
    let xp_gain = (entropy % 5 + 3) as u32;

    metadata.experience += xp_gain;

    if metadata.experience >= 10 {
        metadata.level += 1;
        metadata.experience = 0;
    }

    msg!(
        "+{} XP! Поточний рівень: {}, досвід: {}",
        xp_gain,
        metadata.level,
        metadata.experience
    );

    // 🧠 Оновити metadata NFT
    let seeds = b"nft_authority";
    let bump = ctx.bumps.nft_authority;
    let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

    // update `level`
    invoke_signed(
        &update_field(
            &spl_token_2022::id(),
            ctx.accounts.mint.to_account_info().key,
            ctx.accounts.nft_authority.to_account_info().key,
            Field::Key("level".to_string()),
            metadata.level.to_string(),
        ),
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.nft_authority.to_account_info(),
        ],
        signer,
    )?;

    // update `xp`
    invoke_signed(
        &update_field(
            &spl_token_2022::id(),
            ctx.accounts.mint.to_account_info().key,
            ctx.accounts.nft_authority.to_account_info().key,
            Field::Key("xp".to_string()),
            metadata.experience.to_string(),
        ),
        &[
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.nft_authority.to_account_info(),
        ],
        signer,
    )?;

    Ok(())
}
