pub use crate::errors::GameErrorCode;
use crate::{state::character_data::CharacterMetadata, NftAuthority};
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Token2022};
use solana_program::program::invoke_signed;

pub fn complete_mission(ctx: Context<CompleteMission>, xp_gain: u32) -> Result<()> {
    let character = &mut ctx.accounts.character;

    if ctx.accounts.signer.key() != character.authority {
        return err!(GameErrorCode::WrongAuthority);
    }

    character.xp += xp_gain;

    // Level up if XP exceeds threshold
    let xp_threshold = (character.level as u32) * 10;
    if character.xp >= xp_threshold {
        character.level += 1;
        character.xp = 0;
    }

    // We use a PDA as a mint authority for the metadata account because we want to be able to update the NFT from
    // the program.
    let seeds = b"nft_authority";
    let bump = ctx.bumps.nft_authority;
    let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

    // Update the metadata account with an additional metadata field in this case the player level
    // Update metadata field "level"
    let ix_level = spl_token_metadata_interface::instruction::update_field(
        &spl_token_2022::id(),
        ctx.accounts.mint.to_account_info().key,
        ctx.accounts.nft_authority.to_account_info().key,
        spl_token_metadata_interface::state::Field::Key("level".to_string()),
        character.level.to_string(),
    );
    invoke_signed(
        &ix_level,
        &[
            ctx.accounts.mint.to_account_info().clone(),
            ctx.accounts.nft_authority.to_account_info().clone(),
        ],
        signer,
    )?;

    // Update metadata field "xp"
    let ix_xp = spl_token_metadata_interface::instruction::update_field(
        &spl_token_2022::id(),
        ctx.accounts.mint.to_account_info().key,
        ctx.accounts.nft_authority.to_account_info().key,
        spl_token_metadata_interface::state::Field::Key("xp".to_string()),
        character.xp.to_string(),
    );
    invoke_signed(
        &ix_xp,
        &[
            ctx.accounts.mint.to_account_info().clone(),
            ctx.accounts.nft_authority.to_account_info().clone(),
        ],
        signer,
    )?;

    msg!(
        "Mission complete! XP: {}, Level: {}",
        character.xp,
        character.level
    );

    Ok(())
}

#[derive(Accounts)]
#[instruction(level_seed: String)]
pub struct CompleteMission<'info> {
    #[account(
        mut,
        seeds = [b"character".as_ref(), character.authority.key().as_ref()],
        bump,
    )]
    pub character: Account<'info, CharacterMetadata>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,

    /// CHECK: ensure mint belongs to signer externally
    #[account(mut)]
    pub mint: AccountInfo<'info>,

    #[account(
        init_if_needed,
        seeds = [b"nft_authority"],
        bump,
        space = 8,
        payer = signer,
    )]
    pub nft_authority: Account<'info, NftAuthority>,

    pub token_program: Program<'info, Token2022>,
}
