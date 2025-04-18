//lib.rs
use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;

declare_id!("HwKJJ4LkankpZsPrJYc5WzfU2uJjFK1f7FZYU7VCZRDu");

#[program]
pub mod nft_extensions {
    use super::*;

    /// Ініціалізація програми, викликає функцію із модуля instructions
    // pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    //     initialize::initialize(ctx)
    // }

    pub fn mint_character(
        ctx: Context<MintCharacter>,
        name: String,
        class: String,
        weapon: String,
    ) -> Result<()> {
        mint_character::mint_character(ctx, name, class, weapon)
    }

    pub fn complete_mission(ctx: Context<CompleteMission>) -> Result<()> {
        complete_mission::complete_mission(ctx)
    }
}
