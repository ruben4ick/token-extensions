use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;

declare_id!("8kN9qyN4bhaXQfaAniiy486Fn7FggGEfHmpwqeZ1Uqox");

#[program]
pub mod nft_extensions {
    use super::*;

    pub fn mint_character(
        ctx: Context<MintCharacter>,
        name: String,
        class: String,
        weapon: String,
        uri: String,
    ) -> Result<()> {
        mint_character::mint_character(ctx, name, class, weapon, uri)
    }


    pub fn complete_mission(ctx: Context<CompleteMission>,  xp_gain: u32) -> Result<()> {
        complete_mission::complete_mission(ctx, xp_gain)
    }
}
